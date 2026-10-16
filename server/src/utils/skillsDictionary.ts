export interface SkillDefinition {
  canonical: string;
  category: 'PROGRAMMING_LANGUAGE' | 'FRAMEWORK_LIBRARY' | 'DATABASE' | 'CLOUD_DEVOPS' | 'TESTING' | 'SOFT_SKILL' | 'TOOLS';
  aliases: string[];
}

export const CANONICAL_SKILLS: SkillDefinition[] = [
  // Programming Languages
  { canonical: 'JavaScript', category: 'PROGRAMMING_LANGUAGE', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
  { canonical: 'TypeScript', category: 'PROGRAMMING_LANGUAGE', aliases: ['typescript', 'ts'] },
  { canonical: 'Python', category: 'PROGRAMMING_LANGUAGE', aliases: ['python', 'py', 'python3'] },
  { canonical: 'Java', category: 'PROGRAMMING_LANGUAGE', aliases: ['java', 'jdk', 'core java'] },
  { canonical: 'C++', category: 'PROGRAMMING_LANGUAGE', aliases: ['c++', 'cpp'] },
  { canonical: 'C#', category: 'PROGRAMMING_LANGUAGE', aliases: ['c#', 'csharp', '.net'] },
  { canonical: 'Go', category: 'PROGRAMMING_LANGUAGE', aliases: ['golang', 'go language'] },
  { canonical: 'Rust', category: 'PROGRAMMING_LANGUAGE', aliases: ['rust', 'rustlang'] },
  { canonical: 'PHP', category: 'PROGRAMMING_LANGUAGE', aliases: ['php', 'php7', 'php8'] },
  { canonical: 'Ruby', category: 'PROGRAMMING_LANGUAGE', aliases: ['ruby', 'ruby on rails', 'ror'] },
  { canonical: 'SQL', category: 'PROGRAMMING_LANGUAGE', aliases: ['sql', 't-sql', 'pl/sql', 'structured query language'] },
  { canonical: 'HTML5', category: 'PROGRAMMING_LANGUAGE', aliases: ['html', 'html5'] },
  { canonical: 'CSS3', category: 'PROGRAMMING_LANGUAGE', aliases: ['css', 'css3', 'scss', 'sass', 'less'] },
  { canonical: 'Kotlin', category: 'PROGRAMMING_LANGUAGE', aliases: ['kotlin'] },
  { canonical: 'Swift', category: 'PROGRAMMING_LANGUAGE', aliases: ['swift', 'swiftui', 'ios'] },
  { canonical: 'R', category: 'PROGRAMMING_LANGUAGE', aliases: ['r-lang', 'r language'] },

  // Frameworks & Libraries
  { canonical: 'React', category: 'FRAMEWORK_LIBRARY', aliases: ['react', 'reactjs', 'react.js'] },
  { canonical: 'Next.js', category: 'FRAMEWORK_LIBRARY', aliases: ['nextjs', 'next.js', 'next'] },
  { canonical: 'Vue.js', category: 'FRAMEWORK_LIBRARY', aliases: ['vue', 'vuejs', 'vue.js', 'nuxt'] },
  { canonical: 'Angular', category: 'FRAMEWORK_LIBRARY', aliases: ['angular', 'angularjs', 'angular 2+'] },
  { canonical: 'Node.js', category: 'FRAMEWORK_LIBRARY', aliases: ['node', 'nodejs', 'node.js'] },
  { canonical: 'Express.js', category: 'FRAMEWORK_LIBRARY', aliases: ['express', 'expressjs', 'express.js'] },
  { canonical: 'NestJS', category: 'FRAMEWORK_LIBRARY', aliases: ['nestjs', 'nest.js'] },
  { canonical: 'Django', category: 'FRAMEWORK_LIBRARY', aliases: ['django', 'django rest framework', 'drf'] },
  { canonical: 'FastAPI', category: 'FRAMEWORK_LIBRARY', aliases: ['fastapi', 'fast api'] },
  { canonical: 'Flask', category: 'FRAMEWORK_LIBRARY', aliases: ['flask'] },
  { canonical: 'Spring Boot', category: 'FRAMEWORK_LIBRARY', aliases: ['spring', 'spring boot', 'springboot'] },
  { canonical: 'Tailwind CSS', category: 'FRAMEWORK_LIBRARY', aliases: ['tailwind', 'tailwindcss'] },
  { canonical: 'Bootstrap', category: 'FRAMEWORK_LIBRARY', aliases: ['bootstrap', 'bootstrap 5'] },
  { canonical: 'Redux', category: 'FRAMEWORK_LIBRARY', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { canonical: 'GraphQL', category: 'FRAMEWORK_LIBRARY', aliases: ['graphql', 'apollo', 'relay'] },
  { canonical: 'REST API', category: 'FRAMEWORK_LIBRARY', aliases: ['rest', 'restful', 'rest api', 'web services'] },
  { canonical: 'TensorFlow', category: 'FRAMEWORK_LIBRARY', aliases: ['tensorflow', 'tf'] },
  { canonical: 'PyTorch', category: 'FRAMEWORK_LIBRARY', aliases: ['pytorch', 'torch'] },
  { canonical: 'Scikit-Learn', category: 'FRAMEWORK_LIBRARY', aliases: ['scikit-learn', 'sklearn'] },
  { canonical: 'Pandas', category: 'FRAMEWORK_LIBRARY', aliases: ['pandas'] },
  { canonical: 'NumPy', category: 'FRAMEWORK_LIBRARY', aliases: ['numpy'] },

  // Databases
  { canonical: 'MongoDB', category: 'DATABASE', aliases: ['mongodb', 'mongo', 'mongoose'] },
  { canonical: 'PostgreSQL', category: 'DATABASE', aliases: ['postgresql', 'postgres', 'psql'] },
  { canonical: 'MySQL', category: 'DATABASE', aliases: ['mysql', 'mariadb'] },
  { canonical: 'Redis', category: 'DATABASE', aliases: ['redis'] },
  { canonical: 'SQLite', category: 'DATABASE', aliases: ['sqlite', 'sqlite3'] },
  { canonical: 'Oracle DB', category: 'DATABASE', aliases: ['oracle database', 'oracle db'] },
  { canonical: 'Firebase', category: 'DATABASE', aliases: ['firebase', 'firestore'] },
  { canonical: 'Elasticsearch', category: 'DATABASE', aliases: ['elasticsearch', 'elk stack'] },
  { canonical: 'DynamoDB', category: 'DATABASE', aliases: ['dynamodb', 'aws dynamodb'] },

  // Cloud & DevOps
  { canonical: 'Docker', category: 'CLOUD_DEVOPS', aliases: ['docker', 'docker compose', 'containerization'] },
  { canonical: 'Kubernetes', category: 'CLOUD_DEVOPS', aliases: ['kubernetes', 'k8s'] },
  { canonical: 'AWS', category: 'CLOUD_DEVOPS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'] },
  { canonical: 'Google Cloud (GCP)', category: 'CLOUD_DEVOPS', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { canonical: 'Microsoft Azure', category: 'CLOUD_DEVOPS', aliases: ['azure', 'microsoft azure'] },
  { canonical: 'CI/CD', category: 'CLOUD_DEVOPS', aliases: ['ci/cd', 'cicd', 'continuous integration', 'github actions', 'jenkins', 'gitlab ci'] },
  { canonical: 'Terraform', category: 'CLOUD_DEVOPS', aliases: ['terraform', 'iac', 'infrastructure as code'] },
  { canonical: 'Linux', category: 'CLOUD_DEVOPS', aliases: ['linux', 'ubuntu', 'centos', 'debian', 'bash', 'shell scripting'] },
  { canonical: 'Nginx', category: 'CLOUD_DEVOPS', aliases: ['nginx'] },

  // Testing
  { canonical: 'Jest', category: 'TESTING', aliases: ['jest'] },
  { canonical: 'Vitest', category: 'TESTING', aliases: ['vitest'] },
  { canonical: 'Cypress', category: 'TESTING', aliases: ['cypress'] },
  { canonical: 'Playwright', category: 'TESTING', aliases: ['playwright'] },
  { canonical: 'Mocha', category: 'TESTING', aliases: ['mocha', 'chai'] },
  { canonical: 'JUnit', category: 'TESTING', aliases: ['junit'] },
  { canonical: 'Selenium', category: 'TESTING', aliases: ['selenium'] },

  // Tools & Architecture
  { canonical: 'Git', category: 'TOOLS', aliases: ['git', 'github', 'gitlab', 'version control'] },
  { canonical: 'Postman', category: 'TOOLS', aliases: ['postman', 'insomnia'] },
  { canonical: 'Microservices', category: 'TOOLS', aliases: ['microservices', 'distributed systems'] },
  { canonical: 'System Design', category: 'TOOLS', aliases: ['system design', 'software architecture'] },
  { canonical: 'Agile/Scrum', category: 'TOOLS', aliases: ['agile', 'scrum', 'jira', 'kanban'] },
  { canonical: 'Webpack / Vite', category: 'TOOLS', aliases: ['webpack', 'vite'] },

  // Soft Skills
  { canonical: 'Problem Solving', category: 'SOFT_SKILL', aliases: ['problem solving', 'analytical skills', 'troubleshooting', 'critical thinking'] },
  { canonical: 'Communication', category: 'SOFT_SKILL', aliases: ['communication', 'verbal communication', 'presentation skills', 'written communication'] },
  { canonical: 'Team Collaboration', category: 'SOFT_SKILL', aliases: ['teamwork', 'collaboration', 'cross-functional', 'team player'] },
  { canonical: 'Time Management', category: 'SOFT_SKILL', aliases: ['time management', 'prioritization', 'multitasking'] },
  { canonical: 'Leadership', category: 'SOFT_SKILL', aliases: ['leadership', 'mentoring', 'team lead', 'project management'] },
  { canonical: 'Adaptability', category: 'SOFT_SKILL', aliases: ['adaptability', 'fast learner', 'flexibility', 'continuous learning'] },
];

/**
 * Extracts recognized canonical skills from raw text using boundary matching and alias lookup.
 */
export const extractSkillsFromText = (rawText: string): string[] => {
  if (!rawText || typeof rawText !== 'string') return [];

  // Lowercase and remove punctuation noise while preserving chars like +, #, .
  const normalized = ' ' + rawText.toLowerCase().replace(/[\r\n\t]/g, ' ') + ' ';
  const matched = new Set<string>();

  for (const skill of CANONICAL_SKILLS) {
    // Check aliases
    for (const alias of skill.aliases) {
      // Escape alias for regex
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Look for boundary: preceded by boundary/start, followed by delimiter/end
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#])${escaped}(?=[\\s,;:.!?()\\[\\]{}"'\\/]|$)`, 'i');
      if (regex.test(normalized)) {
        matched.add(skill.canonical);
        break;
      }
    }
  }

  return Array.from(matched).sort();
};

/**
 * Maps a skill string to its canonical skill name if recognized.
 */
export const findCanonicalSkill = (skillInput: string): string => {
  const clean = skillInput.trim().toLowerCase();
  for (const skill of CANONICAL_SKILLS) {
    if (skill.canonical.toLowerCase() === clean || skill.aliases.includes(clean)) {
      return skill.canonical;
    }
  }
  return skillInput.trim();
};
