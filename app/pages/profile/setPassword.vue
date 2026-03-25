<template>
    <div class="set-password-page">
        <div class="form-section">
            <div class="form-title">{{ $lang('设置交易密码') }}</div>
            <div class="form-desc">{{ $lang('请设置6位数字交易密码') }}</div>

            <!-- Password Input -->
            <div class="password-group">
                <div class="password-label">{{ $lang('交易密码') }}</div>
                <div class="password-inputs">
                    <input v-for="(_, index) in 6" :key="index" :ref="el => setPasswordRef(el, index)" type="tel"
                        maxlength="1" inputmode="numeric" pattern="[0-9]*" class="password-digit"
                        :class="{ active: password[index], filled: password[index] }" @input="onPasswordInput(index)"
                        @keydown="onPasswordKeydown($event, index)" @focus="onPasswordFocus(index)" />
                </div>
            </div>

            <!-- Confirm Password -->
            <div class="password-group">
                <div class="password-label">{{ $lang('确认密码') }}</div>
                <div class="password-inputs">
                    <input v-for="(_, index) in 6" :key="'confirm-' + index" :ref="el => setConfirmRef(el, index)"
                        type="tel" maxlength="1" inputmode="numeric" pattern="[0-9]*" class="password-digit"
                        :class="{ active: confirmPassword[index], filled: confirmPassword[index] }"
                        @input="onConfirmInput(index)" @keydown="onConfirmKeydown($event, index)"
                        @focus="onConfirmFocus(index)" />
                </div>
            </div>

            <!-- Submit Button -->
            <button class="submit-btn" :disabled="!canSubmit || isLoading" @click="handleSubmit">
                {{ isLoading ? $lang('提交中') : $lang('确认设置') }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { navigateTo } from '#imports'
import { setPayPassword } from '~/api/member'
definePageMeta({ layout: 'second-page' })
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const password = ref(['', '', '', '', '', ''])
const confirmPassword = ref(['', '', '', '', '', ''])
const isLoading = ref(false)

let passwordInputs = []
let confirmInputs = []

const setPasswordRef = (el, index) => {
    if (el) passwordInputs[index] = el
}

const setConfirmRef = (el, index) => {
    if (el) confirmInputs[index] = el
}

const passwordStr = computed(() => password.value.join(''))
const confirmStr = computed(() => confirmPassword.value.join(''))

const canSubmit = computed(() => {
    return passwordStr.value.length === 6 && confirmStr.value.length === 6
})

const onPasswordInput = (index) => {
    const input = passwordInputs[index]
    const value = input.value.replace(/\D/g, '')
    input.value = value

    if (value) {
        password.value[index] = value
        if (index < 5) {
            passwordInputs[index + 1].focus()
        }
    }
}

const onPasswordKeydown = (event, index) => {
    if (event.key === 'Backspace') {
        if (!password.value[index] && index > 0) {
            passwordInputs[index - 1].focus()
        }
        password.value[index] = ''
    }
}

const onPasswordFocus = (index) => {
    for (let i = 0; i < index; i++) {
        if (!password.value[i]) {
            passwordInputs[i].focus()
            return
        }
    }
}

const onConfirmInput = (index) => {
    const input = confirmInputs[index]
    const value = input.value.replace(/\D/g, '')
    input.value = value

    if (value) {
        confirmPassword.value[index] = value
        if (index < 5) {
            confirmInputs[index + 1].focus()
        }
    }
}

const onConfirmKeydown = (event, index) => {
    if (event.key === 'Backspace') {
        if (!confirmPassword.value[index] && index > 0) {
            confirmInputs[index - 1].focus()
        }
        confirmPassword.value[index] = ''
    }
}

const onConfirmFocus = (index) => {
    for (let i = 0; i < index; i++) {
        if (!confirmPassword.value[i]) {
            confirmInputs[i].focus()
            return
        }
    }
}

const handleSubmit =  () => {
    if (passwordStr.value.length !== 6) {
        showToast($lang('请输入6位支付密码'))
        return
    }

    if (confirmStr.value.length !== 6) {
        showToast($lang('请输入确认密码'))
        return
    }

    if (passwordStr.value !== confirmStr.value) {
        showToast($lang('两次输入的密码不一致'))
        return
    }

    isLoading.value = true
    let params = {
        pay_password: passwordStr.value,
        confirm_password: confirmStr.value
    }
    setPayPassword(params).then(res => {
        isLoading.value = false
        if (res.success) {
            showToast($lang('支付密码设置成功'))
            setTimeout(() => {
                history.back()
            }, 1000)
        } else {
            showToast(res.message, fail)
        }
    }).catch(error => {
        isLoading.value = false
        showToast(error.message, fail)
    })
}

const handleCancel = () => {
    history.back()
}
</script>

<style scoped lang="scss">
.set-password-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding: rem(16);
}

.form-section {
    background: #fff;
    border-radius: $radius-lg;
    padding: rem(20) rem(16);
}

.form-title {
    font-size: rem(18);
    font-weight: 600;
    color: $color-text-primary;
    text-align: center;
    margin-bottom: rem(6);
}

.form-desc {
    font-size: rem(13);
    color: $color-text-muted;
    text-align: center;
    margin-bottom: rem(24);
}

.password-group {
    margin-bottom: rem(20);
}

.password-label {
    font-size: rem(13);
    font-weight: 500;
    color: $color-text-secondary;
    margin-bottom: rem(10);
}

.password-inputs {
    display: flex;
    gap: rem(8);
    justify-content: center;
}

.password-digit {
    width: rem(42);
    height: rem(48);
    border: 1px solid $color-border;
    border-radius: $radius-md;
    font-size: rem(18);
    font-weight: 600;
    text-align: center;
    color: $color-text-primary;
    background: $color-bg-page;
    transition: all 0.2s;

    &.active {
        border-color: $color-primary;
        background: #fff;
    }

    &:focus {
        border-color: $color-primary;
        box-shadow: 0 0 0 2px rgba($color-primary, 0.1);
    }
}

.submit-btn {
    width: 100%;
    padding: rem(14) 0;
    border-radius: $radius-md;
    font-size: rem(15);
    font-weight: 600;
    color: #fff;
    background: $color-primary;
    border: none;
    margin-top: rem(16);
    transition: opacity 0.2s;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.cancel-btn {
    width: 100%;
    padding: rem(14) 0;
    border-radius: $radius-md;
    font-size: rem(15);
    font-weight: 600;
    color: $color-text-secondary;
    background: $color-bg-page;
    border: 1px solid $color-border;
    margin-top: rem(10);
    cursor: pointer;
    transition: opacity 0.2s;

    &:active {
        opacity: 0.8;
    }
}
</style>
