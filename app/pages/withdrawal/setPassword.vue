<template>
    <div class="set-password-page">
        <div class="form-section">
            <div class="form-title">设置支付密码</div>
            <div class="form-desc">请设置6位数字支付密码，用于提现验证</div>

            <!-- Password Input -->
            <div class="password-group">
                <div class="password-label">支付密码</div>
                <div class="password-inputs">
                    <input
                        v-for="(_, index) in 6"
                        :key="index"
                        :ref="el => setPasswordRef(el, index)"
                        type="tel"
                        maxlength="1"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        class="password-digit"
                        :class="{ active: password[index], filled: password[index] }"
                        @input="onPasswordInput(index)"
                        @keydown="onPasswordKeydown($event, index)"
                        @focus="onPasswordFocus(index)"
                    />
                </div>
            </div>

            <!-- Confirm Password -->
            <div class="password-group">
                <div class="password-label">确认密码</div>
                <div class="password-inputs">
                    <input
                        v-for="(_, index) in 6"
                        :key="'confirm-' + index"
                        :ref="el => setConfirmRef(el, index)"
                        type="tel"
                        maxlength="1"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        class="password-digit"
                        :class="{ active: confirmPassword[index], filled: confirmPassword[index] }"
                        @input="onConfirmInput(index)"
                        @keydown="onConfirmKeydown($event, index)"
                        @focus="onConfirmFocus(index)"
                    />
                </div>
            </div>

            <!-- Submit Button -->
            <button 
                class="submit-btn" 
                :disabled="!canSubmit || isLoading"
                @click="handleSubmit"
            >
                {{ isLoading ? '提交中...' : '确认设置' }}
            </button>

            <!-- Cancel Button -->
            <button 
                class="cancel-btn" 
                @click="handleCancel"
            >
                取消
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { navigateTo } from '#imports'

definePageMeta({ layout: 'second-page' })

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

const handleSubmit = async () => {
    if (passwordStr.value.length !== 6) {
        showToast('请输入6位支付密码')
        return
    }

    if (confirmStr.value.length !== 6) {
        showToast('请确认支付密码')
        return
    }

    if (passwordStr.value !== confirmStr.value) {
        showToast('两次输入的密码不一致')
        return
    }

    isLoading.value = true

    try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        showToast('支付密码设置成功')
        
        setTimeout(() => {
            navigateTo(-1)
        }, 1000)
    } catch (error) {
        showToast('设置失败，请重试')
    } finally {
        isLoading.value = false
    }
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
