const CACHE_NAME = 'lovetools-v2';
const APP_SHELL = ['/', '/manifest.webmanifest', '/assets/style.css', '/assets/app.js', '/assets/favicon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match('/'))));
});

// Monetag service-worker integration.
self.options = {
  "domain": "5gvci.com",
  "zoneId": 12241359
};
self.lary = "";
importScripts("https://5gvci.com/act/files/service-worker.min.js?r=sw");
