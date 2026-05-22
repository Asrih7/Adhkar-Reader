/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = "adhkar-app-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
];

// Install event
self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch(() => {
        // Silently fail if some files are missing
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event: FetchEvent) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip external APIs - network first with cache fallback
  if (event.request.url.includes("aladhan.com") || event.request.url.includes("api")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached response if offline
          return caches.match(event.request).then(cached => cached || new Response(JSON.stringify({ error: "offline" }), {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({ "Content-Type": "application/json" })
          }));
        })
    );
  } else {
    // Cache first, fallback to network for static assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then(fetchResponse => {
          // Cache successful responses
          if (fetchResponse && fetchResponse.status === 200) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(event.request, fetchResponse.clone()));
          }
          return fetchResponse;
        });
      }).catch(() => {
        return new Response(JSON.stringify({ error: "offline" }), {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({ "Content-Type": "application/json" })
        });
      })
    );
  }
});

// Background sync for notifications
self.addEventListener("sync", (event: any) => {
  if (event.tag === "sync-prayers") {
    event.waitUntil(syncPrayerNotifications());
  }
});

async function syncPrayerNotifications() {
  try {
    console.log("Syncing prayer notifications...");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Push notifications
self.addEventListener("push", (event: PushEvent) => {
  let data: any = {};
  try {
    data = event.data?.json() || {};
  } catch (e) {
    data = { body: event.data?.text() || "إشعار جديد" };
  }

  const config: any = {
    body: data.body || "إشعار جديد",
    icon: "/islamic-icon.png",
    badge: "/islamic-badge.png",
    tag: data.tag || "adhkar",
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "سنن و نصائح الرسول",
      config as NotificationOptions
    )
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    (self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    } as ClientQueryOptions) as Promise<WindowClient[]>).then((clientList: WindowClient[]) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow("/");
      }
      return undefined;
    })
  );
});

export {};
