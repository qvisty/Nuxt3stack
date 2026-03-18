export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxthub/core',
    'nuxt-auth-utils',
  ],

  hub: {
    database: true,
  },

  app: {
    head: {
      title: 'Bilvedligeholdelse',
      htmlAttrs: { lang: 'da' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Personlig bil-vedligeholdelseslog' },
      ],
    },
  },

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7, // 7 dage
    },
  },

  typescript: {
    strict: true,
  },
})
