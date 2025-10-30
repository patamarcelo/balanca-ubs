/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// 1) Faz o SW assumir os clientes assim que ACTIVATED
clientsClaim();

// 2) Precache dos assets com hash + limpeza do que ficou obsoleto
// __WB_MANIFEST é injetado no build do CRA
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// 3) App-shell routing -> index.html
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// 4) Runtime cache só para imagens da mesma origem (não faça runtime de JS/CSS)
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

// 5) Atualização imediata quando o app mandar SKIP_WAITING
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 6) (Opcional) Ativa Navigation Preload para acelerar primeira navegação
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Garante que o novo SW assuma sem precisar fechar abas
    await self.clients.claim();
    // Tenta habilitar navigation preload (nem todo browser tem)
    if ('navigationPreload' in self.registration) {
      try { await self.registration.navigationPreload.enable(); } catch (_) { }
    }
  })());
});
