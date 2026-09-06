const CACHE='ponchumoy-arcade-final-v3-1-balanced-20260906';
const LOCAL=[
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
const THREE='https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js';

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(LOCAL);
    try{
      const r=await fetch(THREE,{mode:'cors'});
      if(r.ok) await cache.put(THREE,r.clone());
    }catch(_){ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const u=new URL(event.request.url);
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request);
        const cache=await caches.open(CACHE);
        cache.put('./index.html',fresh.clone()).catch(()=>{});
        return fresh;
      }catch(_){
        return (await caches.match(event.request)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }
  if(event.request.url===THREE){
    event.respondWith((async()=>{
      const cached=await caches.match(THREE);
      if(cached) return cached;
      const fresh=await fetch(event.request);
      if(fresh.ok){const cache=await caches.open(CACHE);cache.put(THREE,fresh.clone()).catch(()=>{});}
      return fresh;
    })());
    return;
  }
  if(u.origin===self.location.origin){
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      if(cached) return cached;
      const fresh=await fetch(event.request);
      if(fresh.ok){const cache=await caches.open(CACHE);cache.put(event.request,fresh.clone()).catch(()=>{});}
      return fresh;
    })());
  }
});
