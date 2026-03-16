<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description: string
  to: string
  badge?: 'nuxt' | 'loko' | 'nitro' | 'pinia'
  tag?: string
}>()
</script>

<template>
  <NuxtLink :to="to" class="feature-card group block">
    <div class="flex items-start gap-3">
      <span class="text-2xl flex-shrink-0">{{ icon }}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="font-semibold text-slate-100 group-hover:text-nuxt-400 transition-colors">
            {{ title }}
          </h3>
          <span v-if="badge === 'nuxt'" class="badge-nuxt">Nuxt</span>
          <span v-else-if="badge === 'loko'" class="badge-loko">Loko</span>
          <span v-else-if="badge === 'nitro'" class="badge-nitro">Nitro</span>
          <span
            v-else-if="badge === 'pinia'"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
          >Pinia</span>
        </div>
        <p class="text-sm text-slate-400 mt-1">{{ description }}</p>
        <code
          v-if="tag"
          class="text-xs font-mono text-slate-500 mt-1 block"
        >{{ tag }}</code>
      </div>
      <span class="text-slate-600 group-hover:text-nuxt-500 transition-colors text-lg">→</span>
    </div>
  </NuxtLink>
</template>
