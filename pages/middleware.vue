<script setup lang="ts">
/**
 * /middleware — Demonstrerer Vue route middleware og Nitro server middleware.
 *
 * To typer middleware i Nuxt 3:
 *
 * 1. Vue route middleware (middleware/)
 *    - Kører i browseren (+ SSR ved første load)
 *    - Kan redirecte, afbryde navigation
 *    - Global: middleware/tracking.global.ts
 *    - Named: middleware/auth.ts (aktiveres med definePageMeta)
 *
 * 2. Nitro server middleware (server/middleware/)
 *    - Kører på alle HTTP requests server-side
 *    - Kan ændre request/response, logge, validere headers
 *    - server/middleware/logging.ts
 */

useSeoMeta({ title: 'Middleware — Nuxt 3 Demo' })

const isAuthenticated = useState('auth:isAuthenticated', () => false)
const store = useDemoStore()

function toggleAuth() {
  isAuthenticated.value = !isAuthenticated.value
}

const globalMiddlewareCode = `// middleware/tracking.global.ts
// .global.ts → kører automatisk på ALLE navigationer

export default defineNuxtRouteMiddleware((to, from) => {
  // Kan læse destination (to) og kilde (from) route
  const store = useDemoStore()
  store.trackPageVisit(to.path)

  // Returner ingenting → fortsæt navigation
  // return navigateTo('/') → redirect
  // return abortNavigation() → stop navigation
})`

const namedMiddlewareCode = `// middleware/auth.ts — named middleware
// Aktiveres kun på sider der beder om det

export default defineNuxtRouteMiddleware((to) => {
  const isAuthenticated = useState('auth:isAuthenticated', () => false)

  if (!isAuthenticated.value) {
    // Redirect til login med redirect parameter
    return navigateTo({
      path: '/middleware',
      query: { redirect: to.path }
    })
  }
})

// Aktivér på en side:
// definePageMeta({ middleware: 'auth' })
// definePageMeta({ middleware: ['auth', 'logger'] })`

const serverMiddlewareCode = `// server/middleware/logging.ts
// Kører på ALLE HTTP requests (Nitro server)

export default defineEventHandler((event) => {
  const start = Date.now()

  // Tilføj response headers
  event.waitUntil(
    Promise.resolve().then(() => {
      const duration = Date.now() - start
      setResponseHeader(event, 'X-Response-Time', \`\${duration}ms\`)
      setResponseHeader(event, 'X-Powered-By', 'Nuxt3/Nitro + Loko.rs')
    })
  )
})

// Fil i server/middleware/ kører automatisk på alle routes
// Se X-Response-Time header i browser DevTools → Network`
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🔐</span>
        <span class="badge-nuxt">Middleware</span>
      </div>
      <h1 class="section-title">Middleware</h1>
      <p class="section-subtitle">
        Global og named Vue route middleware + Nitro server middleware.
        To lag — browser og server.
      </p>
    </div>

    <!-- Middleware types overview -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="p-4 rounded-xl bg-dark-800 border border-dark-600">
        <div class="flex items-center gap-2 mb-2">
          <span class="badge-nuxt">Vue Route</span>
        </div>
        <h3 class="font-medium text-slate-200 mb-1">middleware/</h3>
        <p class="text-sm text-slate-400">Kører i Vue router. Kan redirecte navigation.</p>
        <div class="mt-3 space-y-1 font-mono text-xs">
          <div class="text-slate-500">tracking<span class="text-yellow-400">.global</span>.ts</div>
          <div class="text-slate-500">auth.ts</div>
        </div>
      </div>
      <div class="p-4 rounded-xl bg-dark-800 border border-dark-600">
        <div class="flex items-center gap-2 mb-2">
          <span class="badge-nitro">Nitro Server</span>
        </div>
        <h3 class="font-medium text-slate-200 mb-1">server/middleware/</h3>
        <p class="text-sm text-slate-400">Kører på alle HTTP requests. Headers, logging.</p>
        <div class="mt-3 space-y-1 font-mono text-xs">
          <div class="text-slate-500">logging.ts</div>
        </div>
      </div>
    </div>

    <!-- Global middleware -->
    <DemoPanel
      title="tracking.global.ts — kører på alle navigationer"
      description="Sporer besøgte sider i Pinia store. Aktiveret siden du åbnede appen."
      :code="globalMiddlewareCode"
      lang="typescript"
      filename="middleware/tracking.global.ts"
      badge="nuxt"
    >
      <div class="space-y-3">
        <div>
          <div class="text-xs text-slate-500 mb-2">
            store.visitedPages (opdateres af global middleware):
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="path in store.visitedPages"
              :key="path"
              class="text-xs font-mono px-2 py-1 rounded bg-dark-700 border border-dark-600 text-nuxt-400"
            >
              {{ path }}
            </span>
            <span v-if="!store.visitedPages.length" class="text-xs text-slate-600">
              Naviger til andre sider for at se tracking
            </span>
          </div>
        </div>
        <p class="text-xs text-slate-500">
          Naviger rundt i appen — tracking.global.ts kører ved hver navigation og gemmer stien.
        </p>
      </div>
    </DemoPanel>

    <!-- Named middleware: auth -->
    <div class="mt-6">
      <DemoPanel
        title="auth.ts — named middleware med redirect"
        description="Simulér login/logout. Protected routes redirecter til /middleware ved ikke-autentificeret bruger."
        :code="namedMiddlewareCode"
        lang="typescript"
        filename="middleware/auth.ts"
        badge="nuxt"
      >
        <div class="space-y-4">
          <!-- Auth toggle -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3 p-3 rounded-lg bg-dark-700 border border-dark-600 flex-1">
              <span
                class="w-3 h-3 rounded-full transition-colors"
                :class="isAuthenticated ? 'bg-nuxt-500' : 'bg-red-500'"
              ></span>
              <span class="text-sm text-slate-200">
                isAuthenticated = <span :class="isAuthenticated ? 'text-nuxt-400' : 'text-red-400'" class="font-mono">{{ isAuthenticated }}</span>
              </span>
            </div>
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
              :class="
                isAuthenticated
                  ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                  : 'bg-nuxt-500/10 text-nuxt-400 border-nuxt-500/30 hover:bg-nuxt-500/20'
              "
              @click="toggleAuth()"
            >
              {{ isAuthenticated ? 'Log ud' : 'Log ind' }}
            </button>
          </div>

          <!-- Protected route links -->
          <div>
            <div class="text-xs text-slate-500 mb-2">
              Protected routes (kræver <code class="font-mono text-nuxt-400">middleware: 'auth'</code>):
            </div>
            <div class="flex gap-2 flex-wrap">
              <NuxtLink
                to="/dashboard"
                class="px-3 py-2 rounded-lg text-sm font-mono border border-dark-600 bg-dark-700 hover:border-nuxt-500/40 transition-all text-slate-400"
              >
                /dashboard
                <span class="text-xs ml-1">{{ isAuthenticated ? '✓' : '🔒' }}</span>
              </NuxtLink>
              <NuxtLink
                to="/admin"
                class="px-3 py-2 rounded-lg text-sm font-mono border border-dark-600 bg-dark-700 hover:border-nuxt-500/40 transition-all text-slate-400"
              >
                /admin
                <span class="text-xs ml-1">{{ isAuthenticated ? '✓' : '🔒' }}</span>
              </NuxtLink>
            </div>
            <p class="text-xs text-slate-500 mt-2">
              {{ isAuthenticated ? '✓ Du er logget ind — protected routes er tilgængelige.' : '🔒 Ikke logget ind — forsøg at åbne protected route ovenfor.' }}
            </p>
          </div>
        </div>
      </DemoPanel>
    </div>

    <!-- Server middleware -->
    <div class="mt-6">
      <DemoPanel
        title="server/middleware/logging.ts — Nitro server middleware"
        description="Tilføjer X-Response-Time og X-Powered-By headers til alle HTTP responses. Tjek Network tab i DevTools."
        :code="serverMiddlewareCode"
        lang="typescript"
        filename="server/middleware/logging.ts"
        badge="nitro"
      >
        <div class="text-sm text-slate-400 space-y-3">
          <p>
            Åbn browser DevTools → Network tab → klik på en request til
            <code class="font-mono text-blue-400">/api/posts</code> og se headers:
          </p>
          <div class="font-mono text-xs space-y-1 bg-dark-700 rounded-lg p-3">
            <div>
              <span class="text-slate-500">X-Response-Time: </span>
              <span class="text-nuxt-400">3ms</span>
            </div>
            <div>
              <span class="text-slate-500">X-Powered-By: </span>
              <span class="text-nuxt-400">Nuxt3/Nitro + Loko.rs</span>
            </div>
            <div>
              <span class="text-slate-500">X-From-Mock: </span>
              <span class="text-yellow-400">true</span>
            </div>
          </div>
        </div>
      </DemoPanel>
    </div>
  </div>
</template>
