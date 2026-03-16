<script setup lang="ts">
const route = useRoute()

const navItems = [
  {
    label: 'Oversigt',
    icon: '🏠',
    to: '/',
    description: 'Projektoversigt',
  },
  {
    label: 'Fil-baseret Routing',
    icon: '🗂️',
    to: '/routing',
    description: 'pages/ → URL',
  },
  {
    label: 'Dynamiske Ruter',
    icon: '🔀',
    to: '/routing/42',
    description: '[id].vue params',
  },
  {
    label: 'Data Fetching',
    icon: '📡',
    to: '/data-fetching',
    description: 'useFetch + useAsyncData',
  },
  {
    label: 'Server API Routes',
    icon: '⚙️',
    to: '/server-api',
    description: 'Nitro → Loko.rs',
  },
  {
    label: 'Composables',
    icon: '🧩',
    to: '/composables',
    description: 'useLokoApi hook',
  },
  {
    label: 'State Management',
    icon: '🗃️',
    to: '/state',
    description: 'Pinia store',
  },
  {
    label: 'SSR & Hydration',
    icon: '💧',
    to: '/ssr',
    description: 'Server-side rendering',
  },
  {
    label: 'Middleware',
    icon: '🔐',
    to: '/middleware',
    description: 'Route guards',
  },
]

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top header bar -->
    <header
      class="sticky top-0 z-50 bg-dark-900/80 backdrop-blur border-b border-dark-700"
    >
      <div class="flex items-center justify-between px-4 py-3 max-w-screen-2xl mx-auto">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="flex items-center gap-1">
            <span class="text-2xl">▲</span>
            <span class="text-xl font-bold gradient-nuxt">Nuxt 3</span>
          </div>
          <span class="text-dark-400">×</span>
          <div class="flex items-center gap-1">
            <span class="text-xl">🚂</span>
            <span class="text-xl font-bold gradient-loko">Loko.rs</span>
          </div>
          <span class="text-xs text-slate-500 hidden sm:block ml-1">Demo</span>
        </NuxtLink>

        <!-- Right side badges -->
        <div class="flex items-center gap-3">
          <span class="badge-nuxt">Nuxt 3.10</span>
          <span class="badge-loko">Loko.rs</span>
          <span class="badge-nitro hidden sm:inline-flex">Nitro</span>
        </div>
      </div>
    </header>

    <!-- Main layout -->
    <div class="flex flex-1 max-w-screen-2xl mx-auto w-full">
      <!-- Sidebar navigation -->
      <aside
        class="hidden lg:flex flex-col w-64 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto border-r border-dark-700 py-4 px-3"
      >
        <p class="text-xs text-slate-500 uppercase tracking-wider px-3 mb-2">
          Nuxt 3 Funktioner
        </p>
        <nav class="space-y-0.5">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            :class="{ active: isActive(item.to) }"
          >
            <span class="text-base leading-none">{{ item.icon }}</span>
            <div class="flex flex-col min-w-0">
              <span class="font-medium truncate">{{ item.label }}</span>
              <span class="text-xs text-slate-500 truncate">{{ item.description }}</span>
            </div>
          </NuxtLink>
        </nav>

        <!-- Footer info in sidebar -->
        <div class="mt-auto pt-4 border-t border-dark-700 px-3">
          <div class="text-xs text-slate-500 space-y-1">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-nuxt-500 inline-block"></span>
              Vue 3 + Composition API
            </div>
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
              TypeScript
            </div>
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-loko-500 inline-block"></span>
              Loko.rs (Rust/Axum)
            </div>
          </div>
        </div>
      </aside>

      <!-- Page content -->
      <main class="flex-1 min-w-0 p-6 lg:p-8">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
