<template>
  <Head title="Marko Inertia Vue" />

  <main class="min-h-screen bg-zinc-50 text-zinc-950">
    <nav class="border-b border-zinc-200 bg-white">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" class="flex items-center gap-3">
          <span class="flex h-9 w-9 items-center justify-center rounded bg-zinc-950 text-sm font-bold text-white">M</span>
          <span class="text-sm font-semibold">Marko Inertia Vue</span>
        </Link>
        <Link href="/dashboard" class="inline-flex h-10 items-center justify-center rounded bg-zinc-950 px-4 text-sm font-semibold text-white">
          Dashboard
        </Link>
      </div>
    </nav>

    <section class="mx-auto grid min-h-[720px] max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div>
        <p class="mb-5 inline-flex rounded border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
          Inertia.js implementation for Marko modules
        </p>
        <h1 class="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">Vue pages from Marko controllers.</h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
          Keep routes, middleware, auth, and data loading in PHP while Inertia renders Vue screens with Vite and Tailwind.
        </p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard" class="inline-flex h-12 items-center justify-center rounded bg-emerald-700 px-5 text-sm font-semibold text-white">
            Open dashboard
          </Link>
          <Link href="/login" class="inline-flex h-12 items-center justify-center rounded border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-950">
            Sign in
          </Link>
        </div>
      </div>

      <div class="rounded border border-zinc-200 bg-zinc-950 p-6 text-white shadow-xl shadow-zinc-200">
        <p class="text-sm font-semibold text-emerald-300">Controller response</p>
        <pre class="mt-4 overflow-x-auto text-sm leading-7 text-zinc-300"><code>#[Get('/dashboard')]
return $this-&gt;inertia-&gt;render(
    request: $request,
    component: 'Dashboard',
    assetEntry: 'app/web/resources/js/app.js',
);</code></pre>
      </div>
    </section>
  </main>
</template>

<script setup>
import { Head, Link } from '@inertiajs/vue3';
</script>
