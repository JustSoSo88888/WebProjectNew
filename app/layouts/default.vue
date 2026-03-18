<template>
  <div class="main">
    <div class="main__content">
      <slot />
    </div>
    <BottomNav />
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.main {
  width: rem(375);
  margin: 0 auto;
  overflow: hidden;
  height: 100vh;
  position: relative;
  background: #F8FAFC;

  &__content {
    height: 100%;
    overflow-y: auto;
    padding-bottom: rem(64);
  }
}
</style>
