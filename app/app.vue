<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// import { storage } from '~/utils/index'

// const { $socket, $createSocket, $destroySocket, $bus } = useNuxtApp()

// const userId = storage.get('user_id')

// onMounted(() => {
//   if (userId) {
//     $createSocket(userId)
//   }

//   const handlers = $bus().get('new-private-message') || []
//   handlers.push((data) => {
//     console.log('收到新消息:', data)
//   })
//   $bus().set('new-private-message', handlers)
// })

// onUnmounted(() => {
//   $destroySocket()
// })
if (import.meta.client) {
  const setFontSize = () => {
    const d = document.documentElement
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    d.style.fontSize = (isMobile ? (d.clientWidth / 375) * 50 : (d.clientHeight / 1080) * 80) + 'px'
  }
  setFontSize()
}
</script>
