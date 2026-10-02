const CACHE='aura-menu-v4';
const STATIC=['./','index.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url); if(url.pathname.endsWith('/admin.html')||url.pathname.endsWith('/admin.js')||url.pathname.endsWith('/admin-config.js')||url.pathname.endsWith('/data/menu.json')) return; e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
