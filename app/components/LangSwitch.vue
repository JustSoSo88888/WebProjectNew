<template>
  <div class="lang-switch">
    <button class="lang-btn" @click="open = true">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>{{ currentLang.label }}</span>
      <svg class="chevron" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- 遮罩 -->
    <Transition name="fade">
      <div v-if="open" class="overlay" @click="open = false"></div>
    </Transition>

    <!-- 弹窗 -->
    <Transition name="slide-up">
      <div v-if="open" class="sheet">
        <div class="sheet-header">
          <span>{{ $t('selectLanguage') }}</span>
          <button class="close-btn" @click="open = false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="lang-list">
          <button
            v-for="lang in langs"
            :key="lang.code"
            class="lang-item"
            :class="{ active: locale === lang.code }"
            @click="select(lang.code)"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            <span class="lang-name">{{ lang.label }}</span>
            <svg v-if="locale === lang.code" class="check" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { locale, setLocale } = useI18n()
const open = ref(false)

const langs = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

const currentLang = computed(() => langs.find(l => l.code === locale.value) || langs[0])

const select = (code) => {
  setLocale(code)
  open.value = false
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/config' as *;

.lang-switch {
  position: relative;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: rem(5);
  padding: rem(6) rem(12);
  border: 1px solid $color-border;
  border-radius: $radius-full;
  background: $color-white;
  color: $color-text-secondary;
  font-size: rem(13);
  cursor: pointer;
  transition: $transition-fast;

  &:hover {
    border-color: $color-primary;
    color: $color-primary;
    box-shadow: 0 0 0 3px $color-primary-glow;
  }

  svg { width: rem(16); height: rem(16); }
  .chevron { width: rem(14); height: rem(14); }
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 100;
}

.sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: rem(375);
  background: $color-white;
  border-radius: rem(20) rem(20) 0 0;
  z-index: 101;
  padding-bottom: env(safe-area-inset-bottom, 16px);

  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(18) rem(20) rem(12);
    font-size: rem(16);
    font-weight: 600;
    color: $color-text-primary;
    border-bottom: 1px solid $color-border-light;

    .close-btn {
      width: rem(32);
      height: rem(32);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: $color-gray-100;
      cursor: pointer;
      svg { width: rem(16); height: rem(16); color: $color-text-secondary; }
    }
  }

  .lang-list {
    padding: rem(8) rem(12) rem(16);
    display: flex;
    flex-direction: column;
    gap: rem(4);
  }

  .lang-item {
    display: flex;
    align-items: center;
    gap: rem(12);
    padding: rem(14) rem(12);
    border-radius: $radius-lg;
    cursor: pointer;
    transition: $transition-fast;
    background: transparent;
    width: 100%;
    text-align: left;

    &:hover { background: $color-gray-100; }

    &.active {
      background: $color-primary-bg;
      .lang-name { color: $color-primary; font-weight: 600; }
    }

    .lang-flag { font-size: rem(22); }
    .lang-name { flex: 1; font-size: rem(15); color: $color-text-primary; }
    .check { width: rem(18); height: rem(18); color: $color-primary; }
  }
}

/* 动画 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(100%); }
</style>
