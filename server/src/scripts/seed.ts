import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import { User, hashPassword } from '../models/User';
import { Job } from '../models/Job';
import { SkillTaxonomy } from '../models/SkillTaxonomy';
import { CANONICAL_SKILLS } from '../utils/skillsDictionary';
import { env } from '../config/env';

const sampleJobs = [
  {
    title: 'Full Stack Software Engineer',
    company: 'Apex Cloud Solutions',
    description: 'We are seeking a versatile Full Stack Engineer to build high-scale web platforms and APIs. You will collaborate with product designers and backend architects to deliver reactive UIs, secure REST/GraphQL microservices, and manage database scalability. Experience with React, Node.js, TypeScript, and MongoDB or PostgreSQL is essential.',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST API', 'Git'],
    preferredSkills: ['Docker', 'AWS', 'Tailwind CSS', 'Next.js'],
    location: 'Bangalore, India (Hybrid)',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    salaryRange: '₹12,00,000 - ₹18,00,000 PA',
    applicationUrl: 'https://example.com/careers/apex-fullstack',
    source: 'Campus Placement / Tech Partner',
    isSampleData: true,
    status: 'ACTIVE',
  },
  {
    title: 'Frontend React Developer',
    company: 'NextGen Interfaces',
    description: 'Join our design-forward engineering team constructing modern, accessible, and high-performance user interfaces. You should have deep expertise in React 18, TypeScript, Tailwind CSS, component state management, and web performance profiling.',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git'],
    preferredSkills: ['Next.js', 'Redux', 'Vitest', 'Cypress'],
    location: 'Remote',
    employmentType: 'FULL_TIME',
    experienceLevel: 'ENTRY',
    salaryRange: '₹6,00,000 - ₹9,50,000 PA',
    applicationUrl: 'https://example.com/careers/nextgen-frontend',
    source: 'Campus Placement / Tech Partner',
    isSampleData: true,
    status: 'ACTIVE',
  },
  {
    title: 'Backend Systems & API Engineer',
    company: 'FinSphere Technologies',
    description: 'FinSphere is expanding its core transaction processing engine. You will design, build, and optimize high-throughput RESTful services, database schemas, and asynchronous queues. Strong knowledge of Node.js/Express, relational database indexing (PostgreSQL), Redis caching, and Docker containerization is required.',
    requiredSkills: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'REST API'],
    preferredSkills: ['Kubernetes', 'Microservices', 'AWS', 'CI/CD'],
    location: 'Hyderabad, India (On-site)',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    salaryRange: '₹14,00,000 - ₹20,00,000 PA',
    applicationUrl: 'https://example.com/careers/finsphere-backend',
    source: 'Campus Placement / Tech Partner',
    isSampleData: true,
    status: 'ACTIVE',
  },
  {
    title: 'Junior Machine Learning & Data Engineer',
    company: 'DataCognition AI Labs',
    description: 'Looking for a passionate junior ML engineer or fresh graduate with strong Python, mathematical foundations, and data preprocessing experience. You will assist in training LLM pipelines, extracting tabular features with Pandas/NumPy, and building FastAPI inference endpoints.',
    requiredSkills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'FastAPI', 'SQL'],
    preferredSkills: ['PyTorch', 'TensorFlow', 'Docker', 'Git'],
    location: 'Pune, India (Hybrid)',
    employmentType: 'FULL_TIME',
    experienceLevel: 'ENTRY',
    salaryRange: '₹7,00,000 - ₹11,00,000 PA',
    applicationUrl: 'https://example.com/careers/datacognition-ml',
    source: 'Campus Placement / Tech Partner',
    isSampleData: true,
    status: 'ACTIVE',
  },
  {
    title: 'Cloud DevOps & Infrastructure Engineer',
    company: 'SkyScale Systems',
    description: 'Maintain and automate cloud infrastructure, CI/CD deployment pipelines, and observability monitoring. Ideal candidate has practical experience with Linux administration, Docker containerization, Kubernetes clusters, GitHub Actions, and AWS infrastructure as code (Terraform).',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git'],
    preferredSkills: ['Terraform', 'Nginx', 'Python', 'Prometheus'],
    location: 'Bangalore, India (On-site)',
    employmentType: 'FULL_TIME',
    experienceLevel: 'MID',
    salaryRange: '₹15,00,000 - ₹22,00,000 PA',
    applicationUrl: 'https://example.com/careers/skyscale-devops',
    source: 'Campus Placement / Tech Partner',
    isSampleData: true,
    status: 'ACTIVE',
  },
  {
    title: 'Software Development Engineer - Intern (BCA/B.Tech)',
    company: 'InnoByte Software',
    description: 'Exciting 6-month software development internship for final-year students. You will receive mentorship while working on real customer-facing features using modern JavaScript/TypeScript, React, and REST APIs. Opportunity for full-time conversion based on performance.',
    requiredSkills: ['JavaScript', 'HTML5', 'CSS3', 'Git', 'Problem Solving'],
    preferredSkills: ['React', 'Node.js', 'MongoDB', 'Python'],
    location: 'Remote / Bangalore',
    employmentType: 'INTERNSHIP',
    experienceLevel: 'ENTRY',
    salaryRange: '₹25,000 - ₹40,000 / month Stipend',
    applicationUrl: 'https://example.com/careers/innobyte-intern',
    source: 'University Relations',
    isSampleData: true,
    status: 'ACTIVE',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Starting database initialization...');

    // 1. Seed or update Admin User
    const existingAdmin = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
    if (!existingAdmin) {
      const passwordHash = await hashPassword(env.ADMIN_PASSWORD);
      await User.create({
        name: 'System Administrator',
        email: env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: 'ADMIN',
        emailVerified: true,
      });
      console.log(`[Seed] Created Admin User: ${env.ADMIN_EMAIL}`);
    } else {
      console.log(`[Seed] Admin User already present: ${env.ADMIN_EMAIL}`);
    }

    // 2. Seed or update Demo Student User
    const demoStudentEmail = 'student@careerlens.ai';
    const existingStudent = await User.findOne({ email: demoStudentEmail });
    if (!existingStudent) {
      const passwordHash = await hashPassword('Student2027!');
      await User.create({
        name: 'Rahul Sharma (Student Demo)',
        email: demoStudentEmail,
        passwordHash,
        role: 'USER',
        emailVerified: true,
      });
      console.log(`[Seed] Created Demo Student User: ${demoStudentEmail}`);
    }

    // 3. Seed Canonical Skills Taxonomy
    console.log('[Seed] Seeding Canonical Skills Taxonomy...');
    for (const skill of CANONICAL_SKILLS) {
      await SkillTaxonomy.findOneAndUpdate(
        { name: skill.canonical },
        {
          name: skill.canonical,
          category: skill.category,
          synonyms: skill.aliases,
          popularityScore: 75,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${CANONICAL_SKILLS.length} canonical skills in taxonomy.`);

    // 4. Seed Curated Jobs
    console.log('[Seed] Seeding sample job listings...');
    for (const job of sampleJobs) {
      await Job.findOneAndUpdate(
        { title: job.title, company: job.company },
        job,
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${sampleJobs.length} curated jobs successfully.`);

    console.log('[Seed] Database initialization completed successfully! 🎉');
    await disconnectDB();
    process.exit(0);
  } catch (err: any) {
    console.error('[Seed Error] Failed to seed database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
