<template>
    <van-popup v-model:show="visible" position="center" class="redeem-popup">
        <div class="redeem-modal">
            <!-- 关闭按钮 -->
            <button class="redeem-close" @click="close" aria-label="close">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
            </button>

            <!-- 未兑换状态 -->
            <div v-if="!showSuccess" class="redeem-content">
                <div class="redeem-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                            d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
                            stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="redeem-title">{{ $lang('请输入兑换码领取现金奖励') }}</div>
                <div class="redeem-input-wrap">
                    <input v-model="redeemCode" type="text" class="redeem-input" :placeholder="$lang('请输入兑换码')" />
                </div>
                <button class="redeem-btn" :class="{ 'redeem-btn--loading': loading }" @click="handleRedeem"
                    :disabled="loading || !redeemCode.trim()">
                    <span v-if="loading" class="redeem-loading"></span>
                    <span v-else>{{ $lang('立即兑换') }}</span>
                </button>
                <button class="redeem-detail" @click="goToDetail">{{ $lang('查看详情') }}</button>
            </div>

            <!-- 兑换成功状态 -->
            <div v-else class="redeem-success">
                <div class="success-animate">
                    <div class="success-circle">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
                <div class="success-title">{{ $lang('兑换成功') }}</div>
                <div class="success-amount">
                    <span class="success-currency">R$</span>
                    <span class="success-value">{{ parseFloat(rewardAmount) }}</span>
                </div>
                <button class="success-btn" @click="close">{{ $lang('我知道了') }}</button>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, watch } from 'vue'
import { navigateTo } from '#imports'
import { exchange } from '~/api/red_envelope'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
const redeemCode = ref('')
const loading = ref(false)
const showSuccess = ref(false)
const rewardAmount = ref('0')

watch(() => props.modelValue, (val) => {
    visible.value = val
    if (!val) {
        setTimeout(() => {
            redeemCode.value = ''
            showSuccess.value = false
        }, 300)
    }
})

watch(visible, (val) => {
    emit('update:modelValue', val)
})

const close = () => {
    visible.value = false
}

const handleRedeem = () => {
    if (!redeemCode.value.trim() || loading.value) return

    loading.value = true
    exchange({ code: redeemCode.value }).then(res => {
        loading.value = false
        if (res.success) {
            showSuccess.value = true
            rewardAmount.value = res.data
        } else {
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        loading.value = false
        
        showMsg(error.message, 'fail')
    })
}

const goToDetail = () => {
    close()
    navigateTo('/profile/redeem')
}
</script>

<style scoped lang="scss">
.redeem-popup {
    border-radius: rem(16);
    width: rem(320);
}

.redeem-modal {
    position: relative;
    background: #fff;
    border-radius: rem(16);
    padding: rem(24);
    overflow: hidden;
}

.redeem-close {
    position: absolute;
    top: rem(12);
    right: rem(12);
    width: rem(32);
    height: rem(32);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #F3F4F6;
    color: #9CA3AF;
    cursor: pointer;
    border: none;

    svg {
        width: rem(16);
        height: rem(16);
    }

    &:active {
        background: #E5E7EB;
    }
}

.redeem-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.redeem-icon {
    width: rem(72);
    height: rem(72);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
    border-radius: 50%;
    margin-bottom: rem(16);
    box-shadow: 0 4px 16px rgba(217, 119, 6, 0.2);

    svg {
        width: rem(36);
        height: rem(36);
        color: #D97706;
    }
}

.redeem-title {
    font-size: rem(16);
    font-weight: 600;
    color: #1F2937;
    text-align: center;
    margin-bottom: rem(20);
    line-height: 1.4;
}

.redeem-input-wrap {
    width: 100%;
    margin-bottom: rem(16);
}

.redeem-input {
    width: 100%;
    height: rem(48);
    padding: 0 rem(16);
    border: 1.5px solid #E5E7EB;
    border-radius: rem(12);
    font-size: rem(15);
    color: #1F2937;
    background: #F9FAFB;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;

    &::placeholder {
        color: #9CA3AF;
    }

    &:focus {
        border-color: #D97706;
        box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
    }
}

.redeem-btn {
    width: 100%;
    height: rem(48);
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    color: #fff;
    border: none;
    border-radius: rem(12);
    font-size: rem(16);
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: rem(12);

    &:active:not(:disabled) {
        transform: scale(0.98);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &--loading {
        background: #D1D5DB;
        box-shadow: none;
    }
}

.redeem-loading {
    width: rem(20);
    height: rem(20);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.redeem-detail {
    background: none;
    border: none;
    font-size: rem(13);
    color: #9CA3AF;
    cursor: pointer;
    padding: rem(4);

    &:active {
        color: #6B7280;
    }
}

// 成功状态
.redeem-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: rem(16) 0;
}

.success-animate {
    margin-bottom: rem(16);
}

.success-circle {
    width: rem(80);
    height: rem(80);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    border-radius: 50%;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
    animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    svg {
        width: rem(40);
        height: rem(40);
        color: #fff;
        stroke-dasharray: 50;
        stroke-dashoffset: 50;
        animation: drawCheck 0.4s ease forwards 0.2s;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0);
    }

    to {
        transform: scale(1);
    }
}

@keyframes drawCheck {
    to {
        stroke-dashoffset: 0;
    }
}

.success-title {
    font-size: rem(20);
    font-weight: 700;
    color: #1F2937;
    margin-bottom: rem(12);
}

.success-amount {
    display: flex;
    align-items: baseline;
    margin-bottom: rem(24);
}

.success-currency {
    font-size: rem(18);
    font-weight: 600;
    color: #10B981;
    margin-right: rem(4);
}

.success-value {
    font-size: rem(36);
    font-weight: 800;
    color: #10B981;
    text-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.success-btn {
    width: 100%;
    height: rem(48);
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: #fff;
    border: none;
    border-radius: rem(12);
    font-size: rem(16);
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    transition: transform 0.15s;

    &:active {
        transform: scale(0.98);
    }
}
</style>
