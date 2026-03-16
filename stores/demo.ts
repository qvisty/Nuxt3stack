/**
 * Pinia Store — demo store der viser state management i Nuxt 3.
 *
 * Nuxt 3 + Pinia:
 *  - @pinia/nuxt modul auto-importerer defineStore
 *  - State er reaktiv og SSR-kompatibel
 *  - Stores kan bruges på tværs af alle komponenter og sider
 *
 * Demo: en simpel tæller + favorit-posts
 */

import type { LokoPost } from '~/server/types/loko'

export const useDemoStore = defineStore('demo', () => {
  // State
  const count = ref(0)
  const favourites = ref<LokoPost[]>([])
  const theme = ref<'dark' | 'light'>('dark')
  const visitedPages = ref<string[]>([])

  // Getters (computed)
  const doubleCount = computed(() => count.value * 2)
  const hasFavourites = computed(() => favourites.value.length > 0)
  const favouriteCount = computed(() => favourites.value.length)

  // Actions
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  function toggleFavourite(post: LokoPost) {
    const idx = favourites.value.findIndex((f) => f.id === post.id)
    if (idx === -1) {
      favourites.value.push(post)
    } else {
      favourites.value.splice(idx, 1)
    }
  }

  function isFavourite(postId: number) {
    return favourites.value.some((f) => f.id === postId)
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function trackPageVisit(path: string) {
    if (!visitedPages.value.includes(path)) {
      visitedPages.value.push(path)
    }
  }

  return {
    // State
    count,
    favourites,
    theme,
    visitedPages,
    // Getters
    doubleCount,
    hasFavourites,
    favouriteCount,
    // Actions
    increment,
    decrement,
    reset,
    toggleFavourite,
    isFavourite,
    toggleTheme,
    trackPageVisit,
  }
})
