/* SushiHouse PWA: offline app shell only. Do not cache private API responses. */
const CACHE='sushihouse-shell-v1';
const APP_SHELL=['./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('sushihouse-shell-')&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()]));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).catch(()=>caches.match('./index.html')));
  return;
 }
 if(APP_SHELL.some(path=>new URL(path,self.registration.scope).href===request.url)){
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
 }
});
