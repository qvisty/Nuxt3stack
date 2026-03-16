<script setup lang="ts">
/**
 * /routing — Demonstrerer fil-baseret routing i Nuxt 3.
 *
 * Denne fils placering ER demonstrationen:
 *   pages/routing/index.vue → tilgængelig på /routing
 *
 * Nuxt 3 routing-regler:
 *   pages/index.vue         → /
 *   pages/about.vue         → /about
 *   pages/routing/index.vue → /routing
 *   pages/routing/[id].vue  → /routing/:id
 *   pages/[...slug].vue     → catch-all
 */

useSeoMeta({ title: 'Fil-baseret Routing — Nuxt 3 Demo' })

const route = useRoute()

const routingExamples = [
  { file: 'pages/index.vue', url: '/', description: 'Forside' },
  { file: 'pages/routing/index.vue', url: '/routing', description: 'Denne side' },
  { file: 'pages/routing/[id].vue', url: '/routing/:id', description: 'Dynamisk parameter' },
  { file: 'pages/data-fetching.vue', url: '/data-fetching', description: 'Flad fil' },
  { file: 'pages/[...slug].vue', url: '/hvad-som-helst', description: 'Catch-all (wildcard)' },
]

const routingCode = `// pages/routing/index.vue
// Denne fils placering definerer ruten: /routing

// Brug useRoute() for at læse nuværende route
const route = useRoute()

console.log(route.path)     // "/routing"
console.log(route.name)     // "routing"
console.log(route.fullPath) // "/routing"
console.log(route.query)    // {}
console.log(route.params)   // {}

// Fil-struktur → URL mapping:
// pages/
//   index.vue          → /
//   about.vue          → /about
//   routing/
//     index.vue        → /routing       ← du er her
//     [id].vue         → /routing/:id
//   blog/
//     [slug].vue       → /blog/:slug
//   [...catchAll].vue  → /* (wildcard)`

const nuxtConfigCode = `// nuxt.config.ts
// Ingen router-konfiguration nødvendig!
// Nuxt 3 genererer vue-router config automatisk
// fra pages/ mappestruktur.

export default defineNuxtConfig({
  // Routing er automatisk — intet at konfigurere
  // Brug pages: false for at deaktivere
})`
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🗂️</span>
        <span class="badge-nuxt">Routing</span>
      </div>
      <h1 class="section-title">Fil-baseret Routing</h1>
      <p class="section-subtitle">
        Filer i <code class="font-mono text-nuxt-400">pages/</code> mappen bliver
        automatisk til URL-ruter. Ingen router-konfiguration nødvendig.
      </p>
    </div>

    <!-- Current route info -->
    <DemoPanel
      title="Nuværende Route"
      description="useRoute() giver reaktiv adgang til den aktuelle rutes information"
      :code="routingCode"
      lang="typescript"
      filename="pages/routing/index.vue"
      badge="nuxt"
    >
      <div class="space-y-3 font-mono text-sm">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-dark-700 rounded-lg p-3">
            <div class="text-slate-500 text-xs mb-1">route.path</div>
            <div class="text-nuxt-400">{{ route.path }}</div>
          </div>
          <div class="bg-dark-700 rounded-lg p-3">
            <div class="text-slate-500 text-xs mb-1">route.name</div>
            <div class="text-nuxt-400">{{ String(route.name) }}</div>
          </div>
          <div class="bg-dark-700 rounded-lg p-3">
            <div class="text-slate-500 text-xs mb-1">route.fullPath</div>
            <div class="text-nuxt-400">{{ route.fullPath }}</div>
          </div>
          <div class="bg-dark-700 rounded-lg p-3">
            <div class="text-slate-500 text-xs mb-1">route.params</div>
            <div class="text-slate-400">{{ JSON.stringify(route.params) }}</div>
          </div>
        </div>
      </div>
    </DemoPanel>

    <!-- File structure → URL mapping -->
    <div class="mt-6">
      <DemoPanel
        title="Fil-struktur → URL mapping"
        description="Nuxt 3 genererer Vue Router konfiguration automatisk fra pages/ mappestrukturen"
        :code="nuxtConfigCode"
        lang="typescript"
        filename="nuxt.config.ts"
        badge="nuxt"
      >
        <div class="space-y-2">
          <div
            v-for="example in routingExamples"
            :key="example.file"
            class="flex items-center gap-3 p-3 rounded-lg bg-dark-700 border border-dark-600"
            :class="{ 'border-nuxt-500/50': example.url === '/routing' }"
          >
            <span class="text-xs font-mono text-slate-500 w-5 text-center">📄</span>
            <code class="text-xs font-mono text-yellow-300 flex-1">{{ example.file }}</code>
            <span class="text-slate-600">→</span>
            <code class="text-xs font-mono text-nuxt-400 w-36">{{ example.url }}</code>
            <span class="text-xs text-slate-500 hidden sm:block">{{ example.description }}</span>
            <span
              v-if="example.url === '/routing'"
              class="text-xs badge-nuxt ml-auto"
            >← du er her</span>
          </div>
        </div>
      </DemoPanel>
    </div>

    <!-- Navigation to dynamic route -->
    <div class="mt-6 p-5 rounded-xl bg-dark-800 border border-dark-600">
      <h3 class="text-sm font-semibold text-slate-200 mb-3">
        Prøv dynamiske ruter:
      </h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="id in [1, 2, 3, 4, 5]"
          :key="id"
          :to="`/routing/${id}`"
          class="px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 text-sm font-mono text-nuxt-400 hover:border-nuxt-500/50 hover:bg-nuxt-500/10 transition-all"
        >
          /routing/{{ id }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
