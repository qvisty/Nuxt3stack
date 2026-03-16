/**
 * GET /api/posts
 *
 * Nitro server route der proxyer til Loko.rs posts controller.
 *
 * Loko.rs håndterer:
 *  - Database queries via SeaORM
 *  - Pagination
 *  - Caching (Redis/in-memory)
 *
 * Query params:
 *  - page: number (default: 1)
 *  - per_page: number (default: 10)
 *  - tag: string (filter by tag)
 *
 * Nuxt 3 fil-navngivning:
 *   posts.get.ts → HTTP GET /api/posts
 */
import { lokoFetch, MOCK_POSTS } from '../utils/loko-client'
import type { LokoApiList, LokoPost } from '../types/loko'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 1)
  const perPage = Number(query.per_page ?? 10)
  const tag = query.tag as string | undefined

  // Loko.rs list response format
  const mockList: LokoApiList<LokoPost> = {
    data: tag
      ? MOCK_POSTS.filter((p) => p.tags.includes(tag))
      : MOCK_POSTS,
    total: MOCK_POSTS.length,
    page,
    perPage,
  }

  const { data, fromMock } = await lokoFetch<LokoApiList<LokoPost>>(
    `/api/posts?page=${page}&per_page=${perPage}${tag ? `&tag=${tag}` : ''}`,
    mockList
  )

  // Tilføj Nitro meta-header
  setResponseHeader(event, 'X-From-Mock', String(fromMock))
  setResponseHeader(event, 'X-Nitro-Route', '/api/posts')

  return data
})
