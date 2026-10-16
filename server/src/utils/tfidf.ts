/**
 * TF-IDF (Term Frequency - Inverse Document Frequency) & Cosine Similarity Calculator
 * Provides explainable, mathematical text similarity scoring between resume and job description.
 */

// Common English stop words to exclude from TF-IDF calculation
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each',
  'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up',
  'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenizes text into lowercase alphanumeric words, filtering out short words and stop words.
 */
export const tokenize = (text: string): string[] => {
  if (!text || typeof text !== 'string') return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
};

/**
 * Computes Term Frequency (TF) for a tokenized document.
 * tf(t, d) = count(t) / total_tokens_in_d
 */
export const computeTF = (tokens: string[]): Map<string, number> => {
  const tf = new Map<string, number>();
  if (tokens.length === 0) return tf;

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  // Normalize by total words
  for (const [token, count] of tf.entries()) {
    tf.set(token, count / tokens.length);
  }

  return tf;
};

/**
 * Computes Cosine Similarity between two text documents using TF-IDF weighting.
 * Returns a value between 0 and 100.
 */
export const computeTfidfCosineSimilarity = (docA: string, docB: string): number => {
  const tokensA = tokenize(docA);
  const tokensB = tokenize(docB);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return 0;
  }

  const tfA = computeTF(tokensA);
  const tfB = computeTF(tokensB);

  // Vocabulary across both documents
  const vocab = new Set<string>([...tfA.keys(), ...tfB.keys()]);

  // Compute IDF for each term across the two documents:
  // idf(t) = ln((Total docs + 1) / (Docs containing t + 1)) + 1
  const idf = new Map<string, number>();
  const totalDocs = 2;

  for (const term of vocab) {
    let docCount = 0;
    if (tfA.has(term)) docCount++;
    if (tfB.has(term)) docCount++;
    idf.set(term, Math.log((totalDocs + 1) / (docCount + 1)) + 1);
  }

  // Build TF-IDF vectors
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const term of vocab) {
    const valA = (tfA.get(term) || 0) * (idf.get(term) || 1);
    const valB = (tfB.get(term) || 0) * (idf.get(term) || 1);

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  const rawCosine = dotProduct / magnitude; // 0 to 1
  // Scale to 0 - 100 with 1 decimal precision
  const score = Math.min(100, Math.max(0, Math.round(rawCosine * 1000) / 10));
  return score;
};

/**
 * Calculates keyword coverage percentage of required terms found in candidate text.
 */
export const computeKeywordCoverage = (keywords: string[], documentText: string): number => {
  if (!keywords || keywords.length === 0) return 100; // If no required keywords specified
  const docLower = documentText.toLowerCase();

  let matched = 0;
  for (const kw of keywords) {
    const cleanKw = kw.trim().toLowerCase();
    if (cleanKw.length > 0 && docLower.includes(cleanKw)) {
      matched++;
    }
  }

  return Math.round((matched / keywords.length) * 1000) / 10;
};
