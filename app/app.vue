<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

if (import.meta.client) {
  const setFontSize = () => {
    const d = document.documentElement
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    d.style.fontSize = (isMobile ? (d.clientWidth / 375) * 50 : (d.clientHeight / 1080) * 80) + 'px'
  }
  setFontSize()
}

const route = useRoute()

const TAB_ORDER = { '/': 0, '/login/login': 1, '/login/register': 2, '/finance': 3, '/team': 4, '/task': 5, '/profile': 6 }

const getTabIndex = (path) => {
  for (const [key, val] of Object.entries(TAB_ORDER)) {
    if (path === key || (key !== '/' && path.startsWith(key))) return val
  }
  return -1
}

const transitionName = ref('slide-left')

const pageTransition = computed(() => ({
  name: transitionName.value,
  mode: 'out-in',
}))

watch(() => route.path, (newPath, oldPath) => {
  const ni = getTabIndex(newPath)
  const oi = getTabIndex(oldPath)
  transitionName.value = (ni >= 0 && oi >= 0 && ni < oi) ? 'slide-right' : 'slide-left'
})
</script>
