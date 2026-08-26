const CACHE_NAME = 'controle-motos-v1';
const APP_SHELL = ['/', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first para chamadas à API/Supabase (nunca servir dados velhos do cache),
// cache-first para o shell estático do app (funciona ao abrir offline).
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;
  if (url.origin.includes('supabase.co')) return; // deixa passar direto para a rede

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
