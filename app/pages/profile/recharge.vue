<template>
    <div class="recharge-page">

        <!-- ① 当前余额 -->
        <div class="balance-card">
            <div class="balance-label">{{ $lang('当前余额') }}</div>
            <div class="balance-amount">
                <span class="balance-unit">R$</span>
                <span class="balance-value">{{ balance }}</span>
            </div>
        </div>

        <!-- ② 充值金额 -->
        <div class="section-card">
            <div class="section-title">{{ $lang('充值金额') }}</div>
            <div class="preset-grid">
                <template v-for="(item, index) in amountPresets" :key="index">
                    <button class="preset-btn"
                        :class="{ active: selectedAmount === parseFloat(item.amount) && !customActive }"
                        @click="selectPreset(parseFloat(item.amount))"
                        v-if="parseFloat(item.amount) >= parseFloat(minAmount) && parseFloat(item.amount) <= parseFloat(maxAmount)">
                        <span class="preset-unit">R$</span>{{ parseFloat(item.amount) }}
                    </button>
                </template>

            </div>
            <div class="input-wrap" :class="{ focused: inputFocused }">
                <span class="input-prefix">R$</span>
                <input v-model="customAmount" type="number" inputmode="decimal" class="amount-input"
                    :placeholder="$lang('输入其他金额')" @focus="onInputFocus" @blur="inputFocused = false" @input="onCustomInput" />
            </div>
        </div>

        <!-- ③ 充值方式 -->
        <div class="section-card">
            <div class="section-title">{{ $lang('充值方式') }}</div>
            <div class="channel-list">
                <button v-for="channel in channels" :key="channel.id" class="channel-item"
                    :class="{ active: selectedChannel === channel.id }" @click="handleSelectedChannel(channel)">
                    <div class="channel-info">
                        <div class="channel-name">{{ channel.channel }}</div>
                        <div class="channel-range" translate="">R${{ parseFloat(channel.min_amount) }}-R${{
                            parseFloat(channel.max_amount) }}</div>
                    </div>
                    <div class="channel-radio">
                        <div class="radio-inner" v-if="selectedChannel === channel.id" />
                    </div>
                </button>
            </div>
        </div>

        <!-- ④ 底部说明 -->
        <!-- <div class="notice-card">
            <div class="notice-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
            </div>
            <p class="notice-text">
                由于巴西金融系统频繁遭受网络攻击，巴西中央银行已展开调查。如果某笔交易触发风险警告，这属于正常的安全警报，您可以尝试其他官方渠道。如果您仍有疑问，请联系您的招聘经理寻求帮助。
            </p>
        </div> -->

        <!-- ⑤ 确认充值按钮 -->
        <div class="submit-wrap">
            <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">
                {{ $lang('确认充值') }}
            </button>
        </div>

        <van-popup v-model:show="showRechargeConfirm" @close="showRechargeConfirm = false"
            class="upgrade-success-modal">
            <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#10B981" stroke-width="2" />
                    <path d="M8 12l3 3 5-6" stroke="#10B981" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <div class="success-title">{{ $lang('请点击确认前往充值页面') }}</div>
            <div class="confirm-btn-wrap">
                <button class="confirm-btn" @click="confirmRecharge">{{ $lang('确认') }}</button>
            </div>
        </van-popup>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#imports'
import { getBalance, getCoinAddress, memberRecharge } from '~/api/member'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
definePageMeta({
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

onMounted(() => {
    handleGetBalance();
    handleGetCoinAddress();
})

// 获取当前余额（模拟）
const balance = ref(0)
const handleGetBalance = () => {
    getBalance({}).then(res => {
        if (res.success) {
            balance.value = res.data.amount
        } else {
            showMsg(res.message, 'fail')
        }

    }).catch(error => {
        showMsg(error.message, 'fail')
    })
}

//获取充值信息
const amountPresets = ref([])
const minAmount = ref(0)
const maxAmount = ref(0)
const handleGetCoinAddress = () => {
    showLoading($lang('加载中'))
    getCoinAddress({}).then(res => {
        hideLoading();
        if (res.success) {
            amountPresets.value = res.data.amount_configs
            channels.value = res.data.token_channels || []
            if (channels.value.length > 0) {
                selectedChannel.value = res.data.token_channels[0].id
                minAmount.value = res.data.token_channels[0].min_amount
                maxAmount.value = res.data.token_channels[0].max_amount
            }

        } else {
            showMsg(res.message, 'fail')
        }

    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')
    })
}

const handleSelectedChannel = (channel) => {
    selectedChannel.value = channel.id
    minAmount.value = channel.min_amount
    maxAmount.value = channel.max_amount
    customAmount.value = ''
}


// 选中状态
const selectedAmount = ref(null)
const customAmount = ref('')
const customActive = ref(false)
const inputFocused = ref(false)

// 充值通道
const channels = ref([])

const selectedChannel = ref(0)

// 选中快捷金额
const selectPreset = (amt) => {
    selectedAmount.value = amt
    customAmount.value = amt
    customActive.value = false
}

// 手动输入时取消快捷选中
const onInputFocus = () => {
    inputFocused.value = true
    customActive.value = true
    selectedAmount.value = null
}

const onCustomInput = () => {
    // 检查输入金额是否与预设金额匹配
    const matchedPreset = amountPresets.value.find(item => parseFloat(item.amount) === parseFloat(customAmount.value))
    if (matchedPreset) {
        selectedAmount.value = parseFloat(matchedPreset.amount)
        customActive.value = false
    } else {
        selectedAmount.value = null
    }
}

// 最终充值金额
const finalAmount = computed(() => {
    if (customActive.value && customAmount.value) return Number(customAmount.value)
    return selectedAmount.value
})

const canSubmit = computed(() => !!finalAmount.value && finalAmount.value >= parseFloat(minAmount.value) && finalAmount.value <= parseFloat(maxAmount.value))

const handleSubmit = async () => {
    if (!canSubmit.value) return
    showLoading($lang('加载中'))
    let params = {
        amount: finalAmount.value,
        token_channel_id: selectedChannel.value,
        home_url: window.location.origin
    }
    let res = await memberRecharge(params)
    hideLoading();
    if (res.success) {
        paymentUrl.value = res.data.paymentInfo
        showRechargeConfirm.value = true
    } else {
        showMsg(res.message, 'fail')
    }
}

const showRechargeConfirm = ref(false)
const paymentUrl = ref('')

const confirmRecharge = () => {
    window.open(paymentUrl.value, '_blank')
}
</script>

<style scoped lang="scss">
.recharge-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding-bottom: rem(100);
}

// ── 余额卡片 ─────────────────────────────────────────────────
.balance-card {
    margin: rem(12) rem(16);
    padding: rem(20) rem(20);
    background: $gradient-primary;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    text-align: center;
}

.balance-label {
    font-size: rem(12);
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: rem(6);
}

.balance-amount {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: rem(4);
}

.balance-unit {
    font-size: rem(18);
    font-weight: 600;
    color: #fff;
}

.balance-value {
    font-size: rem(32);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
}

// ── 通用 Section 卡片 ─────────────────────────────────────────
.section-card {
    margin: rem(12) rem(16) 0;
    background: #fff;
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
    padding: rem(16);
}

.section-title {
    font-size: rem(14);
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: rem(14);
}

// ── 快捷金额网格 ─────────────────────────────────────────────
.preset-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: rem(10);
    margin-bottom: rem(14);
}

.preset-btn {
    padding: rem(12) 0;
    border-radius: $radius-md;
    font-size: rem(15);
    font-weight: 600;
    background: $color-bg-page;
    color: $color-text-secondary;
    cursor: pointer;
    border: rem(1.5) solid $color-border;
    transition: $transition-fast;
    text-align: center;

    .preset-unit {
        font-size: rem(12);
        font-weight: 400;
        margin-right: rem(1);
    }

    &.active {
        background: $color-primary-bg;
        color: $color-primary;
        border-color: $color-primary;
        box-shadow: 0 0 0 rem(1) $color-primary;
    }

    &:active {
        opacity: 0.8;
    }
}

// ── 手动输入框 ───────────────────────────────────────────────
.input-wrap {
    display: flex;
    align-items: center;
    border: rem(1.5) solid $color-border;
    border-radius: $radius-md;
    padding: rem(12) rem(14);
    transition: border-color 0.2s;
    background: $color-bg-page;

    &.focused {
        border-color: $color-primary;
        background: #fff;

        input{
            border-color:  transparent !important;
        }
    }
}

.input-prefix {
    font-size: rem(18);
    font-weight: 600;
    color: $color-text-muted;
    margin-right: rem(6);
    line-height: 1;
}

.amount-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: rem(18);
    font-weight: 600;
    color: $color-text-primary;
    background: transparent;
    padding: 0 !important;

    &::placeholder {
        color: $color-text-placeholder;
        font-weight: 400;
        font-size: rem(14);
    }
    

    // 隐藏数字输入框箭头
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
}

.input-wrap:focus{
    border-color: transparent !important;
}

// ── 充值通道 ─────────────────────────────────────────────────
.channel-list {
    display: flex;
    flex-direction: column;
    gap: rem(10);
}

.channel-item {
    display: flex;
    align-items: center;
    gap: rem(12);
    padding: rem(14) rem(14);
    border-radius: $radius-md;
    border: rem(1.5) solid $color-border;
    cursor: pointer;
    transition: $transition-fast;
    text-align: left;

    &.active {
        border-color: $color-primary;
        background: $color-primary-bg;
    }

    &:active {
        opacity: 0.85;
    }
}

.channel-icon {
    width: rem(40);
    height: rem(40);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
        width: rem(20);
        height: rem(20);
    }
}

.channel-info {
    flex: 1;
    min-width: 0;
}

.channel-name {
    font-size: rem(14);
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: rem(3);
}

.channel-range {
    font-size: rem(12);
    color: $color-text-muted;
}

.channel-radio {
    width: rem(20);
    height: rem(20);
    border-radius: 50%;
    border: rem(2) solid $color-border;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s;

    .channel-item.active & {
        border-color: $color-primary;
    }
}

.radio-inner {
    width: rem(10);
    height: rem(10);
    border-radius: 50%;
    background: $color-primary;
}

// ── 充值说明 ─────────────────────────────────────────────────
.notice-card {
    margin: rem(12) rem(16) 0;
    background: #FFFBEB;
    border-radius: $radius-lg;
    padding: rem(14) rem(14);
    display: flex;
    gap: rem(10);
    align-items: flex-start;
    border: rem(1) solid #FDE68A;
}

.notice-icon {
    flex-shrink: 0;
    color: #D97706;
    margin-top: rem(1);

    svg {
        width: rem(16);
        height: rem(16);
    }
}

.notice-text {
    font-size: rem(12);
    color: #92400E;
    line-height: 1.7;
    margin: 0;
}

// ── 底部确认按钮 ─────────────────────────────────────────────
.submit-wrap {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: rem(375);
    padding: rem(12) rem(16) calc(rem(12) + env(safe-area-inset-bottom));
    background: #fff;
    box-shadow: 0 rem(-1) rem(8) rgba(0, 0, 0, 0.06);
}

.submit-btn {
    width: 100%;
    padding: rem(14) 0;
    border-radius: $radius-md;
    background: $gradient-primary;
    color: #fff;
    font-size: rem(16);
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    &:not(:disabled):active {
        opacity: 0.9;
    }
}

.upgrade-success-modal {
    background: #fff;
    border-radius: rem(20);
    padding: rem(40) rem(50);
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.3);
    border: 1px solid rgba(16, 185, 129, 0.3);
    width: rem(300);
    box-sizing: border-box;
}

.success-icon {
    width: rem(80);
    height: rem(80);
    margin: 0 auto rem(20);

    svg {
        width: 100%;
        height: 100%;
    }
}

.success-title {
    font-size: rem(20);
    font-weight: 600;
    color: #333;
    margin-bottom: rem(20);
}

.confirm-btn-wrap {
    display: flex;
    justify-content: center;
}

.confirm-btn {
    background: $color-primary;
    color: #fff;
    border: none;
    border-radius: rem(25);
    padding: rem(12) rem(40);
    font-size: rem(16);
    font-weight: 600;
    cursor: pointer;

    &:active {
        opacity: 0.9;
    }
}
</style>
