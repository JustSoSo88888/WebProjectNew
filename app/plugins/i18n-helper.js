export default defineNuxtPlugin((nuxtApp) => {
  globalThis.$t = (key) => nuxtApp.$i18n.t(key)
})
