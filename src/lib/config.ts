export const SITE = {
  title: 'marc-os',
  tagline: 'Personal Website, and Blog',
  description:
    'Notes on infrastructure, devops, homelab, and whatever else I happen to be debugging at 2am.',
  author: 'Marc',
  url: 'https://marc-os.com',
  // Update these to your handles.
  social: {
    github: 'https://github.com/mmrmagno',
    linkedin: 'https://www.linkedin.com/in/marcos-magno-biriba-ribeiro-1ab200243/',
    email: 'mailto:contact@marc-os.com',
  },
  nav: [
    { label: '~/', href: '/' },
    { label: 'blog', href: '/blog' },
    { label: 'projects', href: '/projects' },
    { label: 'about', href: '/about' },
  ],
} as const;
