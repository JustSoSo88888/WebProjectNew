<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount } from 'vue'

useHead({
  title: '登录',
})

const count = ref(0)

onBeforeMount(() => {

})

onMounted(() => {

})

onBeforeUnmount(() => {

})

onUnmounted(() => {

})
</script>

<style scoped lang="scss">
</style>
