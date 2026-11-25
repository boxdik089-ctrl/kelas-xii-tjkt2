import { routes, type VercelConfig } from '@vercel/config/v1';

const config: VercelConfig = {
  framework: 'nextjs',
  fluid: true,
  installCommand:
    'env -u npm_config_cache_dir -u NPM_CONFIG_CACHE_DIR npm install --no-fund --no-audit',
  buildCommand: 'env -u npm_config_cache_dir -u NPM_CONFIG_CACHE_DIR npm run build',
  headers: [
    routes.header('/(.*)', [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
    ])
  ]
};

export default config;
