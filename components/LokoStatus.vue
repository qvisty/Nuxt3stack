<script setup lang="ts">
/**
 * LokoStatus — viser om Loko.rs API er tilgængeligt.
 * Kalder /api/health som proxyer til Loko.rs backend.
 */
const { data, error, pending, refresh } = await useFetch('/api/health', {
  key: 'loko-health',
  default: () => null,
})

const statusColor = computed(() => {
  if (pending.value) return 'bg-yellow-500'
  if (error.value) return 'bg-red-500'
  return 'bg-nuxt-500'
})

const statusText = computed(() => {
  if (pending.value) return 'Tjekker...'
  if (error.value) return 'Offline (mock-data bruges)'
  return 'Online'
})
</script>

<template>
  <div
    class="flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 text-sm"
  >
    <!-- Status dot -->
    <span
      class="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors"
      :class="[statusColor, pending ? 'animate-pulse' : '']"
    ></span>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="font-medium text-slate-200">Loko.rs Backend</span>
        <span class="text-slate-500">·</span>
        <span :class="error ? 'text-red-400' : 'text-nuxt-400'">
          {{ statusText }}
        </span>
      </div>
      <p class="text-xs text-slate-500 truncate">
        <span class="font-mono">GET /api/health</span>
        <span v-if="data" class="ml-2">
          → {{ (data as any)?.version ?? 'ok' }}
        </span>
        <span v-else-if="error" class="ml-2 text-slate-600">
          → Demo-mode aktiv
        </span>
      </p>
    </div>

    <!-- Refresh -->
    <button
      class="text-xs text-slate-500 hover:text-slate-200 transition-colors"
      :class="{ 'animate-spin': pending }"
      @click="refresh()"
    >
      ↻
    </button>
  </div>
</template>
