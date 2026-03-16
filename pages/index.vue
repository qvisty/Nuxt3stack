<script setup lang="ts">
/**
 * Forside — oversigt over alle Nuxt 3 + Loko.rs features.
 *
 * Demonstrerer:
 *  - useSeoMeta (SEO meta tags)
 *  - useRuntimeConfig (miljø-variabler)
 *  - Komponent-brug
 */

useSeoMeta({
  title: 'Nuxt 3 + Loko.rs Demo',
  description:
    'Selvdokumenterende Nuxt 3 demo der viser alle kernefunktioner mens den bruger Loko.rs som Rust backend.',
  ogTitle: 'Nuxt 3 + Loko.rs Demo',
  ogDescription: 'Live demonstration af Nuxt 3 med Rust/Loko.rs backend',
})

const config = useRuntimeConfig()

const features = [
  {
    icon: '🗂️',
    title: 'Fil-baseret Routing',
    description:
      'Filer i pages/ bliver automatisk til URL-ruter. Ingen router-konfiguration nødvendig.',
    to: '/routing',
    badge: 'nuxt' as const,
    tag: 'pages/routing/index.vue → /routing',
  },
  {
    icon: '🔀',
    title: 'Dynamiske Ruter',
    description:
      '[id].vue skaber dynamiske parametre. useRoute() giver adgang til params og query.',
    to: '/routing/42',
    badge: 'nuxt' as const,
    tag: 'pages/routing/[id].vue → /routing/:id',
  },
  {
    icon: '📡',
    title: 'Data Fetching',
    description:
      'useFetch og useAsyncData henter data fra Loko.rs API med SSR-support, caching og reaktivitet.',
    to: '/data-fetching',
    badge: 'nuxt' as const,
    tag: 'useFetch("/api/posts") → Nitro → Loko.rs',
  },
  {
    icon: '⚙️',
    title: 'Server API Routes',
    description:
      'Nitro server routes i server/api/ proxyer til Loko.rs Rust backend. Type-sikre med TypeScript.',
    to: '/server-api',
    badge: 'nitro' as const,
    tag: 'server/api/posts.get.ts → Loko.rs /api/posts',
  },
  {
    icon: '🧩',
    title: 'Composables',
    description:
      'useLokoApi er en custom composable der indkapsler al Loko.rs API-logik. Auto-importeret.',
    to: '/composables',
    badge: 'nuxt' as const,
    tag: 'composables/useLokoApi.ts',
  },
  {
    icon: '🗃️',
    title: 'State Management',
    description:
      'Pinia store med tæller, favoritter og tema. Reaktiv state der deles på tværs af komponenter.',
    to: '/state',
    badge: 'pinia' as const,
    tag: 'stores/demo.ts',
  },
  {
    icon: '💧',
    title: 'SSR & Hydration',
    description:
      'useAsyncData henter data server-side. Hydration overfører state til browseren uden ekstra fetch.',
    to: '/ssr',
    badge: 'nuxt' as const,
    tag: 'useAsyncData → Server render → Hydration',
  },
  {
    icon: '🔐',
    title: 'Middleware',
    description:
      'Global og named middleware. tracking.global.ts kører på alle sider, auth.ts på valgte.',
    to: '/middleware',
    badge: 'nuxt' as const,
    tag: 'middleware/auth.ts + tracking.global.ts',
  },
]

const store = useDemoStore()
</script>

<template>
  <div class="max-w-5xl">
    <!-- Hero -->
    <div class="mb-10">
      <div class="flex items-center gap-2 mb-3">
        <span class="badge-nuxt text-sm px-3 py-1">Nuxt 3.10</span>
        <span class="badge-loko text-sm px-3 py-1">Loko.rs 0.5</span>
        <span class="badge-nitro text-sm px-3 py-1">Nitro</span>
        <span
          class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
        >Pinia</span>
      </div>

      <h1 class="text-4xl font-bold mb-3">
        <span class="gradient-nuxt">Nuxt 3</span>
        <span class="text-slate-500 mx-2">×</span>
        <span class="gradient-loko">Loko.rs</span>
      </h1>

      <p class="text-lg text-slate-300 max-w-2xl leading-relaxed">
        En selvdokumenterende full-stack demo. Hver side <strong class="text-slate-100">viser</strong> en
        Nuxt 3 feature i aktion og <strong class="text-slate-100">bruger</strong> den bagved. Backenden
        er en <span class="text-loko-400">Loko.rs</span> Rust API proxyet via
        <span class="text-blue-400">Nitro</span> server routes.
      </p>
    </div>

    <!-- Loko status -->
    <div class="mb-8">
      <LokoStatus />
    </div>

    <!-- Architecture overview -->
    <div class="mb-8 p-5 rounded-xl bg-dark-800 border border-dark-600">
      <h2 class="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
        Arkitektur
      </h2>
      <div class="font-mono text-sm text-slate-400 leading-loose">
        <div class="flex flex-wrap gap-x-3 gap-y-1 items-center">
          <span class="text-slate-200">Browser</span>
          <span class="text-slate-600">→</span>
          <span class="text-nuxt-400">Nuxt 3 (Vue 3 / SSR)</span>
          <span class="text-slate-600">→</span>
          <span class="text-blue-400">Nitro server/api/</span>
          <span class="text-slate-600">→</span>
          <span class="text-loko-400">Loko.rs (Rust/Axum)</span>
          <span class="text-slate-600">→</span>
          <span class="text-green-400">PostgreSQL</span>
        </div>
        <div class="mt-2 text-xs text-slate-600">
          runtimeConfig.lokoApiUrl = "{{ config.public.lokoApiUrl }}"
        </div>
      </div>
    </div>

    <!-- Features grid -->
    <div>
      <h2 class="section-title mb-4">Nuxt 3 Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FeatureCard
          v-for="feature in features"
          :key="feature.to"
          v-bind="feature"
        />
      </div>
    </div>

    <!-- Visited pages tracker (demonstrates global middleware) -->
    <div class="mt-8 p-4 rounded-xl bg-dark-800 border border-dark-600">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-slate-300">
          Besøgte sider
          <span class="text-xs text-slate-500 ml-1">(tracking.global.ts middleware)</span>
        </h3>
        <span class="badge-nuxt">Middleware</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="path in store.visitedPages"
          :key="path"
          class="text-xs font-mono px-2 py-1 rounded bg-dark-700 text-nuxt-400 border border-dark-600"
        >
          {{ path }}
        </span>
        <span v-if="!store.visitedPages.length" class="text-xs text-slate-600">
          Ingen besøgte sider endnu
        </span>
      </div>
    </div>
  </div>
</template>
