<template>
  <ClientOnly>
    <div class="page-register">
      <!-- Logo区 -->
      <div class="logo-area">
        <div class="logo-icon">
          <svg viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="#1677FF"/>
            <path d="M14 24h20M24 14v20" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
            <circle cx="24" cy="24" r="8" stroke="#fff" stroke-width="2.5" opacity="0.4"/>
          </svg>
        </div>
        <h1 class="logo-title">SP</h1>
      </div>

      <!-- 标题 -->
      <div class="page-header">
        <h2>{{ $t('register') }}</h2>
        <p>Create your account</p>
      </div>

      <!-- 表单 -->
      <div class="form-card">
        <!-- 邮箱 -->
        <div class="field">
          <label>{{ $t('email') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'email', error: errors.email }">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input
              v-model="form.email"
              type="email"
              :placeholder="$t('emailPlaceholder')"
              @focus="focus = 'email'"
              @blur="focus = ''"
            />
          </div>
          <span v-if="errors.email" class="err-msg">{{ errors.email }}</span>
        </div>

        <!-- 密码 -->
        <div class="field">
          <label>{{ $t('password') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'pwd', error: errors.password }">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              :placeholder="$t('passwordPlaceholder')"
              @focus="focus = 'pwd'"
              @blur="focus = ''"
            />
            <button class="eye-btn" @click="showPwd = !showPwd">
              <svg v-if="!showPwd" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="err-msg">{{ errors.password }}</span>
        </div>

        <!-- 确认密码 -->
        <div class="field">
          <label>{{ $t('confirmPassword') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'confirm', error: errors.confirmPassword }">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M9 16l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              v-model="form.confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              :placeholder="$t('confirmPasswordPlaceholder')"
              @focus="focus = 'confirm'"
              @blur="focus = ''"
            />
            <button class="eye-btn" @click="showConfirm = !showConfirm">
              <svg v-if="!showConfirm" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="err-msg">{{ errors.confirmPassword }}</span>
        </div>

        <!-- 邀请码 -->
        <div class="field">
          <label>{{ $t('inviteCode') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'invite' }">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 12V22H4V12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M22 7H2v5h20V7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            <input
              v-model="form.inviteCode"
              type="text"
              :placeholder="$t('inviteCodePlaceholder')"
              @focus="focus = 'invite'"
              @blur="focus = ''"
            />
          </div>
        </div>

        <!-- 注册按钮 -->
        <button class="btn-primary" :disabled="loading" @click="handleRegister">
          <span v-if="!loading">{{ $t('register') }}</span>
          <span v-else class="dots"><i></i><i></i><i></i></span>
        </button>
      </div>

      <!-- 登录跳转 -->
      <div class="bottom-link">
        <span>{{ $t('hasAccount') }}</span>
        <NuxtLink to="/login/login">{{ $t('signIn') }}</NuxtLink>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, reactive } from 'vue'

definePageMeta({ layout: 'login' })

const { t } = useI18n()
const form = reactive({ email: '', password: '', confirmPassword: '', inviteCode: '' })
const errors = reactive({ email: '', password: '', confirmPassword: '' })
const focus = ref('')
const showPwd = ref(false)
const showConfirm = ref(false)
const loading = ref(false)

const validate = () => {
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  if (!form.email) { errors.email = 'Email is required'; return false }
  if (!/\S+@\S+\.\S+/.test(form.email)) { errors.email = 'Invalid email'; return false }
  if (!form.password) { errors.password = 'Password is required'; return false }
  if (form.password.length < 6) { errors.password = 'At least 6 characters'; return false }
  if (!form.confirmPassword) { errors.confirmPassword = 'Please confirm password'; return false }
  if (form.password !== form.confirmPassword) { errors.confirmPassword = 'Passwords do not match'; return false }
  return true
}

const handleRegister = async () => {
  if (!validate() || loading.value) return
  loading.value = true
  showLoading()
  try {
    await new Promise(r => setTimeout(r, 1500))
    hideLoading()
    showMsg(t('register') + ' success', 'success')
  } catch {
    hideLoading()
    showMsg('Register failed', 'fail')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
@use '~/assets/scss/login.scss';
</style>
