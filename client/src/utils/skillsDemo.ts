const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'SQL',
  'HTML5', 'CSS3', 'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'NestJS',
  'Django', 'FastAPI', 'Spring Boot', 'Tailwind CSS', 'Redux', 'GraphQL', 'REST API',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'CI/CD', 'Git', 'Linux', 'Vitest', 'Jest', 'Cypress', 'Problem Solving', 'Team Collaboration'
];

export const extractSkillsFromText = (text: string): string[] => {
  if (!text) return [];
  const lower = text.toLowerCase();
  return POPULAR_SKILLS.filter(skill => {
    const sLower = skill.toLowerCase();
    return lower.includes(sLower);
  });
};
