# Marko Inertia Vue Skeleton - Agent Guide

This is a standalone `composer create-project` skeleton for Marko applications using Inertia.js and Vue 3.

## Commands

```bash
composer install
npm install
composer dev
npm run build
npm run build:ssr
vendor/bin/pest
```

## Project Shape

- PHP 8.5+
- Composer project package: `marko/skeleton-inertia-vue`
- Marko app module: `app/web`
- PHP namespace: `App\Web\`
- Frontend entry: `app/web/resources/js/app.js`
- SSR entry: `app/web/resources/js/ssr.js`
- CSS entry: `app/web/resources/css/app.css`

The app intentionally contains only one Inertia adapter. Do not add React or Svelte dependencies, routes, components, or Vite inputs to this skeleton.

## Conventions

- Every PHP file starts with `<?php` and `declare(strict_types=1);`.
- Controllers stay thin and delegate application logic to services.
- Routes use Marko route attributes.
- Tests use Pest and live under `tests/`.
- Do not commit `vendor/`, `node_modules/`, `public/build/`, session files, or generated SSR output.
