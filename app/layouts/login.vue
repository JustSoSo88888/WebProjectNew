<template>
  <div class="main">
    <button class="lang-switch" @click="showLang = true">
      <img v-if="currentLangIcon" :src="currentLangIcon" class="lang-icon" />
    </button>
    <slot />
    <PwaInstallPrompt />
    <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="handleLangChange" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '~/stores/app.js'
import LangModal from '~/components/LangModal.vue'
import { storage } from '~/utils/index'

const appStore = useAppStore()
const langList = computed(() => appStore.getLangList)

const showLang = ref(false)
const currentLang = ref(storage.get('locale') || 'en')

const currentLangData = computed(() => langList.value[currentLang.value])
const currentLangIcon = computed(() => currentLangData.value?.icon)

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
  min-height: 100vh;
  background: #F8FAFC;
  overflow: hidden;

  .lang-switch {
    position: absolute;
    top: rem(15);
    right: rem(15);
    z-index: 10;
    display: flex;
    align-items: center;
    color: $color-text-primary;
    cursor: pointer;
    border-radius: rem(5);
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
    background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
    z-index: 0;
  }
}
</style>
