import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isMobile: false,
  }),
  actions: {
    setIsMobile(val) {
      this.isMobile = val
    },
  },
})
