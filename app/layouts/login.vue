<template>
  <div class="main">
    <div class="topbar">
      <LangSwitch />
    </div>
    <slot />
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
  background: #F4F6F9;
  overflow: hidden;
}

.topbar {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  padding: rem(16) rem(20) 0;
}
</style>
