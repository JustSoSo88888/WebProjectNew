<template>
  <div class="page-register">
    <!-- 背景图层 -->
    <div class="bg-layer"></div>

    <!-- 内容区 -->
    <div class="login-content">
      <!-- Logo 和品牌 -->
      <div class="brand-section">
        <img :src="LOGO" class="logo" alt="">
      </div>

      <!-- 注册卡片 -->
      <div class="login-card">
        <h2>{{ $lang('注册') }}</h2>
        <p class="subtitle">{{ $lang('今天就开始您的专属旅程吧') }}</p>

        <!-- 邮箱 -->
        <div class="field">
          <label>{{ $lang('手机号') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'phone', error: errors.phone }">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <span class="area-code" translate="no">+{{ areaCode }}</span>
            <input v-model="form.phone" class="area-code-input" type="number" :placeholder="$lang('请输入手机号')"
              @focus="focus = 'phone'" @blur="focus = ''" />
          </div>
          <span v-if="errors.phone" class="err-msg">{{ errors.phone }}</span>
        </div>

        <!-- 密码 -->
        <div class="field">
          <label>{{ $lang('密码') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'pwd', error: errors.password }">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <input v-model="form.password" :type="showPwd ? 'text' : 'password'" :placeholder="$lang('请输入密码')"
              @focus="focus = 'pwd'" @blur="focus = ''" />
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

        <!-- 确认密码 -->
        <div class="field">
          <label>{{ $lang('确认密码') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'confirm', error: errors.confirmPassword }">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path d="M9 16l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <input v-model="form.confirmPassword" :type="showConfirm ? 'text' : 'password'" :placeholder="$lang('请输入确认密码')"
              @focus="focus = 'confirm'" @blur="focus = ''" />
            <button class="eye-btn" @click="showConfirm = !showConfirm">
              <svg v-if="!showConfirm" viewBox="0 0 24 24" fill="none">
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
          <span v-if="errors.confirmPassword" class="err-msg">{{ errors.confirmPassword }}</span>
        </div>

        <!-- 邀请码 -->
        <div class="field">
          <label>{{ $lang('邀请码') }}</label>
          <div class="input-wrap" :class="{ focused: focus === 'invite', error: errors.inviteCode }">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 12V22H4V12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M22 7H2v5h20V7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
            <input v-model="form.inviteCode" type="text" :placeholder="$lang('请输入邀请码')" @focus="focus = 'invite'"
              @blur="focus = ''" />
          </div>
          <span v-if="errors.inviteCode" class="err-msg">{{ errors.inviteCode }}</span>
        </div>

        <!-- 注册按钮 -->
        <button class="btn-primary" :disabled="loading" @click="handleRegister">
          <span v-if="!loading">{{ $lang('注册') }}</span>
          <span v-else class="dots"><i></i><i></i><i></i></span>
        </button>

        <!-- 登录链接 -->
        <div class="bottom-link">
          <span>{{ $lang('已有账户') }}</span>
          <NuxtLink to="/login/login">{{ $lang('登录') }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted} from 'vue';
import { register, login } from '~/api/login';
import { encrypt } from '~/api/AES.js';
import { storage } from '../../utils/index';
import md5 from 'js-md5';
import LOGO from '../../../public/logo-transparent.png';

const route = useRoute();
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
definePageMeta({ layout: 'login' })
const form = reactive({ phone: '', password: '', confirmPassword: '', inviteCode: '' })
const errors = reactive({ phone: '', password: '', confirmPassword: '', inviteCode: '' })
const focus = ref('')
const showPwd = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const areaCode = ref(55)

const validate = () => {
  errors.phone = ''
  errors.password = ''
  errors.confirmPassword = ''
  if (!form.phone) { errors.phone = $lang('请输入手机号'); return false }
  if (!form.password) { errors.password = $lang('请输入密码'); return false }
  if (form.password.length < 6 || form.password.length > 18) { errors.password = $lang('请输入6到18位密码'); return false }
  if (!form.confirmPassword) { errors.confirmPassword = $lang('请输入确认密码'); return false }
  if (form.password !== form.confirmPassword) { form.password = ''; form.confirmPassword = ''; errors.confirmPassword = $lang('密码不一致请重新输入'); return false }
  if (!form.inviteCode) { errors.inviteCode = $lang('请输入邀请码'); return false }
  return true
}

onMounted(() => {
  const token = storage.get('token')
  if (token) {
    navigateTo('/')
    return
  }
  if(route.query.code){
    window.localStorage.setItem('invite', route.query.code);
    form.inviteCode = route.query.code
  }else{
    let inviteCode = window.localStorage.getItem('invite');
    form.inviteCode = inviteCode
  }
})

const handleRegister = async () => {
  if (!validate() || loading.value) return
  loading.value = true
  let params = {
    phone: form.phone,
    password: form.password,
    invite: form.inviteCode,
    area_code: areaCode.value,

  }
  register(params).then(res => {
    if (res.success) {
      let params1 = {
        phone: form.phone,
        password: form.password,
        area_code: areaCode.value
      }
      login(params1).then(ret => {
        loading.value = false;
        if (ret.success) {
          showMsg($lang('注册成功'), 'success')
          setTimeout(() => {
            const token = encrypt(ret.data.token)
            storage.set('token', token)
            storage.set('user_id', ret.data.id)
            storage.set('user_data', JSON.stringify(ret.data))
            storage.set('session', md5(token + 'ckeck_session'))
            navigateTo('/')
          }, 1000)
        } else {
          showMsg(ret.message, 'fail')
        }
      }).catch(error => {
        loading.value = false
        showMsg(error.message, 'fail')
      })
    } else {
      loading.value = false
      showMsg(res.message, 'fail')
    }
  }).catch(error => {
    loading.value = false
    showMsg(error.message, 'fail')

  })
}
</script>

<style lang="scss">
@use '~/assets/scss/login.scss';
</style>
