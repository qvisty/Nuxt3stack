/**
 * GET /api/health
 *
 * Nitro server route der proxyer til Loko.rs health endpoint.
 *
 * Loko.rs endpoint: GET /api/health
 * Returnerer server status, version og database-forbindelse.
 *
 * Nuxt 3 fil-navngivning:
 *   health.get.ts → HTTP GET /api/health
 */
import { lokoFetch, MOCK_HEALTH } from '../utils/loko-client'

export default defineEventHandler(async () => {
  const { data, fromMock } = await lokoFetch('/api/health', MOCK_HEALTH)

  return {
    ...data,
    // Tilføj meta-info om dette Nitro lag
    nitro: {
      fromMock,
      timestamp: new Date().toISOString(),
      route: '/api/health',
    },
  }
})
