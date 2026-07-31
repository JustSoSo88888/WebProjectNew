<template>
    <div class="withdrawal-page">
        <template v-if="!showAddAccount">
            <section class="summary-panel">
                <div class="summary-card">
                    <span class="summary-label">{{ $lang('账户余额') }}</span>
                    <strong class="summary-value" translate="no">Rs {{ formatMoney(availableBalance) }}</strong>
                </div>
            </section>

            <section class="withdraw-section">
                <div class="section-title">{{ $lang('提现方式') }}</div>
                <div class="method-grid">
                    <button v-for="method in fixedWithdrawMethods" :key="method.key" type="button" class="method-card"
                        :class="{ active: selectedWithdrawKey === method.key }" @click="selectWithdrawMethod(method)">
                        <span class="method-icon">
                            <img v-if="method.logo" :src="method.logo" :alt="method.label">
                            <span v-else>{{ method.shortName }}</span>
                        </span>
                        <span class="method-name">{{ method.label }}</span>
                    </button>
                </div>
            </section>

            <section class="amount-panel">
                <div class="amount-heading">
                    <span>{{ $lang('提现金额') }}</span>
                    <span class="amount-range" translate="no">Rs {{ formatMoney(fixedWithdrawMinAmount) }} - {{
                        formatMoney(fixedWithdrawMaxAmount) }}</span>
                </div>
                <div class="amount-presets">
                    <button v-for="amount in fixedWithdrawAmountValues" :key="amount" type="button" class="preset-btn"
                        :class="{ active: selectedAmount === amount && !customActive }" @click="selectAmount(amount)">
                        <span translate="no">{{ formatMoney(amount) }}</span>
                    </button>
                </div>
                <label class="amount-input-wrap">
                    <span class="input-prefix">Rs</span>
                    <input v-model="customAmount" type="number" inputmode="decimal" class="amount-input"
                        :placeholder="amountRangePlaceholder" @input="onCustomInput">
                    <button type="button" class="max-btn" @click="selectMaxAmount">{{ $lang('最大') }}</button>
                </label>
            </section>

            <section class="account-section">
                <div class="account-heading">
                    <div>
                        <div class="section-title">{{ $lang('提现账户') }}</div>
                        <div class="account-subtitle">{{ $lang('我的账户') }}</div>
                    </div>
                    <button type="button" class="text-action" @click="openAddAccount(selectedMethod)">
                        {{ selectedWithdrawalAccount ? $lang('更改') : $lang('添加账户') }}
                    </button>
                </div>

                <button v-if="selectedWithdrawalAccount" type="button" class="saved-account-card"
                    @click="openAddAccount(selectedMethod)">
                    <span class="saved-account-icon">{{ selectedMethod.shortName }}</span>
                    <span class="saved-account-info">
                        <strong>{{ selectedWithdrawalAccount.name }}</strong>
                        <small translate="no">{{ selectedWithdrawalAccountLabel }}</small>
                    </span>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>

                <div v-else class="empty-account-card">
                    <div class="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor"
                                stroke-width="1.8" />
                            <path d="M7 10h6M7 14h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </div>
                    <p>{{ $lang('请添加用于提现的账户') }}</p>
                    <button type="button" class="add-account-btn" @click="openAddAccount(selectedMethod)">
                        <span>+</span>{{ $lang('添加账户') }}
                    </button>
                </div>
            </section>

            <!-- <div v-if="hasPendingWithdrawal" class="pending-notice">
                <strong>{{ $lang('提现中') }}</strong>
                <span>{{ $lang('您已有提现订单处理中') }}</span>
            </div> -->

            <div class="submit-wrap">
                <button class="submit-btn" :disabled="hasPendingWithdrawal || !canSubmitAmount" @click="handleSubmit">
                    {{ hasPendingWithdrawal ? $lang('提现中') : $lang('立即提现') }}
                </button>
            </div>
        </template>

        <template v-else>
            <section class="add-account-view">
                <div class="add-header">
                    <button type="button" class="back-btn" @click="showAddAccount = false" aria-label="Back">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                    <strong>{{ $lang('添加账户') }}</strong>
                </div>

                <div class="method-tabs">
                    <button v-for="method in fixedWithdrawMethods" :key="method.key" type="button" class="method-tab"
                        :class="{ active: accountFormMethodKey === method.key }" @click="switchAccountFormMethod(method)">
                        {{ method.label }}
                    </button>
                </div>

                <div class="tips-card">
                    <p>{{ $lang('请确保提现地址信息与本人信息一致') }}</p>
                    <p>{{ $lang('信息保存后将用于后续提现') }}</p>
                </div>

                <div class="form-card">
                    <label class="form-field">
                        <span>{{ $lang('姓名') }}</span>
                        <input v-model.trim="accountForm.name" type="text" :placeholder="$lang('请输入姓名')">
                    </label>

                    <label v-if="accountFormMethodKey !== 'bank'" class="form-field">
                        <span>{{ currentFormMethod.label }} {{ $lang('账户') }}</span>
                        <div class="phone-input">
                            <b translate="no">+92</b>
                            <input v-model.trim="accountForm.walletAccount" type="tel" inputmode="numeric"
                                :placeholder="$lang('请输入钱包账户')">
                        </div>
                    </label>

                    <label v-if="accountFormMethodKey === 'bank'" class="form-field">
                        <span>{{ $lang('银行名称') }}</span>
                        <input v-model.trim="accountForm.bankName" type="text" :placeholder="$lang('请输入银行名称')">
                    </label>

                    <label v-if="accountFormMethodKey === 'bank'" class="form-field">
                        <span>{{ $lang('银行账户') }}</span>
                        <input v-model.trim="accountForm.bankAccount" type="text" inputmode="numeric"
                            :placeholder="$lang('请输入银行账户')">
                    </label>

                    <label class="form-field">
                        <span>CNIC</span>
                        <input v-model.trim="accountForm.cnic" type="text" inputmode="numeric"
                            :placeholder="$lang('请输入CNIC')">
                    </label>
                </div>

                <button class="submit-btn" type="button" @click="saveWithdrawalAccount">
                    {{ $lang('添加账户') }}
                </button>
            </section>
        </template>

        <van-popup v-model:show="showSuccessModal" position="center" round class="center-popup">
            <div class="modal-content">
                <div class="modal-icon success-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
                        <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="modal-title">{{ $lang('提现申请已提交') }}</div>
                <div class="modal-desc">{{ $lang('您的提现申请已提交，请耐心等待') }}</div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn--confirm" @click="showSuccessModal = false">
                        {{ $lang('确认') }}
                    </button>
                </div>
            </div>
        </van-popup>

        <PaymentPasswordPopup v-model:show="showPaymentPopup" @cancel="showPaymentPopup = false"
            @confirm="handlePasswordConfirm"></PaymentPasswordPopup>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBalance } from '~/api/member'
import { storage } from '~/utils'

const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

definePageMeta({
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

const withdrawalAccountCacheKey = 'withdrawal_accounts'
const withdrawalOrderCacheKey = 'withdrawal_orders'
const fixedWithdrawMinAmount = 2000
const fixedWithdrawMaxAmount = 50000
const fixedWithdrawAmountValues = [2000, 3000,5000, 8000,10000, 30000, 50000,100000]
const fixedWithdrawMethods = [
    { key: 'jazzcash', label: 'JazzCash', shortName: 'JC', logo: '/brand/JazzCash.jpg' },
    { key: 'easypaisa', label: 'Easypaisa', shortName: 'EP', logo: '/brand/Easypaisa.jpg' },
    { key: 'bank', label: 'Bank', shortName: 'BK', logo: '' },
]

const balance = ref(0)
const selectedWithdrawKey = ref('jazzcash')
const selectedAmount = ref(2000)
const customAmount = ref('2000')
const showPaymentPopup = ref(false)
const showSuccessModal = ref(false)
const showAddAccount = ref(false)
const accountFormMethodKey = ref('jazzcash')
const cachedWithdrawalAccounts = ref({})
const cachedWithdrawalOrders = ref([])

const createEmptyAccountForm = () => ({
    name: '',
    walletAccount: '',
    bankName: '',
    bankAccount: '',
    cnic: '',
})

const accountForm = ref(createEmptyAccountForm())

onMounted(() => {
    cachedWithdrawalAccounts.value = loadWithdrawalAccounts()
    cachedWithdrawalOrders.value = loadWithdrawalOrders()
    handleGetBalance()
})

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

const handleGetBalance = () => {
    showLoading($lang('加载中'))
    getBalance({}).then(res => {
        hideLoading()
        if (res.success) {
            balance.value = safeNumber(res.data.amount)
        } else {
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        hideLoading()
        showMsg(error.message, 'fail')
    })
}

const selectedMethod = computed(() => {
    return fixedWithdrawMethods.find(item => item.key === selectedWithdrawKey.value) || fixedWithdrawMethods[0]
})

const currentFormMethod = computed(() => {
    return fixedWithdrawMethods.find(item => item.key === accountFormMethodKey.value) || fixedWithdrawMethods[0]
})

const selectedWithdrawalAccount = computed(() => {
    return cachedWithdrawalAccounts.value[selectedWithdrawKey.value] || null
})

const selectedWithdrawalAccountLabel = computed(() => {
    const account = selectedWithdrawalAccount.value
    if (!account) return ''
    if (account.methodKey === 'bank') {
        return `${account.bankName} ${maskAccountNo(account.bankAccount)}`
    }
    return `${account.label} +92 ${maskAccountNo(account.walletAccount)}`
})

const withdrawAmount = computed(() => {
    return safeNumber(customAmount.value || selectedAmount.value)
})

const customActive = computed(() => {
    return safeNumber(customAmount.value) !== selectedAmount.value
})

const canSubmitAmount = computed(() => {
    const amount = withdrawAmount.value
    return amount >= fixedWithdrawMinAmount && amount <= fixedWithdrawMaxAmount && amount <= availableBalance.value
})

const pendingWithdrawalAmount = computed(() => {
    return cachedWithdrawalOrders.value
        .filter(order => order.status === 'processing')
        .reduce((total, order) => total + safeNumber(order.amount), 0)
})

const availableBalance = computed(() => {
    return Math.max(balance.value - pendingWithdrawalAmount.value, 0)
})

const hasPendingWithdrawal = computed(() => {
    return cachedWithdrawalOrders.value.some(order => order.status === 'processing')
})

const amountRangePlaceholder = computed(() => {
    return `${formatMoney(fixedWithdrawMinAmount)} - ${formatMoney(fixedWithdrawMaxAmount)}`
})

const selectWithdrawMethod = (method) => {
    selectedWithdrawKey.value = method.key
}

const selectAmount = (amount) => {
    selectedAmount.value = amount
    customAmount.value = String(amount)
}

const onCustomInput = () => {
    selectedAmount.value = 0
}

const selectMaxAmount = () => {
    const maxAmount = Math.min(availableBalance.value, fixedWithdrawMaxAmount)
    selectedAmount.value = 0
    customAmount.value = String(maxAmount)
}

const loadWithdrawalAccounts = () => {
    try {
        const cache = storage.get(withdrawalAccountCacheKey)
        return cache ? JSON.parse(cache) : {}
    } catch (_error) {
        return {}
    }
}

const persistWithdrawalAccounts = () => {
    storage.set(withdrawalAccountCacheKey, JSON.stringify(cachedWithdrawalAccounts.value))
}

const loadWithdrawalOrders = () => {
    try {
        const cache = storage.get(withdrawalOrderCacheKey)
        const orders = cache ? JSON.parse(cache) : []
        return Array.isArray(orders) ? orders : []
    } catch (_error) {
        return []
    }
}

const persistWithdrawalOrders = () => {
    storage.set(withdrawalOrderCacheKey, JSON.stringify(cachedWithdrawalOrders.value))
}

const normalizeAccountForm = (methodKey, account = {}) => {
    return {
        ...createEmptyAccountForm(),
        ...account,
        methodKey,
    }
}

const openAddAccount = (method) => {
    const targetMethod = method || selectedMethod.value
    accountFormMethodKey.value = targetMethod.key
    accountForm.value = normalizeAccountForm(targetMethod.key, cachedWithdrawalAccounts.value[targetMethod.key])
    showAddAccount.value = true
}

const switchAccountFormMethod = (method) => {
    accountFormMethodKey.value = method.key
    accountForm.value = normalizeAccountForm(method.key, cachedWithdrawalAccounts.value[method.key])
}

const isAccountComplete = (account) => {
    if (!account || !account.name || !account.cnic) return false
    if (account.methodKey === 'bank') {
        return Boolean(account.bankName && account.bankAccount)
    }
    return Boolean(account.walletAccount)
}

const saveWithdrawalAccount = () => {
    const method = currentFormMethod.value
    const account = normalizeAccountForm(method.key, accountForm.value)
    if (!isAccountComplete(account)) {
        showMsg($lang('请添加提现地址'), 'fail')
        return
    }

    cachedWithdrawalAccounts.value = {
        ...cachedWithdrawalAccounts.value,
        [method.key]: {
            ...account,
            label: method.label,
            cacheId: `local-${method.key}`,
            updatedAt: Date.now(),
        }
    }
    persistWithdrawalAccounts()
    selectedWithdrawKey.value = method.key
    showAddAccount.value = false
    showMsg($lang('保存成功'), 'success')
}

const maskAccountNo = (accountNo) => {
    const value = String(accountNo || '')
    if (value.length <= 4) return value
    return `${value.slice(0, 3)}****${value.slice(-3)}`
}

const handleSubmit = () => {
    if (hasPendingWithdrawal.value) {
        showMsg($lang('您已有提现订单处理中'), 'fail')
        return
    }

    const account = selectedWithdrawalAccount.value
    if (!isAccountComplete(account)) {
        showMsg($lang('请添加提现地址'), 'fail')
        return
    }

    if (!canSubmitAmount.value) {
        showMsg(`${$lang('请输入金额')} ${amountRangePlaceholder.value}`, 'fail')
        return
    }

    if (withdrawAmount.value > availableBalance.value) {
        showMsg($lang('提现金额不能大于余额'), 'fail')
        return
    }

    showPaymentPopup.value = true
}

const buildWithdrawalOrder = (account) => {
    const amount = withdrawAmount.value
    const now = new Date()
    const pad = value => String(value).padStart(2, '0')
    const updateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    return {
        id: `WD${now.getTime()}`,
        type: 11,
        change_type: 2,
        amount,
        before_amount: availableBalance.value,
        after_amount: Math.max(availableBalance.value - amount, 0),
        update_time: updateTime,
        status: 'processing',
        statusText: '提现中',
        methodKey: account.methodKey,
        methodLabel: account.label,
        accountName: account.name,
        accountNo: account.methodKey === 'bank' ? account.bankAccount : account.walletAccount,
        bankName: account.methodKey === 'bank' ? account.bankName : account.label,
        cnic: account.cnic,
    }
}

const appendWithdrawalOrder = (account) => {
    cachedWithdrawalOrders.value = [buildWithdrawalOrder(account), ...cachedWithdrawalOrders.value]
    persistWithdrawalOrders()
}

const handlePasswordConfirm = (password) => {
    const account = selectedWithdrawalAccount.value
    if (!isAccountComplete(account)) {
        showPaymentPopup.value = false
        showMsg($lang('请添加提现地址'), 'fail')
        return
    }

    showPaymentPopup.value = false
    appendWithdrawalOrder(account)
    showSuccessModal.value = true
}
</script>

<style scoped lang="scss">
.withdrawal-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding: rem(14) rem(14) rem(28);
}

.summary-panel {
    margin-bottom: rem(12);
}

.summary-card {
    min-height: rem(92);
    border-radius: $radius-lg;
    background: #fff;
    border: 1px solid rgba(17, 24, 39, 0.06);
    padding: rem(14);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 rem(8) rem(22) rgba(17, 24, 39, 0.05);
}

.summary-label {
    font-size: rem(12);
    color: $color-text-secondary;
}

.summary-value {
    font-size: rem(20);
    line-height: 1.15;
    color: $color-text-primary;
    word-break: break-word;
}

.withdraw-section,
.amount-panel,
.account-section,
.add-account-view {
    background: #fff;
    border-radius: $radius-lg;
    border: 1px solid rgba(17, 24, 39, 0.06);
    padding: rem(16);
    margin-bottom: rem(12);
    box-shadow: 0 rem(8) rem(22) rgba(17, 24, 39, 0.04);
}

.section-title {
    font-size: rem(15);
    font-weight: 700;
    color: $color-text-primary;
    margin-bottom: rem(12);
}

.method-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: rem(8);
}

.method-card {
    position: relative;
    min-height: rem(84);
    border-radius: $radius-md;
    border: 1px solid $color-border;
    background: $color-bg-page;
    color: $color-text-secondary;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: rem(8);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;

    &.active {
        border-color: $color-primary;
        background: rgba($color-primary, 0.06);
        color: $color-primary;

        &::after {
            content: "";
            position: absolute;
            top: rem(8);
            right: rem(8);
            width: rem(8);
            height: rem(8);
            border-radius: 50%;
            background: $color-primary;
        }
    }
}

.method-icon {
    width: rem(34);
    height: rem(34);
    border-radius: rem(10);
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: rem(12);
    font-weight: 800;
    color: $color-primary;
    border: 1px solid rgba(17, 24, 39, 0.06);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.method-name {
    max-width: 100%;
    font-size: rem(12);
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.amount-heading,
.account-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: rem(10);
    margin-bottom: rem(12);
}

.amount-heading {
    font-size: rem(15);
    font-weight: 700;
    color: $color-text-primary;
}

.amount-range,
.account-subtitle {
    font-size: rem(12);
    font-weight: 500;
    color: $color-text-muted;
}

.amount-presets {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: rem(8);
    margin-bottom: rem(12);
}

.preset-btn {
    min-height: rem(44);
    border-radius: $radius-md;
    border: 1px solid $color-border;
    background: $color-bg-page;
    color: $color-text-primary;
    font-size: rem(13);
    font-weight: 700;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;

    &.active {
        border-color: $color-primary;
        background: $color-primary;
        color: #fff;
    }
}

.amount-input-wrap {
    min-height: rem(50);
    border-radius: $radius-md;
    border: 1px solid $color-border;
    background: $color-bg-page;
    padding: 0 rem(10);
    display: flex;
    align-items: center;
    gap: rem(8);
}

.input-prefix {
    font-size: rem(14);
    font-weight: 700;
    color: $color-text-primary;
}

.amount-input {
    min-width: 0;
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: $color-text-primary;
    font-size: rem(16);
    font-weight: 700;

    &::placeholder {
        color: $color-text-muted;
        font-size: rem(13);
        font-weight: 500;
    }
}

.max-btn,
.text-action {
    border: none;
    background: rgba($color-primary, 0.08);
    color: $color-primary;
    border-radius: rem(999);
    padding: rem(7) rem(12);
    font-size: rem(12);
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
}

.account-heading .section-title {
    margin-bottom: rem(3);
}

.saved-account-card {
    width: 100%;
    min-height: rem(74);
    border-radius: $radius-md;
    border: 1px solid rgba($color-primary, 0.22);
    background: rgba($color-primary, 0.04);
    display: flex;
    align-items: center;
    gap: rem(12);
    padding: rem(12);
    text-align: left;
    cursor: pointer;
}

.saved-account-icon {
    width: rem(42);
    height: rem(42);
    border-radius: 50%;
    background: $color-primary;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: rem(12);
    font-weight: 800;
    flex: none;
}

.saved-account-info {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: rem(4);

    strong {
        font-size: rem(14);
        color: $color-text-primary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    small {
        font-size: rem(12);
        color: $color-text-secondary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.chevron-icon {
    width: rem(18);
    height: rem(18);
    color: $color-text-muted;
}

.empty-account-card {
    border-radius: $radius-md;
    border: 1px dashed $color-border;
    background: $color-bg-page;
    padding: rem(18);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(10);
    text-align: center;

    p {
        margin: 0;
        color: $color-text-secondary;
        font-size: rem(13);
        line-height: 1.45;
    }
}

.empty-icon {
    width: rem(42);
    height: rem(42);
    border-radius: 50%;
    background: #fff;
    color: $color-text-muted;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: rem(22);
        height: rem(22);
    }
}

.add-account-btn {
    min-width: rem(132);
    height: rem(38);
    border: none;
    border-radius: rem(999);
    background: $color-primary;
    color: #fff;
    font-size: rem(13);
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: rem(4);
    cursor: pointer;
}

.submit-wrap {
    padding: rem(4) 0 rem(14);
}

.pending-notice {
    border-radius: $radius-md;
    background: #FFF7ED;
    border: 1px solid #FED7AA;
    color: #9A3412;
    padding: rem(12);
    margin-bottom: rem(12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: rem(10);

    strong {
        font-size: rem(13);
        white-space: nowrap;
    }

    span {
        min-width: 0;
        font-size: rem(12);
        line-height: 1.45;
        text-align: right;
    }
}

.submit-btn {
    width: 100%;
    min-height: rem(48);
    border-radius: $radius-md;
    border: none;
    background: $color-primary;
    color: #fff;
    font-size: rem(15);
    font-weight: 800;
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
}

.add-account-view {
    margin-bottom: 0;
}

.add-header {
    display: flex;
    align-items: center;
    gap: rem(10);
    margin-bottom: rem(16);

    strong {
        font-size: rem(17);
        color: $color-text-primary;
    }
}

.back-btn {
    width: rem(34);
    height: rem(34);
    border-radius: 50%;
    border: 1px solid $color-border;
    background: $color-bg-page;
    color: $color-text-primary;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
        width: rem(20);
        height: rem(20);
    }
}

.method-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: rem(8);
    margin-bottom: rem(12);
}

.method-tab {
    min-height: rem(38);
    border-radius: rem(999);
    border: 1px solid $color-border;
    background: $color-bg-page;
    color: $color-text-secondary;
    font-size: rem(12);
    font-weight: 700;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;

    &.active {
        border-color: $color-primary;
        background: rgba($color-primary, 0.08);
        color: $color-primary;
    }
}

.tips-card {
    border-radius: $radius-md;
    background: rgba($color-primary, 0.06);
    padding: rem(12);
    margin-bottom: rem(12);

    p {
        position: relative;
        margin: 0 0 rem(6);
        padding-left: rem(14);
        font-size: rem(12);
        line-height: 1.5;
        color: $color-text-secondary;

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: rem(7);
            width: rem(5);
            height: rem(5);
            border-radius: 50%;
            background: $color-primary;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
}

.form-card {
    display: flex;
    flex-direction: column;
    gap: rem(12);
    margin-bottom: rem(16);
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: rem(8);

    span {
        font-size: rem(13);
        font-weight: 700;
        color: $color-text-primary;
    }

    input {
        width: 100%;
        min-height: rem(48);
        border-radius: $radius-md;
        border: 1px solid $color-border;
        background: $color-bg-page;
        padding: 0 rem(12);
        color: $color-text-primary;
        font-size: rem(14);
        outline: none;

        &:focus {
            border-color: $color-primary;
            background: #fff;
        }

        &::placeholder {
            color: $color-text-muted;
        }
    }
}

.phone-input {
    min-height: rem(48);
    border-radius: $radius-md;
    border: 1px solid $color-border;
    background: $color-bg-page;
    display: flex;
    align-items: center;
    overflow: hidden;

    b {
        align-self: stretch;
        min-width: rem(56);
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid $color-border;
        color: $color-text-primary;
        font-size: rem(14);
    }

    input {
        min-width: 0;
        flex: 1;
        border: none;
        background: transparent;
    }

    &:focus-within {
        border-color: $color-primary;
        background: #fff;
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
    background: #F0FDF4;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto rem(16);
    color: #059669;

    svg {
        width: rem(28);
        height: rem(28);
    }
}

.modal-title {
    font-size: rem(16);
    font-weight: 700;
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
    font-weight: 700;
    cursor: pointer;

    &--confirm {
        background: $color-primary;
        color: #fff;
        border: none;
    }
}
</style>
