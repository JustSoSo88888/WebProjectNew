<template>
  <div class="connection-status" :class="status" @click="handleClick">
    <span class="dot"></span>
    <span class="text">{{ statusText }}</span>
    <van-icon v-if="status.value === 'disconnected'" class="text" name="replay" style="font-weight: bold;" size=".3rem"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '~/stores/app.js'

const appStore = useAppStore()
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const status = computed(() => appStore.getSocketStatus)

const statusText = computed(() => {
  const map = {
    connected: $lang('在线'),
    connecting: $lang('连接中'),
    disconnected: $lang('离线')
  }
  return map[status.value] || map.disconnected
})

const handleClick = () => {
  if (status.value === 'disconnected') {
    nuxtApp.$reconnect()
  }
}
</script>

<style scoped lang="scss">
.connection-status {
  display: inline-flex;
  align-items: center;
  gap: rem(6);
  font-size: rem(12);
  
  .dot {
    width: rem(8);
    height: rem(8);
    border-radius: 50%;
  }
  
  &.connected {
    .dot { background: #52c41a; }
    .text { color: #52c41a; }
  }
  
  &.connecting {
    .dot { background: #faad14; animation: pulse 1s infinite; }
    .text { color: #faad14; }
  }
  
  &.disconnected {
    cursor: pointer;
    .dot { background: #ff4d4f; }
    .text { color: #ff4d4f; }
    &:hover { opacity: 0.8; }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
