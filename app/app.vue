<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <TelegramPopup v-model="showTelegramPopup" :telegram-url="telegramUrl" @confirm="handleTelegram" />
  <div class="telegram-icon-btn" v-if="appStore.getShowService" @click="handleContactService">
    <img src="./assets/img/index/telegram.gif" class="telegram-icon" alt="">
  </div>
</template>

<script setup>
import { getServiceUrl } from './api/system'
const appStore = useAppStore()
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const showTelegramPopup = ref(false)
const telegramUrl = ref('')
if (import.meta.client) {
  const setFontSize = () => {
    const d = document.documentElement
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    d.style.fontSize = (isMobile ? (d.clientWidth / 375) * 50 : (d.clientHeight / 1080) * 80) + 'px'
  }
  setFontSize()
}

const handleContactService = () => {
  showLoading($lang('加载中'))
  getServiceUrl().then(res => {
    hideLoading()
    if (res.success) {
      if (res.data.telegram_url) {
        telegramUrl.value = res.data.telegram_url
        showTelegramPopup.value = true
      } else {
        showMsg($lang('未配置Telegram客服链接'), 'fail')
      }
    } else {
      showMsg(res.message, 'fail')
    }
  }).catch(error => {
    hideLoading()
    showMsg(error.message, 'fail')
  })
}

const handleTelegram = () => {
  showTelegramPopup.value = false
}
</script>

<style scoped lang="scss">
.telegram-icon-btn {
  width: rem(50);
  position: fixed;
  bottom: rem(100);
  right: calc(50% - rem(175));
  cursor: pointer;
  z-index: 1000;

  .telegram-icon {
    width: 100%;
    display: block;
  }
}
</style>
