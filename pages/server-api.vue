<script setup lang="ts">
/**
 * /server-api — Demonstrerer Nitro server routes og Loko.rs integration.
 *
 * Arkitektur:
 *   Browser → useFetch('/api/posts') → Nitro (server/api/posts.get.ts) → Loko.rs
 *
 * Loko.rs er en Rails-inspireret Rust framework:
 *  - Controllers (Axum handlers)
 *  - Models (SeaORM)
 *  - Background workers (Sidekiq-rs)
 *  - Mailer, Cache, Storage
 */

useSeoMeta({ title: 'Server API Routes — Nuxt 3 + Loko.rs Demo' })

const { data: health, refresh: refreshHealth } = await useFetch('/api/health')
const { data: postsData, refresh: refreshPosts } = await useFetch('/api/posts')

const nitroRouteCode = `// server/api/posts.get.ts
// Fil-navn konvention: posts.get.ts → GET /api/posts
//
// Nitro understøtter:
//   posts.get.ts    → GET    /api/posts
//   posts.post.ts   → POST   /api/posts
//   posts/[id].get.ts → GET  /api/posts/:id

import { lokoFetch, MOCK_POSTS } from '../utils/loko-client'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Proxy til Loko.rs backend
  const { data, fromMock } = await lokoFetch(
    '/api/posts',
    { data: MOCK_POSTS, total: MOCK_POSTS.length }
  )

  // Nitro response headers
  setResponseHeader(event, 'X-From-Mock', String(fromMock))
  setResponseHeader(event, 'X-Nitro-Route', '/api/posts')

  return data
})`

const lokoRustCode = `// Loko.rs controller (Rust)
// src/controllers/posts.rs

use loco_rs::prelude::*;
use crate::models::posts;

pub struct PostsController;

#[async_trait]
impl Controllers for PostsController {
    async fn routes(_state: &AppContext) -> AppRoutes {
        Routes::new()
            .prefix("api/posts")
            .add("/", get(list))
            .add("/:id", get(get_one))
    }
}

async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<ListParams>,
) -> Result<Json<Vec<PostResponse>>> {
    let posts = posts::Entity::find()
        .paginate(&ctx.db, params.per_page.unwrap_or(10))
        .fetch_page(params.page.unwrap_or(0))
        .await?;

    format::json(posts)
}

async fn get_one(
    State(ctx): State<AppContext>,
    Path(id): Path<i32>,
) -> Result<Json<PostResponse>> {
    let post = posts::Entity::find_by_id(id)
        .one(&ctx.db)
        .await?
        .ok_or_else(|| Error::NotFound)?;

    format::json(post)
}`

const lokoClientCode = `// server/utils/loko-client.ts
// Kørende på Nitro server-siden

export async function lokoFetch<T>(
  path: string,
  fallback: T,
): Promise<{ data: T; fromMock: boolean }> {
  const apiUrl = process.env.LOKO_API_URL || 'http://localhost:5150'

  try {
    const response = await fetch(\`\${apiUrl}\${path}\`, {
      signal: AbortSignal.timeout(3000), // 3s timeout
    })
    const data = await response.json() as T
    return { data, fromMock: false }
  } catch {
    // Loko.rs offline → brug mock data
    return { data: fallback, fromMock: true }
  }
}`
</script>

<template>
  <div class="max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">⚙️</span>
        <span class="badge-nitro">Nitro</span>
        <span class="badge-loko">Loko.rs</span>
      </div>
      <h1 class="section-title">Server API Routes</h1>
      <p class="section-subtitle">
        Nitro <code class="font-mono text-blue-400">server/api/</code> routes proxyer til
        <code class="font-mono text-loko-400">Loko.rs</code> Rust backend. Type-sikker med automatisk fallback.
      </p>
    </div>

    <!-- Architecture flow -->
    <div class="mb-6 p-4 rounded-xl bg-dark-800 border border-dark-600">
      <h3 class="text-xs text-slate-500 uppercase tracking-wider mb-3">Request flow</h3>
      <div class="flex items-center gap-2 flex-wrap font-mono text-sm">
        <div class="px-3 py-2 rounded-lg bg-slate-700 text-slate-200">Browser</div>
        <span class="text-slate-600">→ useFetch →</span>
        <div class="px-3 py-2 rounded-lg bg-blue-900/50 border border-blue-500/30 text-blue-300">
          Nitro /api/posts
        </div>
        <span class="text-slate-600">→ lokoFetch →</span>
        <div class="px-3 py-2 rounded-lg bg-loko-900/50 border border-loko-500/30 text-loko-300">
          Loko.rs :5150
        </div>
        <span class="text-slate-600">→</span>
        <div class="px-3 py-2 rounded-lg bg-green-900/50 border border-green-500/30 text-green-300">
          PostgreSQL
        </div>
      </div>
    </div>

    <!-- Health status -->
    <div class="mb-6">
      <LokoStatus />
      <div v-if="health" class="mt-3 font-mono text-xs text-slate-500 space-y-1 pl-1">
        <div>
          version: <span class="text-slate-300">{{ (health as any).version }}</span>
        </div>
        <div>
          database: <span :class="(health as any).database ? 'text-nuxt-400' : 'text-red-400'">
            {{ (health as any).database ? 'connected' : 'disconnected' }}
          </span>
        </div>
        <div>
          fromMock:
          <span :class="(health as any).nitro?.fromMock ? 'text-yellow-400' : 'text-nuxt-400'">
            {{ (health as any).nitro?.fromMock }}
          </span>
        </div>
        <div>timestamp: <span class="text-slate-300">{{ (health as any).nitro?.timestamp }}</span></div>
      </div>
    </div>

    <!-- Nitro route code -->
    <DemoPanel
      title="Nitro server route: server/api/posts.get.ts"
      description="Fil-navngivning bestemmer HTTP metode og URL. .get.ts → GET /api/posts"
      :code="nitroRouteCode"
      lang="typescript"
      filename="server/api/posts.get.ts"
      badge="nitro"
    >
      <div v-if="postsData" class="space-y-2">
        <div class="text-xs text-slate-500 mb-2">
          Returnerede {{ (postsData as any).total }} posts (side {{ (postsData as any).page }}):
        </div>
        <div
          v-for="post in (postsData as any).data ?? []"
          :key="post.id"
          class="flex items-center gap-3 p-2 rounded bg-dark-700 border border-dark-600 text-sm"
        >
          <span class="font-mono text-nuxt-500 text-xs w-4">#{{ post.id }}</span>
          <span class="text-slate-200 truncate flex-1">{{ post.title }}</span>
          <span class="text-xs text-slate-600">{{ post.author }}</span>
        </div>
        <button
          class="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          @click="refreshPosts()"
        >
          ↻ Refresh
        </button>
      </div>
    </DemoPanel>

    <!-- Loko.rs Rust code -->
    <div class="mt-6">
      <DemoPanel
        title="Loko.rs controller (Rust)"
        description="Loko.rs MVC controller i Rust. Axum handlers med SeaORM database queries."
        :code="lokoRustCode"
        lang="rust"
        filename="src/controllers/posts.rs"
        badge="loko"
      >
        <div class="text-sm text-slate-400 leading-relaxed space-y-3">
          <p>
            <span class="text-loko-400 font-semibold">Loko.rs</span> er en
            "Ruby on Rails for Rust" framework. Den bruger:
          </p>
          <ul class="list-none space-y-2">
            <li class="flex gap-2">
              <span class="text-loko-400">🦀</span>
              <span><strong class="text-slate-200">Axum</strong> — HTTP server og routing</span>
            </li>
            <li class="flex gap-2">
              <span class="text-loko-400">🗄️</span>
              <span><strong class="text-slate-200">SeaORM</strong> — Database ORM (PostgreSQL/MySQL/SQLite)</span>
            </li>
            <li class="flex gap-2">
              <span class="text-loko-400">⚡</span>
              <span><strong class="text-slate-200">Sidekiq-rs</strong> — Baggrundsjobs</span>
            </li>
            <li class="flex gap-2">
              <span class="text-loko-400">📧</span>
              <span><strong class="text-slate-200">Mailer</strong> — Email afsendelse</span>
            </li>
          </ul>
          <p class="text-xs text-slate-500">
            Standard port: <code class="font-mono">5150</code> · CLI: <code class="font-mono">cargo loco start</code>
          </p>
        </div>
      </DemoPanel>
    </div>

    <!-- lokoFetch util -->
    <div class="mt-6">
      <DemoPanel
        title="lokoFetch utility — graceful fallback"
        description="Forsøger altid Loko.rs. Falder automatisk tilbage til mock-data ved fejl. Demo kører standalone."
        :code="lokoClientCode"
        lang="typescript"
        filename="server/utils/loko-client.ts"
        badge="nitro"
      >
        <div class="text-sm space-y-2">
          <div class="p-3 rounded-lg bg-dark-700 border border-dark-600">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-slate-400">LOKO_API_URL</span>
              <span class="font-mono text-slate-300">{{ (health as any)?.nitro?.fromMock ? 'ikke sat' : 'http://localhost:5150' }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Status</span>
              <span :class="(health as any)?.nitro?.fromMock ? 'text-yellow-400' : 'text-nuxt-400'">
                {{ (health as any)?.nitro?.fromMock ? '⚠ Mock data (Loko.rs offline)' : '✓ Live Loko.rs data' }}
              </span>
            </div>
          </div>
        </div>
      </DemoPanel>
    </div>
  </div>
</template>
