<script setup lang="ts">
/**
 * /routing/[id] — Demonstrerer dynamiske ruter i Nuxt 3.
 *
 * [id].vue i filnavnet → :id URL parameter
 * Tilgængeligt via useRoute().params.id
 *
 * Henter post fra Loko.rs API baseret på :id parameteren.
 */

const route = useRoute()
const id = computed(() => Number(route.params.id))

// useFetch med reaktiv URL — re-fetcher automatisk når :id ændrer sig
const { data: post, pending, error, refresh } = await useFetch(
  () => `/api/posts/${id.value}`,
  { key: `post-${id.value}` }
)

useSeoMeta({
  title: computed(() =>
    post.value ? `${post.value.title} — Nuxt 3 Demo` : `Post #${id.value}`
  ),
})

const dynamicRouteCode = `// pages/routing/[id].vue
// [id] i filnavnet → dynamisk URL parameter

const route = useRoute()
const id = computed(() => Number(route.params.id))

// Reaktiv URL — re-fetcher automatisk når :id ændrer sig
const { data: post, pending, error } = await useFetch(
  () => \`/api/posts/\${id.value}\`,
  { key: \`post-\${id.value}\` }
)

// Nuxt 3 dynamisk routing:
// pages/routing/[id].vue   → /routing/:id
// pages/blog/[slug].vue    → /blog/:slug
// pages/[a]/[b].vue        → /:a/:b
// pages/[...catchAll].vue  → /* (wildcard)`
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink to="/routing" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">
          ← Routing
        </NuxtLink>
        <span class="text-slate-600">/</span>
        <span class="text-nuxt-400 font-mono text-sm">{{ id }}</span>
      </div>
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🔀</span>
        <span class="badge-nuxt">Dynamisk rute</span>
      </div>
      <h1 class="section-title">Dynamisk Route: /routing/[id]</h1>
      <p class="section-subtitle">
        <code class="font-mono text-nuxt-400">[id].vue</code> i filnavnet skaber
        en <code class="font-mono text-nuxt-400">:id</code> URL-parameter.
      </p>
    </div>

    <!-- Demo panel -->
    <DemoPanel
      title="Dynamisk route parameter"
      description="useRoute().params.id aflæser den aktuelle :id værdi. useFetch re-fetcher når id ændrer sig."
      :code="dynamicRouteCode"
      lang="typescript"
      filename="pages/routing/[id].vue"
      badge="nuxt"
    >
      <!-- Route params display -->
      <div class="mb-4 grid grid-cols-2 gap-3 font-mono text-sm">
        <div class="bg-dark-700 rounded-lg p-3">
          <div class="text-slate-500 text-xs mb-1">route.params.id</div>
          <div class="text-nuxt-400 text-lg font-bold">{{ id }}</div>
        </div>
        <div class="bg-dark-700 rounded-lg p-3">
          <div class="text-slate-500 text-xs mb-1">route.path</div>
          <div class="text-nuxt-400">{{ route.path }}</div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="pending" class="flex items-center gap-2 text-slate-400 text-sm">
        <span class="animate-pulse">⟳</span> Henter post #{{ id }} fra Loko.rs...
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
      >
        <strong>Fejl:</strong> {{ error.message }}
        <button class="ml-3 underline" @click="refresh()">Prøv igen</button>
      </div>

      <!-- Post content -->
      <div
        v-else-if="post"
        class="p-4 rounded-lg bg-dark-700 border border-dark-600 space-y-3"
      >
        <div>
          <div class="text-xs text-slate-500 mb-1 font-mono">post.title</div>
          <h2 class="text-lg font-semibold text-slate-100">{{ post.title }}</h2>
        </div>
        <div>
          <div class="text-xs text-slate-500 mb-1 font-mono">post.content</div>
          <p class="text-sm text-slate-300 leading-relaxed">{{ post.content }}</p>
        </div>
        <div class="flex flex-wrap gap-2 pt-1">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="text-xs px-2 py-0.5 rounded-full bg-nuxt-500/15 text-nuxt-400 border border-nuxt-500/25 font-mono"
          >
            #{{ tag }}
          </span>
        </div>
        <div class="text-xs text-slate-500 pt-1 flex gap-4">
          <span>Forfatter: {{ post.author }}</span>
          <span>{{ new Date(post.createdAt).toLocaleDateString('da-DK') }}</span>
        </div>
      </div>
    </DemoPanel>

    <!-- Navigation between posts -->
    <div class="mt-6 p-5 rounded-xl bg-dark-800 border border-dark-600">
      <h3 class="text-sm font-semibold text-slate-200 mb-3">
        Naviger mellem posts <span class="text-xs text-slate-500">(bemærk reaktiv re-fetch)</span>
      </h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="n in 5"
          :key="n"
          :to="`/routing/${n}`"
          class="px-4 py-2 rounded-lg text-sm font-mono transition-all border"
          :class="
            n === id
              ? 'bg-nuxt-500/20 text-nuxt-400 border-nuxt-500/50'
              : 'bg-dark-700 text-slate-400 border-dark-600 hover:border-nuxt-500/30'
          "
        >
          #{{ n }}
        </NuxtLink>
        <NuxtLink
          to="/routing/99"
          class="px-4 py-2 rounded-lg text-sm font-mono border bg-dark-700 text-slate-500 border-dark-600 hover:border-red-500/30 hover:text-red-400 transition-all"
        >
          #99 (404)
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
