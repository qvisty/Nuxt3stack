<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-dark-900 flex items-center justify-center p-6">
    <div class="text-center max-w-md">
      <div class="text-8xl font-bold gradient-nuxt mb-4">
        {{ error.statusCode }}
      </div>
      <h1 class="text-xl font-semibold text-slate-100 mb-2">
        {{ error.statusCode === 404 ? 'Side ikke fundet' : 'Noget gik galt' }}
      </h1>
      <p class="text-slate-400 text-sm mb-6">
        {{ error.statusMessage || error.message }}
      </p>
      <button
        class="px-6 py-2.5 rounded-lg bg-nuxt-500 text-dark-900 font-medium hover:bg-nuxt-400 transition-colors text-sm"
        @click="handleError"
      >
        ← Tilbage til forsiden
      </button>
      <p class="text-xs text-slate-600 mt-4">
        Nuxt 3 custom error page · error.vue
      </p>
    </div>
  </div>
</template>

<style>
@import '~/assets/css/main.css';
</style>
