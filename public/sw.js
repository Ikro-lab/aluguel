const CACHE_NAME = 'controle-motos-v2';
const APP_SHELL = ['/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

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

// Network-first para navegação (HTML) e chamadas à API/Supabase, para nunca travar
// o usuário numa versão antiga do app ou com dados velhos.
// Cache-first só para assets estáticos com hash (JS/CSS), que funcionam offline.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;
  if (url.origin.includes('supabase.co')) return; // deixa passar direto para a rede

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

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
