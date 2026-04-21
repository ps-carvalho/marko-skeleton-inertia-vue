import { createInertiaApp } from '@inertiajs/vue3';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import http from 'http';
import { createPageRegistry, resolvePage } from './support/pages';

// Auto-discover pages from all modules (same patterns as client entry)
const pageModules = import.meta.glob(
  [
    '/app/**/resources/js/pages/**/*.vue',
    '!/app/**/resources/js/pages/**/*.test.vue',
    '!/app/**/resources/js/pages/**/*.spec.vue',
    '/modules/**/resources/js/pages/**/*.vue',
    '!/modules/**/resources/js/pages/**/*.test.vue',
    '!/modules/**/resources/js/pages/**/*.spec.vue',
  ],
  { eager: true },
);

const pages = createPageRegistry(pageModules);

const PORT = process.env.INERTIA_SSR_PORT || 13714;

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const page = JSON.parse(body);
      try {
        resolvePage(pages, page.component, 'Vue');
      } catch {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Unknown page: ${page.component}` }));
        return;
      }

      const { head, body: html } = await createInertiaApp({
        id: 'app',
        resolve: (name) => resolvePage(pages, name, 'Vue'),
        page,
        render: renderToString,
        setup({ App, props, plugin }) {
          return createSSRApp({ render: () => h(App, props) }).use(plugin);
        },
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          head: Array.isArray(head) ? head.join('\n') : '',
          body: html,
        }),
      );
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Inertia SSR server running on http://localhost:${PORT}`);
});
