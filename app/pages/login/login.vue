<template>
  <ClientOnly>
    <div class="page-login">
      <!-- Logo区 -->
      <div class="logo-area">
        <div class="logo-icon">
          <svg viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#2563EB"/>
            <rect x="13" y="13" width="9" height="9" rx="2" fill="white" opacity="0.9"/>
            <rect x="26" y="13" width="9" height="9" rx="2" fill="white" opacity="0.5"/>
            <rect x="13" y="26" width="9" height="9" rx="2" fill="white" opacity="0.5"/>
            <rect x="26" y="26" width="9" height="9" rx="2" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <h1 class="logo-title">SP</h1>
      </div>

      <!-- 标题 -->
      <div class="page-header">
        <h2>{{ $t('login') }}</h2>
        <p>{{ $t('hasAccount') ? '' : '' }}Welcome back</p>
      </div>

      <!-- 表单卡片 -->
      <div class="form-card">
        <!-- 邮箱 -->
        <div class="field">
          <label>{{ $t('email') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'email', error: errors.email }">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <input v-model="form.email" type="email" :placeholder="$t('emailPlaceholder')" @focus="focus = 'email'"
              @blur="focus = ''" />
          </div>
          <span v-if="errors.email" class="err-msg">{{ errors.email }}</span>
        </div>

        <!-- 密码 -->
        <div class="field">
          <label>{{ $t('password') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'pwd', error: errors.password }">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <input v-model="form.password" :type="showPwd ? 'text' : 'password'"
              :placeholder="$t('passwordPlaceholder')" @focus="focus = 'pwd'" @blur="focus = ''" />
            <button class="eye-btn" @click="showPwd = !showPwd">
              <svg v-if="!showPwd" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="err-msg">{{ errors.password }}</span>
        </div>

        <!-- 忘记密码 -->
        <div class="forgot">
          <a href="#">{{ $t('forgotPassword') }}</a>
        </div>

        <!-- 登录按钮 -->
        <button class="btn-primary" :disabled="loading" @click="handleLogin">
          <span v-if="!loading">{{ $t('login') }}</span>
          <span v-else class="dots"><i></i><i></i><i></i></span>
        </button>
      </div>

      <!-- 注册跳转 -->
      <div class="bottom-link">
        <span>{{ $t('noAccount') }}</span>
        <NuxtLink to="/login/register">{{ $t('signUp') }}</NuxtLink>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { emailLogin } from '~/api/login';
import {encrypt} from '~/api/AES.js';
import {storage} from '../../utils/index';
import md5 from 'js-md5'
 
definePageMeta({ layout: 'login' })
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const focus = ref('')
const showPwd = ref(false)
const loading = ref(false)

const validate = () => {
  errors.email = ''
  errors.password = ''
  if (!form.email) { errors.email = '请输入邮箱'; return false }
  if (!/\S+@\S+\.\S+/.test(form.email)) { errors.email = '请输入正确邮箱'; return false }
  if (!form.password) { errors.password = '请输入密码'; return false }
  if (form.password.length < 6 || form.password.length > 18) { errors.password = '请输入6~18位密码'; return false }
  return true
}

const handleLogin = () => {
  if (!validate() || loading.value) return;
  loading.value = true;
  let params = {
    email: form.email,
    password: form.password
  }

  emailLogin(params).then(res => {
    loading.value = false;
    if (res.success) {
      showMsg('登录成功', 'success')
      setTimeout(() => {
        const token = encrypt(res.data.token)
        storage.set('token', token)
        storage.set('user_id', res.data.id)
        storage.set('user_data', JSON.stringify(res.data))
        storage.set('session', md5(token + 'ckeck_session'))
        navigateTo('/')
      }, 1000)
    } else {
      showMsg(res.message, 'fail')
    }
  }).catch(error => {
    loading.value = false
    hideLoading();
    showMsg(error.message, 'fail')
  })
}
</script>

<style lang="scss">
@use '~/assets/scss/login.scss';
</style>
