<template>
  <div class="main">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount } from 'vue'
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
.main {
  width: rem(375);
  margin: 0 auto;
  overflow: hidden;
  height: 100vh;
}
</style>
