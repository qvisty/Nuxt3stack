// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  app: {
    head: {
      title: 'Nuxt 3 + Loko.rs Demo',
      htmlAttrs: { lang: 'da' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Selvdokumenterende Nuxt 3 demo med Loko.rs (Rust) backend integration',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
    },
  },

  // Runtime config — server-side secret, client-side public
  runtimeConfig: {
    lokoApiUrl: process.env.LOKO_API_URL || 'http://localhost:5150',
    public: {
      lokoApiUrl: process.env.LOKO_API_URL || 'http://localhost:5150',
      appVersion: '1.0.0',
    },
  },

  // Nitro server configuration (used by Loko.rs proxy routes)
  nitro: {
    routeRules: {
      '/api/**': { cors: true },
    },
  },

  typescript: {
    strict: true,
  },
})
