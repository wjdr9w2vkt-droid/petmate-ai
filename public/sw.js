// PetMate AI — Service Worker v2
// 网络优先 + 核心资源预缓存 + 图片缓存

const CACHE_STATIC = 'petmate-static-v2'
const CACHE_IMAGES = 'petmate-images-v1'
const CACHE_PAGES = 'petmate-pages-v1'

const PRECACHE = ['/', '/login', '/register', '/offline']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_STATIC && k !== CACHE_IMAGES && k !== CACHE_PAGES).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // 图片：缓存优先
  if (event.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_IMAGES).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        return cached || fetchPromise
      })
    )
    return
  }

  // 页面：网络优先
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_PAGES).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => caches.match(event.request).then((c) => c || caches.match('/offline')))
    )
    return
  }

  // API/数据请求：仅网络
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) return

  // 其他：网络优先
  event.respondWith(
    fetch(event.request)
      .then((r) => {
        if (r.ok && event.request.method === 'GET') {
          const clone = r.clone()
          caches.open(CACHE_STATIC).then((c) => c.put(event.request, clone))
        }
        return r
      })
      .catch(() => caches.match(event.request))
  )
})
