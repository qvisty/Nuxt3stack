/**
 * Typer der matcher Loko.rs API-respons strukturer.
 * Loko.rs bruger SeaORM + Serde til serialisering → camelCase JSON.
 */

export interface LokoPost {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
  tags: string[]
}

export interface LokoUser {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface LokoHealth {
  status: 'ok' | 'degraded'
  version: string
  uptime: number
  database: boolean
  cache: boolean
}

export interface LokoApiList<T> {
  data: T[]
  total: number
  page: number
  perPage: number
}

export interface LokoApiError {
  error: string
  message: string
  statusCode: number
}
