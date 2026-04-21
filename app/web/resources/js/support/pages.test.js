import { describe, expect, test } from 'vitest';
import { createPageRegistry, pageNameFromPath, resolvePage } from './pages';

describe('Vue page registry', () => {
  test('converts page paths to Inertia component names', () => {
    expect(
      pageNameFromPath('/app/web/resources/js/pages/Admin/Users.vue'),
    ).toBe('Admin/Users');
  });

  test('registers default exports by page name', () => {
    const Dashboard = { name: 'Dashboard' };
    const pages = createPageRegistry({
      '/app/web/resources/js/pages/Dashboard.vue': { default: Dashboard },
    });

    expect(resolvePage(pages, 'Dashboard', 'Vue')).toBe(Dashboard);
  });

  test('throws an actionable error for unknown pages', () => {
    expect(() => resolvePage({ Dashboard: {} }, 'Missing', 'Vue')).toThrow(
      'Unknown Vue page: Missing. Available pages: Dashboard',
    );
  });
});
