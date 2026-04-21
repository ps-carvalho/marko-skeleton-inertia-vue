export function pageNameFromPath(path) {
  const match = path.match(
    /\/resources\/js\/pages\/(.+)\.(jsx|tsx|vue|svelte)$/,
  );

  return match ? match[1] : path;
}

export function createPageRegistry(pageModules) {
  return Object.fromEntries(
    Object.entries(pageModules).map(([path, module]) => [
      pageNameFromPath(path),
      module.default ?? module,
    ]),
  );
}

export function resolvePage(pages, name, framework = 'page') {
  const page = pages[name];

  if (page) {
    return page;
  }

  const availablePages = Object.keys(pages).sort();
  const availableMessage =
    availablePages.length > 0
      ? `. Available pages: ${availablePages.join(', ')}`
      : '';

  throw new Error(`Unknown ${framework} page: ${name}${availableMessage}`);
}
