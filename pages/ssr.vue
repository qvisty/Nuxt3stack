<script setup lang="ts">
/**
 * /ssr — Demonstrerer Server-Side Rendering (SSR) og hydration i Nuxt 3.
 *
 * SSR flow:
 *  1. Bruger anmoder om siden
 *  2. Nuxt renderer kører på serveren, henter data, genererer HTML
 *  3. Browseren modtager færdig HTML (hurtig FCP, god SEO)
 *  4. Vue "hydrerer" HTML → interaktiv app (ingen ekstra data-fetch)
 *
 * useAsyncData med server: true (default) = data hentes server-side.
 */

useSeoMeta({
  title: 'SSR & Hydration — Nuxt 3 Demo',
  description: 'Server-side rendering med Nuxt 3. Data hentes server-side for hurtig FCP og SEO.',
})

// Data hentes SERVER-SIDE ved første load
// Browseren modtager data med HTML — ingen ekstra fetch
const { data: posts, pending } = await useAsyncData(
  'ssr-posts',
  async () => {
    const res = await $fetch<{ data: unknown[] }>('/api/posts')
    return res.data ?? []
  }
)

// Viser om koden kører på server eller client
const isServer = import.meta.server
const isClient = import.meta.client

// Timestamp fra server
const serverTimestamp = useState('ssr-timestamp', () => new Date().toISOString())

// Client-side timestamp (opdateres kun i browseren)
const clientTimestamp = ref<string | null>(null)
onMounted(() => {
  clientTimestamp.value = new Date().toISOString()
})

const ssrCode = `// pages/ssr.vue — SSR med useAsyncData

// Data hentes SERVER-SIDE ved første request
const { data: posts } = await useAsyncData(
  'ssr-posts',
  async () => {
    const res = await $fetch('/api/posts') // ← kører på server
    return res.data
  }
  // server: true (default) — kør på server
  // server: false — kør kun client-side (CSR)
  // lazy: true — bloker ikke navigation
)

// SSR flow:
// 1. Server kører useAsyncData handler
// 2. Data serialiseres til window.__nuxt__ payload
// 3. Browser modtager HTML + data (ingen re-fetch!)
// 4. Vue hydrerer — app bliver interaktiv

// import.meta.server → kører vi på server?
// import.meta.client → kører vi i browser?
const isServer = import.meta.server
const isClient = import.meta.client`

const hydratingCode = `// Hydration — overfør server state til client

// useState er SSR-kompatibel — synkroniseres automatisk
const timestamp = useState('ssr-timestamp', () => new Date().toISOString())
// ↑ Initial værdi sættes server-side, synkroniseres til client

// onMounted kører KUN client-side (efter hydration)
onMounted(() => {
  console.log('Client er hydreret!')
  // Her kan du tilgå browser APIs (window, document, etc.)
})

// NuxtClientOnly — render kun client-side (undgå hydration mismatch)
// <ClientOnly>
//   <BrowserOnlyComponent />
// </ClientOnly>

// useHydration — læs/sæt hydration data
// Nyttigt til at sende data fra server til client`
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">💧</span>
        <span class="badge-nuxt">SSR</span>
      </div>
      <h1 class="section-title">SSR & Hydration</h1>
      <p class="section-subtitle">
        Data hentes <strong class="text-slate-200">server-side</strong> og sendes med HTML.
        Browseren hydrerer til en interaktiv app — ingen ekstra API-kald.
      </p>
    </div>

    <!-- SSR flow visualization -->
    <div class="mb-6 p-5 rounded-xl bg-dark-800 border border-dark-600">
      <h3 class="text-xs text-slate-500 uppercase tracking-wider mb-3">SSR flow</h3>
      <div class="space-y-2 text-sm">
        <div
          v-for="(step, i) in [
            { icon: '🌐', text: 'Bruger åbner /ssr', color: 'text-slate-300' },
            { icon: '🖥️', text: 'Nuxt server kører useAsyncData → $fetch(\'/api/posts\')', color: 'text-blue-300' },
            { icon: '🔄', text: 'Nitro proxyer til Loko.rs → henter posts', color: 'text-loko-300' },
            { icon: '📄', text: 'Server renderer komplet HTML med data', color: 'text-nuxt-300' },
            { icon: '📦', text: 'Browser modtager HTML + __nuxt__ payload (ingen re-fetch!)', color: 'text-nuxt-300' },
            { icon: '💧', text: 'Vue hydrerer HTML → interaktiv', color: 'text-green-300' },
          ]"
          :key="i"
          class="flex items-start gap-3"
        >
          <span class="w-5 text-center">{{ step.icon }}</span>
          <span :class="step.color">{{ step.text }}</span>
        </div>
      </div>
    </div>

    <!-- Server vs Client detection -->
    <DemoPanel
      title="Server-side data fetching"
      description="Disse posts var allerede hentet server-side. Ingen loading spinner ved første load!"
      :code="ssrCode"
      lang="typescript"
      filename="pages/ssr.vue"
      badge="nuxt"
    >
      <!-- Context badges -->
      <div class="flex gap-3 mb-4">
        <div class="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600">
          <span class="w-2 h-2 rounded-full" :class="isServer ? 'bg-nuxt-500' : 'bg-slate-600'"></span>
          <span :class="isServer ? 'text-nuxt-400' : 'text-slate-500'">
            import.meta.server = {{ isServer }}
          </span>
        </div>
        <div class="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600">
          <span class="w-2 h-2 rounded-full" :class="isClient ? 'bg-blue-500' : 'bg-slate-600'"></span>
          <span :class="isClient ? 'text-blue-400' : 'text-slate-500'">
            import.meta.client = {{ isClient }}
          </span>
        </div>
      </div>

      <div v-if="pending" class="text-slate-400 text-sm animate-pulse">Henter...</div>
      <div v-else class="space-y-2">
        <div
          v-for="post in (posts as any[]) ?? []"
          :key="post.id"
          class="flex items-center gap-3 p-2.5 rounded-lg bg-dark-700 border border-dark-600 text-sm"
        >
          <span class="text-xs font-mono text-nuxt-500 w-4">{{ post.id }}</span>
          <span class="text-slate-200 flex-1 truncate">{{ post.title }}</span>
          <span class="text-xs text-slate-500 hidden sm:block">{{ post.author }}</span>
        </div>
        <p class="text-xs text-slate-500 pt-1">
          ✓ Disse data var klar i HTML — ingen ekstra fetch i DevTools Network tab
        </p>
      </div>
    </DemoPanel>

    <!-- Hydration demo -->
    <div class="mt-6">
      <DemoPanel
        title="Hydration — server → client state transfer"
        description="useState synkroniseres fra server til client. onMounted kører kun i browseren."
        :code="hydratingCode"
        lang="typescript"
        filename="pages/ssr.vue"
        badge="nuxt"
      >
        <div class="space-y-3 font-mono text-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="bg-dark-700 rounded-lg p-3">
              <div class="text-xs text-slate-500 mb-1">useState (server → client)</div>
              <div class="text-nuxt-400 text-xs break-all">{{ serverTimestamp }}</div>
              <div class="text-xs text-slate-600 mt-1">Sat server-side</div>
            </div>
            <div class="bg-dark-700 rounded-lg p-3">
              <div class="text-xs text-slate-500 mb-1">onMounted (client only)</div>
              <div class="text-blue-400 text-xs break-all">
                {{ clientTimestamp ?? 'Ikke sat endnu...' }}
              </div>
              <div class="text-xs text-slate-600 mt-1">Sat i onMounted()</div>
            </div>
          </div>

          <ClientOnly>
            <div class="p-3 rounded-lg bg-nuxt-500/10 border border-nuxt-500/25 text-nuxt-400 text-xs">
              ✓ Denne tekst vises kun client-side via &lt;ClientOnly&gt;
            </div>
            <template #fallback>
              <div class="p-3 rounded-lg bg-dark-700 border border-dark-600 text-slate-500 text-xs">
                Server-side: &lt;ClientOnly&gt; fallback
              </div>
            </template>
          </ClientOnly>
        </div>
      </DemoPanel>
    </div>
  </div>
</template>
