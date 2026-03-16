<script setup lang="ts">
/**
 * /data-fetching — Demonstrerer useFetch og useAsyncData.
 *
 * Nuxt 3 data fetching:
 *  - useFetch()      : Kombination af useAsyncData + $fetch. SSR + reaktiv.
 *  - useAsyncData()  : Mere kontrol over fetch-logik. SSR-kompatibel.
 *  - $fetch()        : Raw HTTP klient (Ofetch). Ikke-reaktiv, til events/actions.
 *
 * Alle henter fra Nitro routes der proxyer til Loko.rs.
 */

useSeoMeta({ title: 'Data Fetching — Nuxt 3 Demo' })

// --- useFetch eksempel ---
const {
  data: posts,
  pending: postsPending,
  error: postsError,
  refresh: refreshPosts,
} = await useFetch('/api/posts', {
  key: 'demo-posts',
  // Transform data på klient-siden
  transform: (res) => res.data ?? [],
})

// --- useAsyncData eksempel ---
const selectedTag = ref<string | null>(null)

const { data: taggedPosts, pending: tagPending, refresh: refreshTagged } = useAsyncData(
  'tagged-posts',
  async () => {
    if (!selectedTag.value) return []
    const res = await $fetch<{ data: unknown[] }>(`/api/posts?tag=${selectedTag.value}`)
    return res.data ?? []
  },
  {
    watch: [selectedTag], // Re-fetch automatisk når selectedTag ændrer sig
    default: () => [],
  }
)

const tags = ['rust', 'nuxt', 'nitro', 'typescript', 'ssr', 'auth', 'fullstack']

const useFetchCode = `// useFetch — den anbefalede måde i Nuxt 3
// SSR-kompatibel, reaktiv, auto-cache

const {
  data: posts,
  pending,
  error,
  refresh
} = await useFetch('/api/posts', {
  key: 'demo-posts',               // Cache nøgle
  transform: (res) => res.data,    // Transform response
  // server: false,                // Kun klient-side fetch
  // lazy: true,                   // Bloker ikke navigation
  // pick: ['id', 'title'],        // Vælg kun bestemte felter
})

// useFetch = useAsyncData + $fetch kombineret
// Data er tilgængeligt server-side (SSR) ved første load`

const useAsyncDataCode = `// useAsyncData — fuld kontrol over fetch-logik
const selectedTag = ref(null)

const { data, pending, refresh } = useAsyncData(
  'tagged-posts',          // Unik cache nøgle
  async () => {
    // Hvad som helst asynkront
    const res = await $fetch(\`/api/posts?tag=\${selectedTag.value}\`)
    return res.data
  },
  {
    watch: [selectedTag],  // Re-fetch når selectedTag ændrer sig
    default: () => [],     // Default værdi før fetch
  }
)

// Bemærk: watch: [selectedTag] er reaktiv!
// Ændrer du selectedTag, re-fetches data automatisk.`

const dollarFetchCode = `// $fetch — raw HTTP klient (Ofetch under motorhjelmen)
// Brug til events/mutations, ikke til initial page data

async function deletePost(id: number) {
  // $fetch er IKKE reaktiv og caches IKKE
  await $fetch(\`/api/posts/\${id}\`, {
    method: 'DELETE',
  })
  // Manuelt refresh
  await refresh()
}

// $fetch virker både browser- og server-side
// I server routes: $fetch('/api/...') er relativt
// I browser: $fetch kaldt sted er absolut URL`
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">📡</span>
        <span class="badge-nuxt">Data Fetching</span>
      </div>
      <h1 class="section-title">Data Fetching</h1>
      <p class="section-subtitle">
        <code class="font-mono text-nuxt-400">useFetch</code>,
        <code class="font-mono text-nuxt-400">useAsyncData</code> og
        <code class="font-mono text-nuxt-400">$fetch</code> — alle henter fra Loko.rs via Nitro.
      </p>
    </div>

    <!-- useFetch demo -->
    <DemoPanel
      title="useFetch('/api/posts')"
      description="Henter posts fra Loko.rs. SSR: data er klar ved første render — ingen loading-spinner ved første load."
      :code="useFetchCode"
      lang="typescript"
      filename="pages/data-fetching.vue"
      badge="nuxt"
    >
      <div v-if="postsPending" class="text-slate-400 text-sm animate-pulse">
        Henter posts...
      </div>
      <div v-else-if="postsError" class="text-red-400 text-sm">
        Fejl: {{ postsError.message }}
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="post in (posts as any[])"
          :key="(post as any).id"
          class="flex items-start gap-3 p-3 rounded-lg bg-dark-700 border border-dark-600"
        >
          <span class="text-nuxt-500 font-mono text-xs mt-0.5 w-4 flex-shrink-0">#{{ (post as any).id }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-100 truncate">{{ (post as any).title }}</p>
            <div class="flex gap-1 mt-1 flex-wrap">
              <span
                v-for="tag in (post as any).tags"
                :key="tag"
                class="text-xs px-1.5 py-0.5 rounded bg-dark-600 text-slate-500 font-mono"
              >#{{ tag }}</span>
            </div>
          </div>
        </div>
        <button
          class="mt-2 text-xs text-nuxt-500 hover:text-nuxt-400 transition-colors"
          @click="refreshPosts()"
        >
          ↻ Refresh data
        </button>
      </div>
    </DemoPanel>

    <!-- useAsyncData demo -->
    <div class="mt-6">
      <DemoPanel
        title="useAsyncData med watch"
        description="watch: [selectedTag] re-fetcher automatisk når tag vælges. Ingen manuel refresh nødvendig."
        :code="useAsyncDataCode"
        lang="typescript"
        filename="pages/data-fetching.vue"
        badge="nuxt"
      >
        <div class="mb-3">
          <p class="text-xs text-slate-500 mb-2">Vælg tag (trigger reaktiv re-fetch):</p>
          <div class="flex flex-wrap gap-2">
            <button
              class="text-xs px-3 py-1.5 rounded-lg border transition-all font-mono"
              :class="
                selectedTag === null
                  ? 'bg-nuxt-500/20 text-nuxt-400 border-nuxt-500/50'
                  : 'bg-dark-700 text-slate-400 border-dark-600 hover:border-nuxt-500/30'
              "
              @click="selectedTag = null"
            >
              alle
            </button>
            <button
              v-for="tag in tags"
              :key="tag"
              class="text-xs px-3 py-1.5 rounded-lg border transition-all font-mono"
              :class="
                selectedTag === tag
                  ? 'bg-nuxt-500/20 text-nuxt-400 border-nuxt-500/50'
                  : 'bg-dark-700 text-slate-400 border-dark-600 hover:border-nuxt-500/30'
              "
              @click="selectedTag = tag"
            >
              #{{ tag }}
            </button>
          </div>
        </div>

        <div v-if="tagPending" class="text-slate-400 text-sm animate-pulse">Filtrerer...</div>
        <div v-else-if="!(taggedPosts as unknown[]).length && selectedTag" class="text-slate-500 text-sm">
          Ingen posts med tag #{{ selectedTag }}
        </div>
        <div v-else-if="!(taggedPosts as unknown[]).length" class="text-slate-500 text-sm italic">
          Vælg et tag ovenfor
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="post in (taggedPosts as any[])"
            :key="(post as any).id"
            class="p-3 rounded-lg bg-dark-700 border border-dark-600 text-sm"
          >
            <span class="font-medium text-slate-100">{{ (post as any).title }}</span>
          </div>
        </div>
      </DemoPanel>
    </div>

    <!-- $fetch -->
    <div class="mt-6">
      <DemoPanel
        title="$fetch — til actions og mutations"
        description="$fetch er ikke-reaktiv og caches ikke. Bruges til POST/PUT/DELETE eller one-off kald."
        :code="dollarFetchCode"
        lang="typescript"
        filename="pages/data-fetching.vue"
        badge="nuxt"
      >
        <div class="text-sm text-slate-400 leading-relaxed">
          <p class="mb-3">
            <code class="font-mono text-nuxt-400">$fetch</code> bruger
            <a href="https://github.com/unjs/ofetch" target="_blank" class="text-blue-400 underline">ofetch</a>
            under motorhjelmen — en moderne fetch-wrapper med automatisk JSON parsing.
          </p>
          <div class="grid grid-cols-3 gap-3 text-xs">
            <div class="bg-dark-700 rounded-lg p-3">
              <div class="font-medium text-slate-200 mb-1">useFetch</div>
              <div class="text-slate-500">SSR + reaktiv<br/>Auto-cache<br/>Side-load</div>
            </div>
            <div class="bg-dark-700 rounded-lg p-3">
              <div class="font-medium text-slate-200 mb-1">useAsyncData</div>
              <div class="text-slate-500">SSR + reaktiv<br/>Fuld kontrol<br/>Custom logik</div>
            </div>
            <div class="bg-dark-700 rounded-lg p-3">
              <div class="font-medium text-slate-200 mb-1">$fetch</div>
              <div class="text-slate-500">Ingen cache<br/>Til mutations<br/>Event-handlers</div>
            </div>
          </div>
        </div>
      </DemoPanel>
    </div>
  </div>
</template>
