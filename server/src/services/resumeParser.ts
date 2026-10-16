import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { IExtractedSections } from '../types';
import { extractSkillsFromText } from '../utils/skillsDictionary';

export interface ParseResult {
  extractedText: string;
  extractedSections: IExtractedSections;
  extractedSkills: string[];
  isScannedOrEmpty: boolean;
  pageCount?: number;
}

/**
 * Extracts raw text from PDF file buffer.
 */
export const extractPdfText = async (filePath: string): Promise<{ text: string; pageCount: number }> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return {
    text: data.text || '',
    pageCount: data.numpages || 1,
  };
};

/**
 * Extracts raw text from DOCX file.
 */
export const extractDocxText = async (filePath: string): Promise<{ text: string }> => {
  const result = await mammoth.extractRawText({ path: filePath });
  return {
    text: result.value || '',
  };
};

/**
 * Parses contact information using robust regex patterns.
 */
export const parseContactInfo = (text: string) => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  const phoneRegex = /(?:(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}|\b\d{10}\b)/;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:io|dev|me|com|org)\b/i;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);
  const portfolioMatch = text.match(portfolioRegex);

  return {
    email: emailMatch ? emailMatch[0].trim() : undefined,
    phone: phoneMatch ? phoneMatch[0].trim() : undefined,
    linkedin: linkedinMatch ? linkedinMatch[0].trim() : undefined,
    github: githubMatch ? githubMatch[0].trim() : undefined,
    portfolio: portfolioMatch ? portfolioMatch[0].trim() : undefined,
  };
};

/**
 * Segments raw resume text into semantic sections using header heuristics.
 */
export const segmentResumeSections = (rawText: string): IExtractedSections => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const sectionHeaders: Record<string, RegExp> = {
    summary: /^(professional\s+summary|summary|profile|about\s+me|objective|career\s+objective)$/i,
    experience: /^(work\s+experience|professional\s+experience|experience|employment\s+history|internships?)$/i,
    education: /^(education|academic\s+background|qualifications|academic\s+qualifications|academics)$/i,
    skills: /^(skills|technical\s+skills|core\s+competencies|technologies|tools\s+&\s+technologies|skills\s+&\s+abilities)$/i,
    projects: /^(projects|academic\s+projects|personal\s+projects|key\s+projects|portfolio)$/i,
    certifications: /^(certifications|licenses|certificates|achievements|courses\s+&\s+certifications)$/i,
  };

  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };

  let currentSection: string | null = null;

  for (const line of lines) {
    let matchedHeader: string | null = null;

    // Check if line looks like a header (short, matches section keywords)
    if (line.length <= 40) {
      const cleanHeader = line.replace(/[:\-_#*]/g, '').trim();
      for (const [secKey, regex] of Object.entries(sectionHeaders)) {
        if (regex.test(cleanHeader)) {
          matchedHeader = secKey;
          break;
        }
      }
    }

    if (matchedHeader) {
      currentSection = matchedHeader;
    } else if (currentSection) {
      sections[currentSection].push(line);
    } else {
      // Header-less beginning text usually acts as initial summary / bio
      if (line.length > 30) {
        sections.summary.push(line);
      }
    }
  }

  // Extract contact info
  const contactInfo = parseContactInfo(rawText);

  // Extract skills from entire text & skills section specifically
  const technicalSkills = extractSkillsFromText(
    (sections.skills.join('\n') || rawText)
  );

  return {
    summary: sections.summary.join(' ').trim() || undefined,
    workExperience: sections.experience.length > 0 ? sections.experience : undefined,
    education: sections.education.length > 0 ? sections.education : undefined,
    technicalSkills,
    projects: sections.projects.length > 0 ? sections.projects : undefined,
    certifications: sections.certifications.length > 0 ? sections.certifications : undefined,
    contactInfo,
  };
};

/**
 * Main parser entry point.
 */
export const parseResumeFile = async (filePath: string): Promise<ParseResult> => {
  const ext = path.extname(filePath).toLowerCase();
  let extractedText = '';
  let pageCount = 1;

  if (ext === '.pdf') {
    const pdfRes = await extractPdfText(filePath);
    extractedText = pdfRes.text;
    pageCount = pdfRes.pageCount;
  } else if (ext === '.docx' || ext === '.doc') {
    const docxRes = await extractDocxText(filePath);
    extractedText = docxRes.text;
  } else {
    throw new Error(`Unsupported resume file format: ${ext}`);
  }

  // Sanitize text
  const cleanText = extractedText.replace(/\r\n/g, '\n').trim();

  // Scanned PDF detection heuristic: If PDF has multiple pages or bytes but virtually 0 text
  const isScannedOrEmpty = cleanText.length < 50;

  const extractedSections = segmentResumeSections(cleanText);
  const extractedSkills = extractSkillsFromText(cleanText);

  return {
    extractedText: cleanText,
    extractedSections,
    extractedSkills,
    isScannedOrEmpty,
    pageCount,
  };
};
