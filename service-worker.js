// Service Worker - Pulseras con Hilos
// Hace que la app funcione sin conexión tras la primera visita

const CACHE_NAME = "pulseras-v4";
const ARCHIVOS_CACHE = [
  "./",
  "./index.html",
  "./estilos.css",
  "./app.js",
  "./datos.js",
  "./manifest.json",
  "./iconos/icono-192.png",
  "./iconos/icono-512.png",
  "./infografias/nudo-basico-macrame.jpg",
  "./infografias/pulsera-celta-nudo-de-serpiente.jpg",
  "./infografias/pulsera-chevron-espiga.jpg",
  "./infografias/pulsera-espiral.jpg",
  "./infografias/pulsera-trenzada-3-hilos.jpg"
];

// Instalación: cachear los archivos
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Cacheando archivos");
      return cache.addAll(ARCHIVOS_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activación: limpiar cachés antiguas
self.addEventListener("activate", (event) => {
  console.log("[SW] Activando...");
  event.waitUntil(
    caches.keys().then((nombres) => {
      return Promise.all(
        nombres.map((nombre) => {
          if (nombre !== CACHE_NAME) {
            console.log("[SW] Borrando caché antigua:", nombre);
            return caches.delete(nombre);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: servir desde caché, si no hay, red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((responseFetch) => {
        if (event.request.method !== "GET") return responseFetch;
        const url = new URL(event.request.url);
        if (url.origin !== self.location.origin) return responseFetch;

        const copia = responseFetch.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copia);
        });
        return responseFetch;
      });
    })
  );
});
