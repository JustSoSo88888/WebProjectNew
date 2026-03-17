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
        {
          // 内联到 <head> 最前，SSR/CSR 都能在渲染前设好 font-size
          innerHTML: `(function(){var d=document.documentElement;var w=d.clientWidth;var h=d.clientHeight;var m=/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);d.style.fontSize=(m?(w/375)*50:(h/1080)*80)+'px';})();`,
          type: 'text/javascript',
        },
      ],
    },
  },
  // 全局 CSS 引用
  css: [
    '~/assets/scss/global.scss',
  ],
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/scss/config.scss" as *;`,
        },
      },
    },
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

