// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'decap-backoffice-dev-rewrite',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            if (url === '/backoffice' || url === '/backoffice/') {
              req.url = '/backoffice/index.html';
            } else if (url === '/admin' || url === '/admin/') {
              res.writeHead(301, { Location: '/backoffice/' });
              res.end();
              return;
            } else if (url.startsWith('/admin/')) {
              res.writeHead(301, { Location: url.replace('/admin/', '/backoffice/') });
              res.end();
              return;
            }
            next();
          });
        }
      }
    ]
  }
});
