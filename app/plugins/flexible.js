import { useAppStore } from '~/stores/app.js'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const appStore = useAppStore()

    function setRemUnit() {
      const docEl = document.documentElement
      const clientWidth = docEl.clientWidth
      const clientHeight = docEl.clientHeight
      const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
      const fontSize = isMobile ? (clientWidth / 375) * 50 : (clientHeight / 1080) * 80
      docEl.style.fontSize = fontSize + 'px'
      appStore.setIsMobile(isMobile)
    }

    setRemUnit()
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('orientationchange', setRemUnit)
  }
})
