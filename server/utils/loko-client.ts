/**
 * Loko.rs API client — kørende på Nitro server-siden.
 *
 * Arkitektur:
 *   Browser → Nuxt Nitro (server/api/) → Loko.rs REST API (Rust/Axum)
 *
 * Loko.rs er en "Rails for Rust" framework baseret på Axum.
 * Den kører typisk på port 5150 (standard Loko.rs port).
 *
 * Hvis Loko.rs ikke er tilgængeligt, returneres mock-data
 * så demoen kan køre standalone.
 */

import type { LokoPost, LokoHealth } from '../types/loko'

// Mock data — bruges når Loko.rs backend ikke kører
const MOCK_POSTS: LokoPost[] = [
  {
    id: 1,
    title: 'Introduktion til Loko.rs',
    content:
      'Loko.rs er en produktivitets-fokuseret Rust web framework inspireret af Ruby on Rails. Den bruger Axum under motorhjelmen og inkluderer SeaORM, baggrundsjobs (Sidekiq-rs), caching og mailer ud af boksen.',
    author: 'Lars Rust',
    createdAt: '2024-01-15T10:00:00Z',
    tags: ['rust', 'web', 'framework'],
  },
  {
    id: 2,
    title: 'Nuxt 3 og Nitro server routes',
    content:
      'Nuxt 3 bruger Nitro som server-engine. Nitro understøtter file-based API routes i server/api/ mappen. Routes proxyer til Loko.rs backend og tilføjer caching, validering og fejlhåndtering.',
    author: 'Nina Nuxt',
    createdAt: '2024-01-20T14:30:00Z',
    tags: ['nuxt', 'nitro', 'api'],
  },
  {
    id: 3,
    title: 'Full-stack TypeScript + Rust',
    content:
      'Kombiner Nuxt 3 (TypeScript/Vue 3) frontend med Loko.rs (Rust) backend for et type-sikkert, højtydende full-stack setup. Del typer via OpenAPI/Zod schemas.',
    author: 'Tomas TypeScript',
    createdAt: '2024-02-01T09:15:00Z',
    tags: ['typescript', 'rust', 'fullstack'],
  },
  {
    id: 4,
    title: 'SSR med Nuxt og Loko.rs',
    content:
      'Server-side rendering med Nuxt 3 og Loko.rs API. useAsyncData henter data på serveren ved første load, hvilket giver hurtigere FCP og bedre SEO.',
    author: 'Sara SSR',
    createdAt: '2024-02-10T11:00:00Z',
    tags: ['ssr', 'performance', 'seo'],
  },
  {
    id: 5,
    title: 'Autentificering med JWT',
    content:
      'Loko.rs har built-in JWT autentificering. Nuxt 3 middleware validerer tokens og beskytter sider. useAuth composable håndterer login/logout state globalt.',
    author: 'Alex Auth',
    createdAt: '2024-02-15T16:45:00Z',
    tags: ['auth', 'jwt', 'security'],
  },
]

const MOCK_HEALTH: LokoHealth = {
  status: 'ok',
  version: '0.5.0',
  uptime: 42000,
  database: true,
  cache: true,
}

/**
 * Forsøger at kalde Loko.rs API.
 * Falder tilbage til mock-data ved fejl (offline/dev).
 */
export async function lokoFetch<T>(
  path: string,
  fallback: T,
  config?: RequestInit
): Promise<{ data: T; fromMock: boolean }> {
  const apiUrl = process.env.LOKO_API_URL || 'http://localhost:5150'

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config?.headers,
      },
      // Kort timeout så demo'en ikke hænger
      signal: AbortSignal.timeout(3000),
    })

    if (!response.ok) {
      throw new Error(`Loko.rs svarede ${response.status}`)
    }

    const data = (await response.json()) as T
    return { data, fromMock: false }
  } catch {
    // Loko.rs er ikke tilgængeligt — brug mock data
    return { data: fallback, fromMock: true }
  }
}

export { MOCK_POSTS, MOCK_HEALTH }
