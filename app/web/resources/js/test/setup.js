import '@testing-library/jest-dom/vitest';
import { h, reactive } from 'vue';
import { beforeEach, vi } from 'vitest';

const inertiaState = {
  formErrors: {},
  formPost: vi.fn(),
  page: reactive({
    component: 'Dashboard',
    props: {
      user: {
        name: 'Marko User',
        email: 'demo@example.com',
      },
    },
  }),
  routerPost: vi.fn(),
};

globalThis.__markoInertiaVue = inertiaState;

vi.mock('@inertiajs/vue3', () => ({
  Head: {
    props: {
      title: String,
    },
    render() {
      return h('title', this.title);
    },
  },
  Link: {
    props: {
      href: {
        required: true,
        type: String,
      },
    },
    setup(props, { attrs, slots }) {
      return () => h('a', { ...attrs, href: props.href }, slots.default?.());
    },
  },
  router: {
    post: (...args) => globalThis.__markoInertiaVue.routerPost(...args),
  },
  useForm: (initialData) =>
    reactive({
      ...initialData,
      errors: globalThis.__markoInertiaVue.formErrors,
      processing: false,
      post: globalThis.__markoInertiaVue.formPost,
    }),
  usePage: () => globalThis.__markoInertiaVue.page,
}));

beforeEach(() => {
  inertiaState.formErrors = {};
  inertiaState.formPost.mockClear();
  inertiaState.routerPost.mockClear();
  inertiaState.page.component = 'Dashboard';
  inertiaState.page.props = {
    user: {
      name: 'Marko User',
      email: 'demo@example.com',
    },
  };
});
