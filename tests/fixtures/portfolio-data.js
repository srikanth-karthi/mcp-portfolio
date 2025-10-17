export const mockPortfolioData = [
  {
    id: 1,
    category: 'Profile Summary',
    title: 'Srikanth Karthikeyan - Full Stack & Cloud Engineer',
    description: 'cloud/migration engineer at Presidio',
    keywords: ['profile', 'cloud engineer', 'devops']
  },
  {
    id: 2,
    category: 'Current Position',
    title: 'Job Title',
    description: 'Devops Engineer',
    keywords: ['job title', 'devops']
  },
  {
    id: 3,
    category: 'Contact',
    title: 'Email',
    description: 'test@example.com',
    keywords: ['contact', 'email']
  },
  {
    id: 4,
    category: 'Contact',
    title: 'LinkedIn',
    description: 'https://linkedin.com/in/test',
    keywords: ['contact', 'linkedin', 'social media']
  },
  {
    id: 5,
    category: 'Tech Stack',
    title: 'Programming Languages',
    description: 'Experienced in C, C++, Java, Python, TypeScript',
    keywords: ['tech stack', 'programming', 'languages', 'python', 'java']
  },
  {
    id: 6,
    category: 'Tech Stack',
    title: 'Cloud Platforms',
    description: 'Proficient with AWS and Azure',
    keywords: ['tech stack', 'cloud', 'aws', 'azure']
  },
  {
    id: 7,
    category: 'Experience',
    title: 'Presidio',
    description: 'DevOps Engineer working on cloud migration projects',
    keywords: ['experience', 'presidio', 'devops', 'cloud migration']
  },
  {
    id: 8,
    category: 'Education',
    title: 'Engineering Degree',
    description: 'B.E. in Electronics and Communication',
    keywords: ['education', 'degree', 'engineering']
  }
];

export const emptyPortfolioData = [];

export const malformedDataPath = '/nonexistent/path/data.json';

export const validSearchQueries = [
  { query: 'cloud', expectedCount: 3 },
  { query: 'devops', expectedCount: 3 },
  { query: 'python', expectedCount: 1 },
  { query: 'nonexistent', expectedCount: 0 }
];

export const categoryTests = [
  { category: 'Contact', expectedCount: 2 },
  { category: 'Tech Stack', expectedCount: 2 },
  { category: 'Experience', expectedCount: 1 },
  { category: 'NonExistent', expectedCount: 0 }
];
