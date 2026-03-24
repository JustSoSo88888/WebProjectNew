import { defineNuxtPlugin } from '#app'
import Dialog from '~/components/Dialog.vue'
import { h, render } from 'vue'

const DialogApi = {
  alert(options) {
    return new Promise((resolve) => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const vnode = h(Dialog, {
        modelValue: true,
        title: options.title || '',
        message: options.message || '',
        clickCancel: false,
        showCancel: false,
        confirmText: options.confirmText || 'Confirm',
        'onConfirm': () => {
          resolve({})
          render(null, container)
          container.remove()
        },
      })

      render(vnode, container)
    })
  },

  confirm(options) {
    return new Promise((resolve, reject) => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const vnode = h(Dialog, {
        modelValue: true,
        title: options.title || '',
        message: options.message || '',
        clickCancel: true,
        showCancel: true,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        'onConfirm': () => {
          resolve({})
          render(null, container)
          container.remove()
        },
        'onCancel': () => {
          reject({})
          render(null, container)
          container.remove()
        },
      })

      render(vnode, container)
    })
  },

  close() {
    const dialogs = document.querySelectorAll('.dialog-overlay')
    dialogs.forEach(el => el.remove())
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.$dialog = DialogApi
  nuxtApp.provide('dialog', DialogApi)
})
