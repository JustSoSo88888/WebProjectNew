<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// 在客户端 hydration 完成后立即同步 font-size，消除 SSR/CSR 差异导致的跳动
if (import.meta.client) {
  const setFontSize = () => {
    const d = document.documentElement
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    d.style.fontSize = (isMobile ? (d.clientWidth / 375) * 50 : (d.clientHeight / 1080) * 80) + 'px'
  }
  setFontSize()
}
</script>

