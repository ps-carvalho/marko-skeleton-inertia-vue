import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import '../css/app.css';
import { createPageRegistry, resolvePage } from './support/pages';

// Auto-discover pages from all modules
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

createInertiaApp({
  resolve: (name) => resolvePage(pages, name, 'Vue'),
  setup({ el, App, props, plugin }) {
    createApp({
      render: () => h(App, props),
    })
      .use(plugin)
      .mount(el);
  },
});
