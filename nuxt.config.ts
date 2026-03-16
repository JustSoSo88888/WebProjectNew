// https://nuxt.com/docs/api/configuration/nuxt-config
import type {} from '@nuxtjs/i18n'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      { code: 'zh-CN', file: 'zh-CN.js' },
      { code: 'en', file: 'en.js' },
    ],
    defaultLocale: 'zh-CN',
    langDir: 'locales/',
    strategy: 'no_prefix',
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

  // 开发服务器配置
  devServer: {
    host: 'localhost',
    port: 3090,
  },




})

