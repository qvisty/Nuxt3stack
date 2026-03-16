/**
 * Nitro server middleware — kører på ALLE requests.
 *
 * Demonstrerer Nuxt 3 server middleware (Nitro).
 * Fil i server/middleware/ køres automatisk på alle requests.
 *
 * Adskil fra Vue route middleware (middleware/):
 *  - server/middleware/ → kører på Nitro (Node/Edge)
 *  - middleware/ → kører i browseren/Vue router
 */
export default defineEventHandler((event) => {
  const start = Date.now()
  const method = event.method
  const path = event.path

  // Log request (server-side)
  console.log(`[Nitro] → ${method} ${path}`)

  // Tilføj timing header (se det i browser DevTools Network tab)
  event.waitUntil(
    Promise.resolve().then(() => {
      const duration = Date.now() - start
      setResponseHeader(event, 'X-Response-Time', `${duration}ms`)
      setResponseHeader(event, 'X-Powered-By', 'Nuxt3/Nitro + Loko.rs')
    })
  )
})
