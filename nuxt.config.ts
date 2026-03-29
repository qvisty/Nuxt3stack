export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
  ],

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

  typescript: {
    strict: true,
  },
})
