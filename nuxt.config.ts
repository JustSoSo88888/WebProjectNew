// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      { code: 'en', file: 'en.js', name: 'English' },
      { code: 'es', file: 'es.js', name: 'Español' },
    ],
    defaultLocale: 'en',
    langDir: './locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },
  app: {
    // 全局 <head> 配置
    head: {
      title: 'SP',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      meta: [
        { name: 'description', content: 'SP Application' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      script: [
      ],
    },
  },
  // 全局 CSS 引用
  css: [
    '~/assets/scss/global.scss',
  ],
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'vant',
      ]
    }
  },
  // 开发服务器配置
  devServer: {
    host: 'localhost',
    port: 3090,
  },
})

