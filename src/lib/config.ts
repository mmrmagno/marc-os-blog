export const SITE = {
  title: 'marc-os',
  tagline: 'infra & devops · writing things down',
  description:
    'Notes on infrastructure, devops, homelab, and whatever else I happen to be debugging at 2am.',
  author: 'Marc',
  url: 'https://marc-os.com',
  // Update these to your handles.
  social: {
    github: 'https://github.com/mmrmagno',
    email: 'mailto:hello@marc-os.com',
  },
  nav: [
    { label: '~/', href: '/' },
    { label: 'blog', href: '/blog' },
    { label: 'projects', href: '/projects' },
    { label: 'about', href: '/about' },
  ],
} as const;
