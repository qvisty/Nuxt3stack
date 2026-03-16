<script setup lang="ts">
/**
 * /composables — Demonstrerer custom composables i Nuxt 3.
 *
 * Nuxt 3 auto-importerer filer fra composables/ mappen.
 * Composables er Vue 3 Composition API funktioner der encapsulerer
 * genbrugelig logik med reaktiv state.
 *
 * useLokoApi er vores custom composable der wrapper Loko.rs API kald.
 */

useSeoMeta({ title: 'Composables — Nuxt 3 Demo' })

// Auto-importeret fra composables/useLokoApi.ts
const { isLoading, lastError, fetchPosts, fetchPost, usePosts } = useLokoApi()

// usePosts() er en reaktiv metode i composablen
const { data: allPosts, pending } = usePosts()

const selectedPostId = ref<number | null>(null)
const singlePost = ref<unknown>(null)

async function loadPost(id: number) {
  selectedPostId.value = id
  singlePost.value = await fetchPost(id)
}

const composableCode = `// composables/useLokoApi.ts
// Auto-importeret — ingen import statement nødvendig!

export function useLokoApi() {
  const isLoading = ref(false)
  const lastError = ref<string | null>(null)

  // Reaktiv posts liste
  function usePosts(tag?: string) {
    const url = computed(
      () => \`/api/posts\${tag ? \`?tag=\${tag}\` : ''}\`
    )
    return useFetch<LokoApiList<LokoPost>>(url, {
      key: \`posts-\${tag ?? 'all'}\`,
    })
  }

  // Imperative fetch til actions
  async function fetchPost(id: number) {
    isLoading.value = true
    try {
      return await $fetch<LokoPost>(\`/api/posts/\${id}\`)
    } catch (e) {
      lastError.value = e.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, lastError, fetchPost, usePosts }
}

// Brug i enhver komponent eller side:
const { fetchPost, usePosts } = useLokoApi()`

const autoImportCode = `// Nuxt 3 Auto-imports:
// Ingen import statements nødvendige for:

// Composables (composables/)
const { fetchPost } = useLokoApi()   // ← auto
const count = ref(0)                  // ← auto (Vue)
const doubled = computed(() => ...)   // ← auto (Vue)

// Nuxt composables
const route = useRoute()              // ← auto
const router = useRouter()            // ← auto
const config = useRuntimeConfig()     // ← auto
const store = useDemoStore()          // ← auto (Pinia)
const { data } = useFetch('/api/...') // ← auto

// Components (components/)
// <FeatureCard /> → auto-importeret fra components/`
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🧩</span>
        <span class="badge-nuxt">Composables</span>
      </div>
      <h1 class="section-title">Custom Composables</h1>
      <p class="section-subtitle">
        <code class="font-mono text-nuxt-400">composables/useLokoApi.ts</code> er auto-importeret
        og indkapsler al Loko.rs API-logik med TypeScript og reaktivitet.
      </p>
    </div>

    <!-- Live demo of useLokoApi -->
    <DemoPanel
      title="useLokoApi() — live demo"
      description="Composablen er auto-importeret fra composables/useLokoApi.ts. Ingen import statement nødvendig."
      :code="composableCode"
      lang="typescript"
      filename="composables/useLokoApi.ts"
      badge="nuxt"
    >
      <!-- State from composable -->
      <div class="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div class="bg-dark-700 rounded-lg p-3">
          <div class="text-xs text-slate-500 mb-1 font-mono">isLoading</div>
          <div :class="isLoading ? 'text-yellow-400' : 'text-nuxt-400'" class="font-mono">
            {{ isLoading }}
          </div>
        </div>
        <div class="bg-dark-700 rounded-lg p-3">
          <div class="text-xs text-slate-500 mb-1 font-mono">lastError</div>
          <div :class="lastError ? 'text-red-400' : 'text-nuxt-400'" class="font-mono truncate">
            {{ lastError ?? 'null' }}
          </div>
        </div>
      </div>

      <!-- Posts fra usePosts() -->
      <div v-if="pending" class="text-slate-400 text-sm animate-pulse">Henter posts...</div>
      <div v-else class="space-y-2 mb-4">
        <div class="text-xs text-slate-500 mb-2">
          Posts fra <code class="font-mono text-nuxt-400">usePosts()</code>:
        </div>
        <div
          v-for="post in (allPosts as any)?.data ?? []"
          :key="post.id"
          class="flex items-center gap-3 p-2 rounded bg-dark-700 border border-dark-600 cursor-pointer hover:border-nuxt-500/40 transition-all"
          :class="{ 'border-nuxt-500/60 bg-nuxt-500/5': selectedPostId === post.id }"
          @click="loadPost(post.id)"
        >
          <span class="text-xs font-mono text-nuxt-500 w-4">#{{ post.id }}</span>
          <span class="text-sm text-slate-200 flex-1 truncate">{{ post.title }}</span>
          <span class="text-xs text-slate-500">Klik for fetchPost()</span>
        </div>
      </div>

      <!-- Single post fra fetchPost() -->
      <div v-if="singlePost" class="p-3 rounded-lg bg-dark-700 border border-nuxt-500/30">
        <div class="text-xs text-slate-500 mb-1 font-mono">
          fetchPost({{ selectedPostId }}) returnerede:
        </div>
        <div class="text-sm text-slate-200 font-medium">{{ (singlePost as any).title }}</div>
        <div class="text-xs text-slate-400 mt-1 line-clamp-2">{{ (singlePost as any).content }}</div>
      </div>
    </DemoPanel>

    <!-- Auto-imports -->
    <div class="mt-6">
      <DemoPanel
        title="Auto-imports — ingen import statements"
        description="Nuxt 3 auto-importerer Vue, Nuxt composables, dine egne composables og Pinia stores."
        :code="autoImportCode"
        lang="typescript"
        filename="pages/composables.vue"
        badge="nuxt"
      >
        <div class="space-y-3 text-sm">
          <p class="text-slate-400">
            Alle disse er tilgængelige <em>uden</em>
            <code class="font-mono text-nuxt-400">import</code> statement i enhver
            <code class="font-mono">.vue</code> fil:
          </p>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="item in [
                { name: 'useLokoApi()', source: 'composables/' },
                { name: 'useDemoStore()', source: 'stores/' },
                { name: 'useFetch()', source: 'nuxt' },
                { name: 'useRoute()', source: 'nuxt' },
                { name: 'ref(), computed()', source: 'vue' },
                { name: '<FeatureCard />', source: 'components/' },
              ]"
              :key="item.name"
              class="flex items-center gap-2 p-2 rounded bg-dark-700 border border-dark-600"
            >
              <code class="text-xs font-mono text-nuxt-400 flex-1">{{ item.name }}</code>
              <span class="text-xs text-slate-600">{{ item.source }}</span>
            </div>
          </div>
        </div>
      </DemoPanel>
    </div>
  </div>
</template>
