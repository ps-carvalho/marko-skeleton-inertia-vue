import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const consoleErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    consoleErrors.push(error.message);
  });

  page.consoleErrors = consoleErrors;
});

test.afterEach(async ({ page }) => {
  const unexpectedErrors = page.consoleErrors.filter(
    (error) =>
      !error.includes(
        'Failed to load resource: the server responded with a status of 422',
      ),
  );

  expect(unexpectedErrors).toEqual([]);
});

test('landing page links to dashboard and login', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Vue pages from Marko controllers/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Open dashboard' }),
  ).toHaveAttribute('href', '/dashboard');
  await expect(page.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
    'href',
    '/login',
  );
});

test('login handles invalid and valid credentials', async ({ page }) => {
  const failedLogin = await page.request.post('/login', {
    form: {
      email: 'bad@example.com',
      password: 'wrong',
    },
  });

  expect(failedLogin.status()).toBe(422);

  await page.goto('/login');
  await page.getByLabel('Email').fill('demo@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/Welcome back, Marko User/i)).toBeVisible();
});

test('authenticated user can navigate to profile and logout', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('demo@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.getByRole('link', { name: 'Profile', exact: true }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(
    page.getByRole('main').getByText('demo@example.com'),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('primary pages have no serious accessibility violations', async ({
  page,
}) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter((violation) =>
    ['critical', 'serious'].includes(violation.impact ?? ''),
  );

  expect(seriousViolations).toEqual([]);
});
