// Allahul Musta'an Institute service worker.
// Speeds up repeat opens by keeping the app's own files (JS, CSS, images) on the phone.
// It NEVER caches API calls or pages, so student data is always fresh and never stored here.
const CACHE = 'ami-static-v1';
const MAX_ENTRIES = 150;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('ami-static-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_ENTRIES) {
    await Promise.all(keys.slice(0, keys.length - MAX_ENTRIES).map((k) => cache.delete(k)));
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;           // never touch the API
  if (!url.pathname.startsWith('/assets/')) return;       // pages always come from the network

  // Build files have a unique hash in their name, so a cached copy is always correct.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) { cache.put(req, res.clone()).then(() => trim(cache)); }
      return res;
    })
  );
});
