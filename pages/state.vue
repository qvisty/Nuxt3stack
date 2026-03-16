<script setup lang="ts">
/**
 * /state — Demonstrerer Pinia state management i Nuxt 3.
 *
 * Pinia er det anbefalede state management bibliotek til Vue 3 / Nuxt 3.
 * Det erstatter Vuex med en enklere, TypeScript-venlig API.
 *
 * Store er defineret i stores/demo.ts og auto-importeret via @pinia/nuxt.
 */

useSeoMeta({ title: 'State Management — Nuxt 3 Demo' })

// Auto-importeret fra stores/demo.ts
const store = useDemoStore()

// useFetch til favorit-posts
const { data: postsData } = await useFetch('/api/posts', {
  transform: (res) => res.data ?? [],
})

const storeCode = `// stores/demo.ts — Pinia store med Options API
import { defineStore } from 'pinia' // auto-importeret

export const useDemoStore = defineStore('demo', () => {
  // State (reaktive refs)
  const count = ref(0)
  const favourites = ref<LokoPost[]>([])

  // Getters (computed)
  const doubleCount = computed(() => count.value * 2)
  const hasFavourites = computed(() => favourites.value.length > 0)

  // Actions (plain functions)
  function increment() { count.value++ }
  function decrement() { count.value-- }

  function toggleFavourite(post: LokoPost) {
    const idx = favourites.value.findIndex(f => f.id === post.id)
    if (idx === -1) favourites.value.push(post)
    else favourites.value.splice(idx, 1)
  }

  return { count, favourites, doubleCount, increment, decrement, toggleFavourite }
})

// Brug i enhver komponent:
const store = useDemoStore() // auto-importeret
store.increment()
console.log(store.count)    // reaktiv — auto-opdaterer DOM`

const piniaVsVuexCode = `// Pinia vs Vuex — Nuxt 3 bruger Pinia
//
// VUEX (Nuxt 2):                   PINIA (Nuxt 3):
// ─────────────────────────────    ────────────────────────────
// store.commit('INCREMENT')        store.increment()
// store.dispatch('fetchPosts')     await store.fetchPosts()
// store.getters.doubleCount        store.doubleCount
// store.state.count                store.count
//
// Pinia fordele:
//  ✓ Ingen mutations (direkte state mutation)
//  ✓ TypeScript out of the box
//  ✓ Devtools support
//  ✓ SSR-kompatibel
//  ✓ Kan bruges uden Nuxt (Vue 3 projekter)
//  ✓ Multiple stores (ingen namespaced modules)`
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🗃️</span>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          Pinia
        </span>
      </div>
      <h1 class="section-title">State Management med Pinia</h1>
      <p class="section-subtitle">
        <code class="font-mono text-yellow-400">useDemoStore()</code> er auto-importeret fra
        <code class="font-mono text-yellow-400">stores/demo.ts</code>. State deles på tværs af alle sider.
      </p>
    </div>

    <!-- Counter demo -->
    <DemoPanel
      title="Reaktiv tæller — state deles globalt"
      description="Tælleren er i Pinia store — state overlever navigationer og opdateres i alle komponenter."
      :code="storeCode"
      lang="typescript"
      filename="stores/demo.ts"
      badge="pinia"
    >
      <div class="space-y-4">
        <!-- Counter controls -->
        <div class="flex items-center gap-4">
          <button
            class="w-10 h-10 rounded-lg bg-dark-700 border border-dark-600 text-xl font-bold text-slate-200 hover:border-nuxt-500/50 hover:text-nuxt-400 transition-all"
            @click="store.decrement()"
          >−</button>

          <div class="text-center">
            <div class="text-5xl font-bold text-nuxt-400 font-mono tabular-nums">
              {{ store.count }}
            </div>
            <div class="text-xs text-slate-500 mt-1">store.count</div>
          </div>

          <button
            class="w-10 h-10 rounded-lg bg-dark-700 border border-dark-600 text-xl font-bold text-slate-200 hover:border-nuxt-500/50 hover:text-nuxt-400 transition-all"
            @click="store.increment()"
          >+</button>
        </div>

        <!-- Derived state -->
        <div class="grid grid-cols-3 gap-3 font-mono text-sm">
          <div class="bg-dark-700 rounded-lg p-3 text-center">
            <div class="text-xs text-slate-500 mb-1">doubleCount</div>
            <div class="text-yellow-400 text-lg font-bold">{{ store.doubleCount }}</div>
          </div>
          <div class="bg-dark-700 rounded-lg p-3 text-center">
            <div class="text-xs text-slate-500 mb-1">favouriteCount</div>
            <div class="text-pink-400 text-lg font-bold">{{ store.favouriteCount }}</div>
          </div>
          <div class="bg-dark-700 rounded-lg p-3 text-center">
            <div class="text-xs text-slate-500 mb-1">visitedPages</div>
            <div class="text-blue-400 text-lg font-bold">{{ store.visitedPages.length }}</div>
          </div>
        </div>

        <button
          class="text-xs text-red-400/70 hover:text-red-400 transition-colors"
          @click="store.reset()"
        >
          Reset tæller
        </button>
      </div>
    </DemoPanel>

    <!-- Favourite posts -->
    <div class="mt-6">
      <DemoPanel
        title="Favorit posts — persistent i store"
        description="toggleFavourite() tilføjer/fjerner posts. State overlever sidenavigation."
        :code="piniaVsVuexCode"
        lang="typescript"
        filename="stores/demo.ts"
        badge="pinia"
      >
        <div class="space-y-2">
          <div v-if="store.hasFavourites" class="mb-3">
            <div class="text-xs text-slate-500 mb-2">Dine favoritter ({{ store.favouriteCount }}):</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="fav in store.favourites"
                :key="fav.id"
                class="text-xs px-2 py-1 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/25"
              >
                ♥ {{ fav.title.slice(0, 30) }}...
              </span>
            </div>
          </div>

          <div
            v-for="post in (postsData as any[]) ?? []"
            :key="post.id"
            class="flex items-center gap-3 p-3 rounded-lg bg-dark-700 border transition-all cursor-pointer"
            :class="
              store.isFavourite(post.id)
                ? 'border-pink-500/40 bg-pink-500/5'
                : 'border-dark-600 hover:border-dark-500'
            "
            @click="store.toggleFavourite(post)"
          >
            <button
              class="text-lg transition-transform"
              :class="store.isFavourite(post.id) ? 'text-pink-400 scale-110' : 'text-slate-600'"
            >
              ♥
            </button>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-slate-100 truncate">{{ post.title }}</div>
              <div class="text-xs text-slate-500">{{ post.author }}</div>
            </div>
            <span class="text-xs text-slate-600">
              {{ store.isFavourite(post.id) ? 'Klik for at fjerne' : 'Klik for at tilføje' }}
            </span>
          </div>
        </div>
      </DemoPanel>
    </div>
  </div>
</template>
