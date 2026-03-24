<template>
  <div class="main">
    
    <slot />
    <PwaInstallPrompt/>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.main {
  position: relative;
  width: rem(375);
  margin: 0 auto;
  min-height: 100vh;
  background: #F8FAFC;
  overflow: hidden;

  // 顶部装饰光晕
  &::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -60px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
    z-index: 0;
  }
}
</style>
