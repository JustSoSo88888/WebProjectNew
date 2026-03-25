// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    ssr: false,
    srcDir: 'app',

    nitro: {
        prerender: {
            crawlLinks: true,
            routes: ['/']
        }
    },

    modules: [
        '@pinia/nuxt',
        '@vite-pwa/nuxt',
    ],

    build: {
        transpile: ['vant'],
    },
    app: {
        pageTransition: { name: 'slide-left', mode: 'out-in' },
        // 全局 <head> 配置
        head: {
            title: 'Nova Travel',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
            meta: [
                { name: 'description', content: 'NovaTravel Application' },
                { name: 'theme-color', content: '#ffffff' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'manifest', href: '/manifest.webmanifest' },
            ],
            script: [
                {
                    // 内联到 <head> 最前，SSR/CSR 都能在渲染前设好 font-size
                    innerHTML: `(function(){function setFontSize(){var d=document.documentElement;var w=d.clientWidth;var h=d.clientHeight;var m=/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);d.style.fontSize=(m?(w/375)*50:(h/1080)*80)+'px';}setFontSize();window.addEventListener('resize',setFontSize);})();`,
                    type: 'text/javascript',
                    tagPosition: 'head',
                },
            ],
        },
    },
    // 全局 CSS 引用
    css: [
        '@/assets/scss/global.scss',
    ],
    devtools: { enabled: true },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/assets/scss/config.scss" as *; @use "@/assets/scss/mixins.scss" as *;`,
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
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'NovaTravel',
            short_name: 'NovaTravel',
            description: 'NovaTravel Application',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/',
            scope: '/',
            icons: [
                {
                    src: '/logo.png',
                    sizes: '64x64',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/logo.png',
                    sizes: '120x120',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/logo.png',
                    sizes: '144x144',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/logo.png',
                    sizes: '152x152',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/logo.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/logo.png',
                    sizes: '384x384',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/logo.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/logo.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable'
                }
            ]
        },
        workbox: {
            navigateFallback: '/',
            cleanupOutdatedCaches: true,
            navigateFallbackDenylist: [/^\/manifest\.webmanifest$/]
        },
        devOptions: {
            enabled: true,
            type: 'module'
        }
    }
})

