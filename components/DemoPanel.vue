<script setup lang="ts">
/**
 * DemoPanel — viser to faner: "Live Demo" og "Kode"
 * Bruges på alle feature-sider til at vise kode + live output side om side.
 */
defineProps<{
  title: string
  description?: string
  code: string
  lang?: 'typescript' | 'vue' | 'bash' | 'json' | 'rust'
  filename?: string
  badge?: 'nuxt' | 'loko' | 'nitro'
}>()

const activeTab = ref<'demo' | 'code'>('demo')
</script>

<template>
  <div class="demo-panel">
    <!-- Panel header -->
    <div class="demo-panel-header">
      <div class="flex items-center gap-3">
        <span class="text-sm font-semibold text-slate-100">{{ title }}</span>
        <span
          v-if="badge === 'nuxt'"
          class="badge-nuxt"
        >Nuxt 3</span>
        <span
          v-else-if="badge === 'loko'"
          class="badge-loko"
        >Loko.rs</span>
        <span
          v-else-if="badge === 'nitro'"
          class="badge-nitro"
        >Nitro</span>
      </div>

      <!-- Tab switcher -->
      <div class="flex rounded-lg overflow-hidden border border-dark-600 text-xs">
        <button
          class="px-3 py-1.5 transition-colors"
          :class="activeTab === 'demo' ? 'bg-nuxt-500/20 text-nuxt-400' : 'bg-dark-700 text-slate-400 hover:text-slate-200'"
          @click="activeTab = 'demo'"
        >
          ▶ Demo
        </button>
        <button
          class="px-3 py-1.5 transition-colors border-l border-dark-600"
          :class="activeTab === 'code' ? 'bg-nuxt-500/20 text-nuxt-400' : 'bg-dark-700 text-slate-400 hover:text-slate-200'"
          @click="activeTab = 'code'"
        >
          &lt;/&gt; Kode
        </button>
      </div>
    </div>

    <!-- Description -->
    <p
      v-if="description"
      class="px-4 py-2 text-sm text-slate-400 bg-dark-800 border-b border-dark-600"
    >
      {{ description }}
    </p>

    <!-- Tab content -->
    <Transition name="tab-content" mode="out-in">
      <!-- Demo slot -->
      <div v-if="activeTab === 'demo'" key="demo" class="p-5">
        <slot />
      </div>

      <!-- Code view -->
      <div v-else key="code">
        <CodeBlock :code="code" :lang="lang" :filename="filename" />
      </div>
    </Transition>
  </div>
</template>
