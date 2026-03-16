/**
 * Global Vue route middleware — kører på ALLE sidenavigationer.
 *
 * Nuxt 3 middleware navngivning:
 *   tracking.global.ts → kører globalt (ikke kun på specifikke ruter)
 *   auth.ts           → bruges eksplicit med definePageMeta({ middleware: 'auth' })
 *
 * Adskil fra server middleware:
 *   middleware/       → Vue router (browser + SSR navigation)
 *   server/middleware/→ Nitro server (alle HTTP requests)
 */
export default defineNuxtRouteMiddleware((to) => {
  // Spoer besøgte sider i Pinia store
  const store = useDemoStore()
  store.trackPageVisit(to.path)

  // (Ingen redirect her — det er bare tracking)
})
