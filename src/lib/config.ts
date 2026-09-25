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

export const SPLASHES = [
  "still debugging, it's 2am somewhere",
  'one more run, then sleep',
  "it's not a bug, it's a relic",
  "it was dns. it's always dns.",
  'exit code 0, somehow',
  'uptime is a lifestyle',
  'sudo !!',
  "reading logs so you don't have to",
] as const;
