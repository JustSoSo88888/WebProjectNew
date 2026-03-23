import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isMobile: false,
    isPWAShow:true,
  }),
  getters:{
    getIsPWAShow(state){
      return state.isPWAShow
    }
  },
  actions: {
    setIsPWAshow(val){
      this.isPWAShow = val
    },
    setIsMobile(val) {
      this.isMobile = val
    },
  },
})
