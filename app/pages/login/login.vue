<template>
    <div class="page-login">
        <!-- 背景图层 -->
        <div class="bg-layer"></div>

        <!-- 内容区 -->
        <div class="login-content">
            <!-- Logo 和品牌 -->
            <div class="brand-section">
                <img :src="LOGO" class="logo" alt="">
            </div>

            <!-- 登录卡片 -->
            <div class="login-card">
                <h2>{{ $t('登录') }}</h2>
                <p class="subtitle">{{ $t('欢迎开启您的专属旅程') }}</p>

                <!-- 邮箱 -->
                <div class="field">
                    <label>{{ $t('手机号') }}</label>
                    <div class="input-wrap" :class="{ focused: focus === 'phone', error: errors.phone }">
                        <svg viewBox="0 0 24 24" fill="none">
                            <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="1.5" />
                            <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <span class="area-code" translate="no">+{{ areaCode }}</span>
                        <input v-model="form.phone" class="area-code-input" type="number" :placeholder="$t('请输入手机号')" @focus="focus = 'phone'"
                            @blur="focus = ''" />
                    </div>
                    <span v-if="errors.phone" class="err-msg">{{ errors.phone }}</span>
                </div>

                <!-- 密码 -->
                <div class="field">
                    <label>{{ $t('密码') }}</label>
                    <div class="input-wrap" :class="{ focused: focus === 'pwd', error: errors.password }">
                        <svg viewBox="0 0 24 24" fill="none">
                            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5" />
                            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" />
                        </svg>
                        <input v-model="form.password" :type="showPwd ? 'text' : 'password'" :placeholder="$t('请输入密码')"
                            @focus="focus = 'pwd'" @blur="focus = ''" />
                        <button class="eye-btn" @click="showPwd = !showPwd">
                            <svg v-if="!showPwd" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor"
                                    stroke-width="1.5" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" />
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                    <span v-if="errors.password" class="err-msg">{{ errors.password }}</span>
                </div>

                <!-- 登录按钮 -->
                <button class="btn-primary" :disabled="loading" @click="handleLogin">
                    <span v-if="!loading">{{ $t('登录') }}</span>
                    <span v-else class="dots"><i></i><i></i><i></i></span>
                </button>

                <!-- 注册链接 -->
                <div class="bottom-link">
                    <span>{{ $t('没有账户') }}</span>
                    <NuxtLink to="/login/register">{{ $t('注册') }}</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { login } from '~/api/login';
import { encrypt } from '~/api/AES.js';
import { storage } from '../../utils/index';
import md5 from 'js-md5';
import LOGO from '../../../public/logo-transparent.png'

definePageMeta({ layout: 'login' })
const form = reactive({ phone: '', password: '' })
const errors = reactive({ phone: '', password: '' })
const focus = ref('')
const showPwd = ref(false)
const loading = ref(false)
const areaCode = ref(55)

const validate = () => {
    errors.phone = ''
    errors.password = ''
    if (!form.phone) {
        errors.phone = $t('请输入手机号');
        return false
    }
    if (!form.password) {
        errors.password = $t('请输入密码');
        return false
    }
    if (form.password.length < 6 || form.password.length > 18) {
        errors.password = $t('请输入6~18位密码');
        return false
    }
    return true
}

const handleLogin = () => {
    if (!validate() || loading.value) return;
    loading.value = true;
    let params = {
        phone: form.phone,
        password: form.password,
        area_code: areaCode.value
    }

    login(params).then(res => {
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
        showMsg(error.message, 'fail')
    })
}
</script>

<style lang="scss">
@use '~/assets/scss/login.scss';
</style>
