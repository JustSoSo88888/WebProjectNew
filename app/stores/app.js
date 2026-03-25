import { defineStore } from 'pinia'
import { storage } from '~/utils/index'
import config from '~/config'

const importLangImages = () => ({
  'en': { icon: new URL('../assets/img/language/en.png', import.meta.url).href, label: 'English', id: 'en' },
  'pt': { icon: new URL('../assets/img/language/pt.png', import.meta.url).href, label: 'Português', id: 'pt' },
})

export const useAppStore = defineStore('app', {
  state: () => ({
    isMobile: false,
    isPWAShow: true,
    localeLang: storage.get('locale') ? storage.get('locale') : config.defaultLang,
    langList: importLangImages(),
    unReadCount: 0,//客服未读消息

  }),
  getters: {
    getIsMobile: state => state.isMobile,
    getIsPWAShow: state => state.isPWAShow,
    getLocaleLang: state => state.localeLang,
    getLangList: state => state.langList,
    getUnReadCount:state => state.unReadCount,
  },
  actions: {
    setIsPWAshow(val) {
      this.isPWAShow = val
    },
    setIsMobile(val) {
      this.isMobile = val
    },
    setUnReadCount(value) {
      this.unReadCount = value
    },
  },
})
