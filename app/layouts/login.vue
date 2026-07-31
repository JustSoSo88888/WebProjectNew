<template>
  <div class="main">
    <button class="lang-switch" @click="showLang = true">
      <img v-if="currentLangIcon" :src="currentLangIcon" class="lang-icon" />
    </button>
    <slot />
    <!-- <PwaInstallPrompt /> -->
    <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="handleLangChange" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '~/stores/app.js'
import LangModal from '~/components/LangModal.vue'
import { storage } from '~/utils/index'
import config from '~/config'

const appStore = useAppStore()
const langList = computed(() => appStore.getLangList)
const showLang = ref(false)
const currentLang = ref(storage.get('locale') || config.defaultLang)
const currentLangData = computed(() => langList.value[currentLang.value])
const currentLangIcon = computed(() => currentLangData.value?.icon)
onMounted(() => {
  appStore.setShowService(false)
})
const handleLangChange = (lang) => {
  if (currentLang.value == lang) return;
  storage.set('locale', lang)
  currentLang.value = lang
  location.reload()
}
</script>

<style scoped lang="scss">
.main {
  position: relative;
  width: rem(375);
  margin: 0 auto;
  min-height: 100dvh;
  background: #F5F6F8;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  .lang-switch {
    position: absolute;
    top: rem(8);
    right: rem(14);
    z-index: 10;
    display: flex;
    align-items: center;
    color: $color-text-primary;
    cursor: pointer;
    justify-content: center;
    width: rem(42);
    height: rem(42);
    border-radius: rem(12);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 rem(8) rem(18) rgba(22, 24, 30, 0.08);
    overflow: hidden;
  }

  .lang-icon {
    width: rem(30);
    height: rem(30);
    object-fit: contain;
  }

  // 顶部装饰光晕
  &::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -60px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(206, 0, 0, 0.10) 0%, transparent 70%);
    z-index: 0;
  }
}
</style>
