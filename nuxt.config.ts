// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
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

