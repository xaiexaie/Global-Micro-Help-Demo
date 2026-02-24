const CACHE = 'gmhe-cache-v1';
const OFFLINE_URL = '/index.html';
self.addEventListener('install', event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll([
      '/', '/index.html', '/styles.css', '/app.js', '/manifest.json'
    ]))
  );
  self.skipWaiting();
});
self.addEventListener('activate', event=>{
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event=>{
  const req = event.request;
  if(req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached=> cached || fetch(req).then(r=>{
      if(req.url.startsWith(self.location.origin)){
        caches.open(CACHE).then(cache=>cache.put(req, r.clone()));
      }
      return r;
    }).catch(()=> caches.match(OFFLINE_URL)))
  );
});
