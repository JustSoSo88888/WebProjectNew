<template>
    <div class="withdrawal-page">
        <!-- Balance Card -->
        <div class="balance-card">
            <div class="balance-label">可提现余额</div>
            <div class="balance-amount">
                <span class="currency">BRL</span>
                <span class="amount">{{ balance }}</span>
            </div>
        </div>

        <!-- Fee Info -->
        <div class="fee-info">
            <div class="fee-item">
                <span class="fee-label">提现手续费</span>
                <span class="fee-value">10%</span>
            </div>
            <div class="fee-item">
                <span class="fee-label">最低提现金额</span>
                <span class="fee-value">BRL {{ minAmount }}</span>
            </div>
        </div>

        <!-- Amount Selection -->
        <div class="amount-section">
            <div class="section-title">选择或输入提现金额</div>
            
            <!-- Amount Presets -->
            <div class="amount-presets">
                <button
                    v-for="preset in amountPresets"
                    :key="preset"
                    class="preset-btn"
                    :class="{ active: selectedAmount === preset }"
                    @click="selectAmount(preset)"
                >
                    BRL {{ preset }}
                </button>
            </div>

            <!-- Custom Amount Input -->
            <div class="custom-amount">
                <span class="prefix">BRL</span>
                <input
                    v-model="customAmount"
                    type="number"
                    class="amount-input"
                    placeholder="输入金额"
                    @input="onCustomInput"
                />
            </div>
        </div>

        <!-- Actual Amount -->
        <div class="actual-amount" v-if="actualAmount > 0">
            <span class="label">实际到账金额</span>
            <span class="value">BRL {{ actualAmount.toFixed(2) }}</span>
        </div>

        <!-- Password Input -->
        <div class="password-section">
            <div class="section-title">输入支付密码</div>
            <div class="password-input-wrapper">
                <input
                    v-model="password"
                    type="password"
                    maxlength="6"
                    class="password-input"
                    placeholder="请输入6位支付密码"
                    inputmode="numeric"
                    pattern="[0-9]*"
                />
            </div>
        </div>

        <!-- Submit Button -->
        <button 
            class="submit-btn" 
            :disabled="!canSubmit"
            @click="handleSubmit"
        >
            确认提现
        </button>

        <!-- Bottom Description -->
        <div class="description">
            <p>根据巴西税法规定，员工每次提款都需要缴纳10%的税款，该税款由巴西政府征收。</p>
            <p>当您申请提款时，SP财务部门会将您的银行信息发送给与SP合作的银行，该银行将为您进行转账。请您核对您的银行账户信息是否正确。</p>
            <p>银行将在0至72小时内完成转账，请您耐心等待。</p>
        </div>

        <!-- Set Password Modal -->
        <van-popup 
            v-model:show="showSetPasswordModal" 
            position="center" 
            round
            class="center-popup"
        >
            <div class="modal-content">
                <div class="modal-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                        <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.3"/>
                        <path d="M12 12v2M10 14h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="modal-title">请先设置支付密码</div>
                <div class="modal-desc">为了保障您的资金安全，提现前需要先设置支付密码</div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn--cancel" @click="onCancelSetPassword">取消</button>
                    <button class="modal-btn modal-btn--confirm" @click="goToSetPassword">去设置</button>
                </div>
            </div>
        </van-popup>

        <!-- Success Modal -->
        <van-popup 
            v-model:show="showSuccessModal" 
            position="center" 
            round
            class="center-popup"
        >
            <div class="modal-content">
                <div class="modal-icon success-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
                        <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="modal-title">提现申请已提交</div>
                <div class="modal-desc">您的提现申请已提交，请耐心等待银行处理</div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn--confirm" @click="showSuccessModal = false">确定</button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { navigateTo } from '#imports'

definePageMeta({ layout: 'second-page' })

const balance = ref('2,580.00')
const minAmount = ref(50)
const feeRate = 0.1

const amountPresets = [100, 200, 500, 1000]
const selectedAmount = ref(0)
const customAmount = ref('')

const password = ref('')
const hasSetPassword = ref(true)

const showSetPasswordModal = ref(true)
const showSuccessModal = ref(false)

const actualAmount = computed(() => {
    const amount = selectedAmount.value || parseFloat(customAmount.value) || 0
    return amount * (1 - feeRate)
})

const canSubmit = computed(() => {
    const amount = selectedAmount.value || parseFloat(customAmount.value) || 0
    return amount >= minAmount.value && password.value.length === 6
})

const selectAmount = (amount) => {
    selectedAmount.value = amount
    customAmount.value = ''
}

const onCustomInput = () => {
    selectedAmount.value = 0
}

const handleSubmit = () => {
    if (!hasSetPassword.value) {
        showSetPasswordModal.value = true
        return
    }

    const amount = selectedAmount.value || parseFloat(customAmount.value)
    if (amount < minAmount.value) {
        showToast(`最低提现金额为 BRL ${minAmount.value}`)
        return
    }

    if (password.value.length !== 6) {
        showToast('请输入6位支付密码')
        return
    }

    showSuccessModal.value = true
}

const goToSetPassword = () => {
    showSetPasswordModal.value = false
    navigateTo('/withdrawal/setPassword')
}

const onCancelSetPassword = () => {
    showSetPasswordModal.value = false
    window.history.back()
}
</script>

<style scoped lang="scss">
.withdrawal-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding: rem(16);
}

.balance-card {
    background: linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%);
    border-radius: $radius-xl;
    padding: rem(20);
    margin-bottom: rem(12);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.balance-label {
    font-size: rem(12);
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: rem(4);
}

.balance-amount {
    display: flex;
    align-items: baseline;
    gap: rem(4);
}

.currency {
    font-size: rem(14);
    color: rgba(255, 255, 255, 0.9);
}

.amount {
    font-size: rem(32);
    font-weight: 800;
    color: #fff;
}

.fee-info {
    display: flex;
    gap: rem(12);
    margin-bottom: rem(16);
}

.fee-item {
    flex: 1;
    background: #fff;
    border-radius: $radius-md;
    padding: rem(12);
    display: flex;
    flex-direction: column;
    gap: rem(4);
}

.fee-label {
    font-size: rem(11);
    color: $color-text-muted;
}

.fee-value {
    font-size: rem(14);
    font-weight: 600;
    color: $color-text-primary;
}

.amount-section {
    background: #fff;
    border-radius: $radius-lg;
    padding: rem(16);
    margin-bottom: rem(12);
}

.section-title {
    font-size: rem(13);
    font-weight: 500;
    color: $color-text-secondary;
    margin-bottom: rem(12);
}

.amount-presets {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: rem(8);
    margin-bottom: rem(12);
}

.preset-btn {
    padding: rem(10) 0;
    border-radius: $radius-md;
    font-size: rem(13);
    font-weight: 500;
    color: $color-text-secondary;
    background: $color-bg-page;
    border: 1px solid $color-border;
    transition: all 0.2s;

    &.active {
        background: $color-primary;
        color: #fff;
        border-color: $color-primary;
    }
}

.custom-amount {
    display: flex;
    align-items: center;
    background: $color-bg-page;
    border-radius: $radius-md;
    padding: rem(12);
    border: 1px solid $color-border;
}

.prefix {
    font-size: rem(14);
    color: $color-text-secondary;
    margin-right: rem(8);
}

.amount-input {
    flex: 1;
    font-size: rem(16);
    font-weight: 600;
    color: $color-text-primary;
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
        color: $color-text-muted;
        font-weight: 400;
    }
}

.actual-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-radius: $radius-lg;
    padding: rem(14) rem(16);
    margin-bottom: rem(12);

    .label {
        font-size: rem(13);
        color: $color-text-secondary;
    }

    .value {
        font-size: rem(16);
        font-weight: 700;
        color: $color-success;
    }
}

.password-section {
    background: #fff;
    border-radius: $radius-lg;
    padding: rem(16);
    margin-bottom: rem(16);
}

.password-input-wrapper {
    display: flex;
    align-items: center;
    background: $color-bg-page;
    border-radius: $radius-md;
    padding: rem(12);
    border: 1px solid $color-border;
}

.password-input {
    width: 100%;
    font-size: rem(16);
    color: $color-text-primary;
    background: transparent;
    border: none;
    outline: none;
    letter-spacing: rem(4);
    text-align: center;

    &::placeholder {
        color: $color-text-muted;
        letter-spacing: 0;
        font-size: rem(13);
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
    margin-bottom: rem(20);
    transition: opacity 0.2s;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.description {
    background: $color-gray-50;
    border-radius: $radius-md;
    padding: rem(14);
    
    p {
        font-size: rem(11);
        color: $color-text-muted;
        line-height: 1.6;
        margin-bottom: rem(8);

        &:last-child {
            margin-bottom: 0;
        }
    }
}

.center-popup {
    width: 80%;
    max-width: rem(300);
    background: transparent;
}

.modal-content {
    background: #fff;
    border-radius: $radius-xl;
    padding: rem(24);
    text-align: center;
}

.modal-icon {
    width: rem(56);
    height: rem(56);
    border-radius: 50%;
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto rem(16);
    color: #2563EB;

    svg {
        width: rem(28);
        height: rem(28);
    }

    &.success-icon {
        background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
        color: #059669;
    }
}

.modal-title {
    font-size: rem(16);
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: rem(8);
}

.modal-desc {
    font-size: rem(13);
    color: $color-text-secondary;
    line-height: 1.5;
    margin-bottom: rem(20);
}

.modal-actions {
    display: flex;
    gap: rem(10);
}

.modal-btn {
    flex: 1;
    padding: rem(12) 0;
    border-radius: $radius-md;
    font-size: rem(14);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &--cancel {
        background: $color-bg-page;
        color: $color-text-secondary;
        border: 1px solid $color-border;
    }

    &--confirm {
        background: $color-primary;
        color: #fff;
        border: none;
    }
}
</style>
