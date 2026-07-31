<template>
    <div class="recharge-page">

        <!-- ① 当前余额 -->
        <div class="balance-card">
            <div>
                <div class="balance-label">{{ $lang('当前余额') }}</div>
                <div class="balance-amount" translate="no">
                    <span class="balance-unit">Rs</span>
                    <span class="balance-value">{{ formatMoney(balance) }}</span>
                </div>
            </div>
            <div class="balance-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor"
                        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
        </div>

        <!-- ② 支付方式 -->
        <section class="recharge-section">
            <div class="section-title">{{ $lang('支付方式') }}</div>
            <div class="recharge-method-grid">
                <button v-for="method in fixedPaymentMethods" :key="method.key" type="button"
                    class="recharge-method-card" :class="{ active: selectedPaymentKey === method.key }"
                    @click="handleSelectedPayment(method)">
                    <span class="channel-logo">
                        <img v-if="fixedLogo(method)" :src="fixedLogo(method)" :alt="method.label">
                        <span v-else>{{ method.shortName }}</span>
                    </span>
                    <span class="method-name">{{ method.label }}</span>
                    <span v-if="method.badge" class="reco-badge">{{ method.badge }}</span>
                </button>
            </div>
        </section>

        <!-- ③ 充值渠道 -->
        <section class="recharge-section">
            <div class="section-title">{{ $lang('充值渠道') }}</div>
            <div class="deposit-channel-grid">
                <button v-for="channel in activeDepositChannels" :key="channel.key" type="button"
                    class="deposit-channel-card" :class="{ active: selectedDepositKey === channel.key }"
                    @click="handleSelectedDeposit(channel)">
                    <span class="method-name">{{ channel.label }}</span>
                    <span v-if="channel.badge" class="reco-badge">{{ channel.badge }}</span>
                </button>
            </div>
        </section>

        <!-- ④ 充值金额 -->
        <section class="amount-panel">
            <div class="preset-grid">
                <button v-for="item in visibleAmountPresets" :key="item.amount" type="button" class="preset-btn"
                    :class="{ active: selectedAmount === safeNumber(item.amount) && !customActive }"
                    @click="selectPreset(safeNumber(item.amount))">
                    <span class="preset-amount" translate="no">{{ formatMoney(item.amount) }}</span>
                    <!-- <span v-if="presetBonus(item)" class="preset-bonus" translate="no">+{{ formatMoney(presetBonus(item)) }}{{ $lang('赠送') }}</span> -->
                </button>
            </div>

            <label class="input-wrap" :class="{ focused: inputFocused }">
                <span class="input-prefix">Rs</span>
                <input v-model="customAmount" type="number" inputmode="decimal" class="amount-input"
                    :placeholder="amountRangePlaceholder" @focus="onInputFocus" @blur="inputFocused = false"
                    @input="onCustomInput" />
            </label>
        </section>

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
                {{ $lang('立即充值') }}
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
            <div class="success-title">{{ $lang('请点击确认前往支付页面') }}</div>
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
const $dialog = nuxtApp.$dialog
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
const fixedAmountPresets = [
    { amount: 100, bonus: 0 },
    { amount: 200, bonus: 7 },
    { amount: 500, bonus: 37 },
    { amount: 1000, bonus: 77 },
    { amount: 2000, bonus: 77 },
    { amount: 3000, bonus: 117 },
    { amount: 5000, bonus: 217 },
    { amount: 10000, bonus: 377 },
    { amount: 50000, bonus: 1777 },
]
const fixedPaymentMethods = [
    { key: 'jazzcash', label: 'JazzCash', shortName: 'JC', logo: '/brand/JazzCash.jpg', matchNames: ['jazzcash'], badge: 'RECO' },
    { key: 'easypaisa', label: 'Easypaisa', shortName: 'EP', logo: '/brand/Easypaisa.jpg', matchNames: ['easypaisa'], badge: 'RECO' },
]
const fixedDepositChannels = [
    { key: 'hot-u2', label: 'Hot U2', matchNames: ['hotu2', 'u2'], badge: 'RECO' },
    { key: 'hot-wd', label: 'Hot WD', matchNames: ['hotwd', 'wd'], badge: 'RECO' },
    { key: 'hot-kb', label: 'Hot KB', matchNames: ['hotkb', 'kb'], badge: 'RECO' },
]
const fixedDepositChannelsByPayment = {
    jazzcash: fixedDepositChannels,
    easypaisa: fixedDepositChannels.slice(0, 1),
}
const fixedRechargeMinAmount = 100
const fixedRechargeMaxAmount = 50000
const minAmount = ref(0)
const maxAmount = ref(0)
const handleGetCoinAddress = () => {
    showLoading($lang('加载中'))
    getCoinAddress({}).then(res => {
        hideLoading();
        if (res.success) {
            channels.value = res.data.token_channels || []
            syncSelectedChannel()

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

const normalizeChannelName = (value) => {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

const matchesFixedItem = (channel, fixedItem) => {
    if (!channel || !fixedItem) return false
    const matchNames = fixedItem.matchNames.map(normalizeChannelName)
    const channelName = normalizeChannelName(channel.channel)
    return matchNames.some(name => channelName.includes(name))
}

const resolveFixedChannel = (fixedDeposit, fixedPayment = fixedPaymentMethods.find(item => item.key === selectedPaymentKey.value)) => {
    return channels.value.find(channel => matchesFixedItem(channel, fixedPayment) && matchesFixedItem(channel, fixedDeposit))
        || channels.value.find(channel => matchesFixedItem(channel, fixedDeposit))
        || channels.value.find(channel => matchesFixedItem(channel, fixedPayment))
}

const syncSelectedChannel = () => {
    const selectedPayment = fixedPaymentMethods.find(item => item.key === selectedPaymentKey.value)
    const selectedDeposit = activeDepositChannels.value.find(item => item.key === selectedDepositKey.value) || activeDepositChannels.value[0]
    if (selectedDeposit && selectedDeposit.key !== selectedDepositKey.value) {
        selectedDepositKey.value = selectedDeposit.key
    }
    const matchedChannel = resolveFixedChannel(selectedDeposit, selectedPayment) || channels.value[0]
    if (matchedChannel) {
        handleSelectedChannel(matchedChannel)
    }
}

const handleSelectedPayment = (method) => {
    selectedPaymentKey.value = method.key
    const firstDeposit = activeDepositChannels.value[0]
    if (firstDeposit) {
        selectedDepositKey.value = firstDeposit.key
    }
    syncSelectedChannel()
}

const handleSelectedDeposit = (channel) => {
    selectedDepositKey.value = channel.key
    syncSelectedChannel()
}

const safeNumber = (value) => {
    const number = Number.parseFloat(value)
    return Number.isFinite(number) ? number : 0
}

const formatMoney = (value) => {
    return safeNumber(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const amountRangePlaceholder = computed(() => {
    return `${formatMoney(fixedRechargeMinAmount)} - ${formatMoney(fixedRechargeMaxAmount)}`
})

const visibleAmountPresets = computed(() => {
    return fixedAmountPresets
})

const activeDepositChannels = computed(() => {
    return fixedDepositChannelsByPayment[selectedPaymentKey.value] || fixedDepositChannels
})

const presetBonus = (item) => {
    return safeNumber(item.bonus || item.bonus_amount || item.award_amount || item.gift_amount || item.give_amount)
}

const channelLogo = (channel) => {
    return channel.logo || channel.logo_url || channel.image || channel.image_url || channel.icon || ''
}

const fixedLogo = (fixedItem) => {
    const channel = resolveFixedChannel(fixedItem)
    return fixedItem.logo || (channel ? channelLogo(channel) : '')
}


// 选中状态
const selectedAmount = ref(null)
const customAmount = ref('')
const customActive = ref(false)
const inputFocused = ref(false)

// 充值通道
const channels = ref([])

const selectedChannel = ref(0)
const selectedPaymentKey = ref('jazzcash')
const selectedDepositKey = ref('hot-u2')

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
    const matchedPreset = fixedAmountPresets.find(item => safeNumber(item.amount) === safeNumber(customAmount.value))
    if (matchedPreset) {
        selectedAmount.value = safeNumber(matchedPreset.amount)
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

const canSubmit = computed(() => !!finalAmount.value && finalAmount.value >= fixedRechargeMinAmount && finalAmount.value <= fixedRechargeMaxAmount)

const handleSubmit = async () => {
    $dialog.confirm({
            title: $lang('提示'),
            message: $lang('请联系客服进行充值。'),
            confirmText: $lang('确认'),
            cancelText: $lang('取消')
        }).then(() => {
            navigateTo('/chat')
        }).catch(() => {
        })
    // if (!canSubmit.value) return
    // showLoading($lang('加载中'))
    // let params = {
    //     amount: finalAmount.value,
    //     token_channel_id: selectedChannel.value,
    //     home_url: window.location.origin
    // }
    // let res = await memberRecharge(params)
    // hideLoading();
    // if (res.success) {
    //     paymentUrl.value = res.data.paymentInfo
    //     showRechargeConfirm.value = true
    // } else {
    //     showMsg(res.message, 'fail')
    // }
}

const showRechargeConfirm = ref(false)
const paymentUrl = ref('')

const confirmRecharge = () => {
    window.open(paymentUrl.value, '_blank')
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/config' as *;

.recharge-page {
    min-height: 100vh;
    background: #F5F6F8;
    padding: rem(12) rem(16) rem(98);
}

.balance-card {
    min-height: rem(88);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: rem(14);
    padding: rem(16);
    border: 1px solid rgba(206, 0, 0, 0.12);
    border-radius: rem(8);
    background: $color-white;
    box-shadow: 0 rem(8) rem(18) rgba(31, 31, 31, 0.04);
}

.balance-label {
    color: $color-text-muted;
    font-size: rem(12);
    line-height: 1;
    font-weight: 750;
}

.balance-amount {
    display: flex;
    align-items: baseline;
    gap: rem(5);
    margin-top: rem(9);
}

.balance-unit {
    color: $color-primary;
    font-size: rem(13);
    line-height: 1;
    font-weight: 850;
}

.balance-value {
    color: $color-text-primary;
    font-size: rem(28);
    line-height: 1.05;
    font-weight: 900;
}

.balance-mark {
    width: rem(42);
    height: rem(42);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: rem(8);
    background: $color-primary-bg;
    color: $color-primary;
    flex-shrink: 0;

    svg {
        width: rem(22);
        height: rem(22);
    }
}

.recharge-section {
    margin-top: rem(16);
}

.section-title {
    margin-bottom: rem(10);
    color: $color-text-primary;
    font-size: rem(14);
    line-height: 1.2;
    font-weight: 900;
}

.recharge-method-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: rem(8);
}

.recharge-method-card,
.deposit-channel-card {
    appearance: none;
    position: relative;
    min-width: 0;
    min-height: rem(68);
    display: flex;
    align-items: center;
    gap: rem(10);
    padding: rem(12);
    border: 1px solid $color-border-light;
    border-radius: rem(8);
    background: $color-white;
    color: $color-text-primary;
    text-align: left;
    font: inherit;
    cursor: pointer;
    transition: transform 0.16s ease, border-color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;

    &.active {
        border-color: $color-primary;
        background: $color-primary-bg;
        box-shadow: 0 0 0 rem(1) rgba(206, 0, 0, 0.08);
    }

    &:active {
        transform: scale(0.98);
    }

    &:focus-visible {
        outline: rem(2) solid rgba(206, 0, 0, 0.28);
        outline-offset: rem(2);
    }
}

.channel-logo {
    width: rem(40);
    height: rem(40);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: rem(6);
    background: #F3F4F6;
    color: $color-primary;
    font-size: rem(16);
    font-weight: 900;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: rem(4);
        box-sizing: border-box;
        background: $color-white;
    }
}

.method-name {
    min-width: 0;
    color: $color-text-primary;
    font-size: rem(13);
    line-height: 1.2;
    font-weight: 850;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.reco-badge {
    position: absolute;
    top: 0;
    right: 0;
    min-width: rem(40);
    height: rem(18);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 rem(6);
    border-radius: 0 rem(7) 0 rem(7);
    background: $color-primary;
    color: $color-white;
    font-size: rem(9);
    line-height: 1;
    font-weight: 900;
}

.deposit-channel-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: rem(8);
}

.deposit-channel-card {
    min-height: rem(50);
    padding-right: rem(44);

    .method-name {
        white-space: normal;
    }
}

.amount-panel {
    margin-top: rem(16);
    padding: rem(12);
    border: 1px solid rgba(206, 0, 0, 0.14);
    border-radius: rem(8);
    background: $color-white;
}

.preset-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: rem(8);
}

.preset-btn {
    appearance: none;
    min-width: 0;
    min-height: rem(60);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: rem(3);
    padding: rem(8) rem(4);
    border: 1px solid $color-border-light;
    border-radius: rem(8);
    background: #FAFAFA;
    color: $color-text-primary;
    font: inherit;
    cursor: pointer;
    transition: transform 0.16s ease, border-color 0.16s ease, background 0.16s ease;

    &.active {
        border-color: $color-primary;
        background: $color-primary-bg;
    }

    &:active {
        transform: scale(0.98);
    }

    &:focus-visible {
        outline: rem(2) solid rgba(206, 0, 0, 0.28);
        outline-offset: rem(2);
    }
}

.preset-amount {
    max-width: 100%;
    color: $color-text-primary;
    font-size: rem(14);
    line-height: 1.05;
    font-weight: 900;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.preset-bonus {
    max-width: 100%;
    color: $color-primary;
    font-size: rem(10);
    line-height: 1.1;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.input-wrap {
    min-height: rem(58);
    display: flex;
    align-items: center;
    gap: rem(7);
    margin-top: rem(12);
    padding: 0 rem(14);
    border: 1px solid $color-border;
    border-radius: rem(8);
    background: $color-white;
    transition: border-color 0.16s ease, box-shadow 0.16s ease;

    &.focused {
        border-color: $color-primary;
        box-shadow: 0 0 0 rem(3) rgba(206, 0, 0, 0.08);
    }
}

.input-prefix {
    color: $color-primary;
    font-size: rem(15);
    line-height: 1;
    font-weight: 900;
}

.amount-input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    color: $color-text-primary;
    font-size: rem(16);
    font-weight: 800;
    padding: 0 !important;

    &::placeholder {
        color: #8FA0BD;
        font-weight: 800;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
}

.submit-wrap {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: rem(375);
    padding: rem(12) rem(16) calc(rem(12) + env(safe-area-inset-bottom, 0px));
    background: rgba(255, 255, 255, 0.96);
    border-top: 1px solid $color-border-light;
    box-shadow: 0 rem(-8) rem(24) rgba(31, 31, 31, 0.08);
    box-sizing: border-box;
}

.submit-btn {
    width: 100%;
    min-height: rem(50);
    border-radius: rem(8);
    background: $color-primary;
    color: $color-white;
    font-size: rem(16);
    font-weight: 900;
    cursor: pointer;
    transition: transform 0.16s ease, opacity 0.16s ease, background 0.16s ease;

    &:disabled {
        opacity: 0.42;
        cursor: not-allowed;
        background: #A3A3A3;
    }

    &:not(:disabled):active {
        transform: scale(0.99);
    }
}

.upgrade-success-modal {
    width: rem(300);
    padding: rem(34) rem(26);
    border-radius: rem(12);
    background: $color-white;
    text-align: center;
    box-shadow: 0 rem(20) rem(50) rgba(0, 0, 0, 0.22);
    box-sizing: border-box;
}

.success-icon {
    width: rem(66);
    height: rem(66);
    margin: 0 auto rem(18);

    svg {
        width: 100%;
        height: 100%;
    }
}

.success-title {
    margin-bottom: rem(20);
    color: $color-text-primary;
    font-size: rem(18);
    line-height: 1.35;
    font-weight: 850;
}

.confirm-btn-wrap {
    display: flex;
    justify-content: center;
}

.confirm-btn {
    min-width: rem(132);
    min-height: rem(44);
    border-radius: rem(8);
    background: $color-primary;
    color: $color-white;
    font-size: rem(15);
    font-weight: 850;
    cursor: pointer;

    &:active {
        opacity: 0.9;
    }
}

@media (max-width: 374px) {
    .recharge-page {
        padding-inline: rem(12);
    }

    .preset-amount {
        font-size: rem(16);
    }

    .method-name {
        font-size: rem(12);
    }
}
</style>
