<template>
  <div class="page-login">
    <!-- 语言切换 -->
    <div class="lang-switch">
      <span
        :class="{ active: locale === 'zh-CN' }"
        @click="switchLang('zh-CN')"
      >中文</span>
      <span class="divider">|</span>
      <span
        :class="{ active: locale === 'en' }"
        @click="switchLang('en')"
      >EN</span>
    </div>

    <h1>{{ t('login') }}</h1>

    <div class="form">
      <input type="text" :placeholder="t('username')" />
      <input type="password" :placeholder="t('password')" />
      <button @click="handleLogin">{{ t('login') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'login',
})

const { t, locale } = useI18n()

useHead({
  title: t('login'),
})

const switchLang = (lang) => {
  locale.value = lang
}

const handleLogin = () => {
  console.log('login')
}
</script>

<style scoped lang="scss">
.page-login {
  padding: 40px 20px;

  .lang-switch {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    margin-bottom: 30px;
    font-size: 13px;
    color: #999;

    span {
      cursor: pointer;
      &.active {
        color: #333;
        font-weight: bold;
      }
    }

    .divider {
      cursor: default;
    }
  }

  h1 {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    input {
      width: 100%;
      height: 44px;
      padding: 0 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      outline: none;

      &:focus {
        border-color: var(--primary-color);
      }
    }

    button {
      height: 44px;
      background-color: var(--primary-color);
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      cursor: pointer;
    }
  }
}
</style>
