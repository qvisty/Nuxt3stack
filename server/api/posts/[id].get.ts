/**
 * GET /api/posts/:id
 *
 * Henter enkelt post fra Loko.rs.
 *
 * Nuxt 3 dynamisk fil-navngivning:
 *   server/api/posts/[id].get.ts → GET /api/posts/:id
 *
 * Loko.rs controller (Rust):
 *   async fn get_post(State(ctx): State<AppContext>, Path(id): Path<i32>) -> Result<Json<PostResponse>>
 */
import { lokoFetch, MOCK_POSTS } from '../../utils/loko-client'
import type { LokoPost } from '../../types/loko'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ugyldigt post ID — skal være et positivt heltal',
    })
  }

  const mockPost = MOCK_POSTS.find((p) => p.id === id)

  if (!mockPost) {
    // Prøv Loko.rs selv om vi ikke har mock
    const { data, fromMock } = await lokoFetch<LokoPost | null>(
      `/api/posts/${id}`,
      null
    )

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: `Post med id ${id} ikke fundet`,
      })
    }

    setResponseHeader(event, 'X-From-Mock', String(fromMock))
    return data
  }

  const { data, fromMock } = await lokoFetch<LokoPost>(
    `/api/posts/${id}`,
    mockPost
  )

  setResponseHeader(event, 'X-From-Mock', String(fromMock))
  return data
})
