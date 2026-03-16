<template>
  <ClientOnly>
    <div class="page-login">
      <div class="lang-switch">
        <span :class="{ active: locale === 'en' }" @click="switchLang('en')">EN</span>
        <span class="divider">|</span>
        <span :class="{ active: locale === 'es' }" @click="switchLang('es')">ES</span>
      </div>

      <h1>{{ t('login') }}</h1>

      <div class="form">
        <input type="text" :placeholder="t('username')" />
        <input type="password" :placeholder="t('password')" />
        <button @click="handleLogin">{{ t('login') }}</button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
definePageMeta({
  layout: 'login',
})

const { t, locale, setLocale } = useI18n()

const switchLang = (lang) => {
  setLocale(lang)
}

const handleLogin = () => {
  console.log('语言包',locale.value)
}
</script>

<style scoped lang="scss">
.page-login {
  padding: rem(40) rem(20);

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

    .divider { cursor: default; }
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
      &:focus { border-color: #3b82f6; }
    }

    button {
      height: 44px;
      background-color: #3b82f6;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      cursor: pointer;
    }
  }
}
</style>
