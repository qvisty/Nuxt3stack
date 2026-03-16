<script setup lang="ts">
/**
 * CodeBlock — viser kode med farve-tokens, filnavn og kopiér-knap.
 * Understøtter: typescript, vue, bash, json
 */
const props = withDefaults(
  defineProps<{
    code: string
    lang?: 'typescript' | 'vue' | 'bash' | 'json' | 'rust'
    filename?: string
  }>(),
  { lang: 'typescript' }
)

const copied = ref(false)

async function copyCode() {
  await navigator.clipboard.writeText(props.code.trim())
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const langLabel: Record<string, string> = {
  typescript: 'TypeScript',
  vue: 'Vue SFC',
  bash: 'Shell',
  json: 'JSON',
  rust: 'Rust',
}

const langColor: Record<string, string> = {
  typescript: 'text-blue-400',
  vue: 'text-nuxt-400',
  bash: 'text-yellow-400',
  json: 'text-orange-400',
  rust: 'text-loko-400',
}

/**
 * Meget simpel tokenizer — erstatter nøgleord med spans.
 * Ingen ekstern dependency; nok til demo-formål.
 */
function highlight(code: string, lang: string): string {
  // Escape HTML first
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  if (lang === 'bash') {
    // Comments
    html = html.replace(/(#.*)$/gm, '<span class="token-comment">$1</span>')
    // Strings
    html = html.replace(/(['"`])(.*?)\1/g, '<span class="token-string">$1$2$1</span>')
    return html
  }

  if (lang === 'json') {
    html = html.replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="token-attr">$1</span>:')
    html = html.replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="token-string">$1</span>')
    html = html.replace(/\b(true|false|null)\b/g, '<span class="token-keyword">$1</span>')
    html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>')
    return html
  }

  if (lang === 'rust') {
    html = html.replace(/(\/\/.*)$/gm, '<span class="token-comment">$1</span>')
    html = html.replace(/\b(pub|fn|let|mut|use|mod|struct|impl|enum|match|if|else|for|while|return|async|await|self|Self|true|false)\b/g, '<span class="token-keyword">$1</span>')
    html = html.replace(/("(?:\\.|[^"\\])*")/g, '<span class="token-string">$1</span>')
    html = html.replace(/\b([A-Z][A-Za-z0-9]*)\b/g, '<span class="token-type">$1</span>')
    return html
  }

  // TypeScript / Vue
  html = html.replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="token-comment">$1</span>')
  html = html.replace(/\b(const|let|var|function|return|export|default|import|from|async|await|if|else|for|of|in|true|false|null|undefined|type|interface|extends|implements|new|class|ref|computed|watch|onMounted)\b/g, '<span class="token-keyword">$1</span>')
  html = html.replace(/(?<!<span[^>]*>)('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)/g, '<span class="token-string">$1</span>')
  html = html.replace(/\b([A-Z][A-Za-z0-9]*)\b/g, '<span class="token-type">$1</span>')
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>')

  return html
}

const highlighted = computed(() => highlight(props.code.trim(), props.lang))
</script>

<template>
  <div class="code-block">
    <!-- Header bar -->
    <div
      class="flex items-center justify-between px-4 py-2 bg-dark-700 border-b border-dark-600"
    >
      <div class="flex items-center gap-2">
        <!-- Traffic lights -->
        <span class="w-3 h-3 rounded-full bg-red-500/60"></span>
        <span class="w-3 h-3 rounded-full bg-yellow-500/60"></span>
        <span class="w-3 h-3 rounded-full bg-green-500/60"></span>

        <span v-if="filename" class="ml-2 text-xs text-slate-400">{{ filename }}</span>
      </div>

      <div class="flex items-center gap-3">
        <span :class="['text-xs font-medium', langColor[lang] ?? 'text-slate-400']">
          {{ langLabel[lang] ?? lang }}
        </span>
        <button
          class="text-xs px-2 py-1 rounded bg-dark-600 hover:bg-dark-500 text-slate-400 hover:text-slate-200 transition-colors"
          @click="copyCode"
        >
          {{ copied ? '✓ Kopieret' : 'Kopiér' }}
        </button>
      </div>
    </div>

    <!-- Code content -->
    <pre
      class="p-4 overflow-x-auto text-sm leading-relaxed font-mono"
      v-html="highlighted"
    ></pre>
  </div>
</template>
