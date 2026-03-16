import config from '~/config/index.js'

export default defineNuxtPlugin(() => {
  if (!process.client) return
  if (!config.enableDevtoolsDetector) return

  import('devtools-detector').then(({ addListener, launch }) => {
    addListener((isOpen) => {
      if (isOpen) {
        document.body.innerHTML = ''
        window.location.href = 'about:blank'
      }
    })
    launch()
  })
})
