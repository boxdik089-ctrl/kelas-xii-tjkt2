import { routes, type VercelConfig } from '@vercel/config/v1';

const config: VercelConfig = {
  framework: 'nextjs',
  fluid: true,
  headers: [
    routes.header('/(.*)', [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
    ])
  ]
};

export default config;
