/**
 * useLokoApi — composable til Loko.rs API integration.
 *
 * Demonstrerer Nuxt 3 composables:
 *  - Auto-importeret fra composables/ mappe
 *  - Genbrug af $fetch og useFetch
 *  - TypeScript generics
 *  - Reaktive error/loading states
 *
 * Bruges som: const { posts, fetchPost } = useLokoApi()
 */

import type { LokoPost, LokoApiList } from '~/server/types/loko'

export function useLokoApi() {
  const isLoading = ref(false)
  const lastError = ref<string | null>(null)

  /**
   * Hent alle posts — bruger $fetch (ikke reaktiv, til actions)
   */
  async function fetchPosts(options?: {
    page?: number
    perPage?: number
    tag?: string
  }) {
    isLoading.value = true
    lastError.value = null

    try {
      const params = new URLSearchParams()
      if (options?.page) params.set('page', String(options.page))
      if (options?.perPage) params.set('per_page', String(options.perPage))
      if (options?.tag) params.set('tag', options.tag)

      const query = params.toString() ? `?${params.toString()}` : ''
      return await $fetch<LokoApiList<LokoPost>>(`/api/posts${query}`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ukendt fejl'
      lastError.value = msg
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Hent enkelt post
   */
  async function fetchPost(id: number) {
    isLoading.value = true
    lastError.value = null

    try {
      return await $fetch<LokoPost>(`/api/posts/${id}`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Post ikke fundet'
      lastError.value = msg
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reaktiv posts liste — bruger useFetch (SSR + reaktivitet)
   */
  function usePosts(tag?: string) {
    const url = computed(
      () => `/api/posts${tag ? `?tag=${tag}` : ''}`
    )
    return useFetch<LokoApiList<LokoPost>>(url, {
      key: `posts-${tag ?? 'all'}`,
    })
  }

  /**
   * Reaktiv enkelt post — bruger useFetch
   */
  function usePost(id: MaybeRef<number>) {
    return useFetch<LokoPost>(() => `/api/posts/${unref(id)}`, {
      key: `post-${unref(id)}`,
    })
  }

  return {
    isLoading: readonly(isLoading),
    lastError: readonly(lastError),
    fetchPosts,
    fetchPost,
    usePosts,
    usePost,
  }
}
