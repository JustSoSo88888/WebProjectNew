<template>
    <div class="withdrawal-page">
        <!-- Balance Card -->
        <div class="balance-card">
            <div class="balance-label">{{ $lang('余额') }}</div>
            <div class="balance-amount" translate="no">
                <span class="currency">R$</span>
                <span class="amount">{{ balance }}</span>
            </div>
        </div>

        <!-- Fee Info -->
        <div class="fee-info">
            <div class="fee-item">
                <span class="fee-label">{{ $lang('手续费') }}</span>
                <span class="fee-value">{{ tax }}%</span>
            </div>
            <div class="fee-item">
                <span class="fee-label">{{ $lang('最低提现金额') }}</span>
                <span class="fee-value" translate="no">R$ {{ minAmount }}</span>
            </div>
        </div>

        <!-- Bank Card Selection -->
        <div class="bank-card-section" v-if="bankCards.length > 0">
            <div class="section-title">{{ $lang('选择银行卡') }}</div>
            <div class="bank-card-select">
                <div class="bank-card-info flex flex-between">
                    <div class="card-name">{{ selectedBankCard.user_name }}</div>
                    <div class="card-number">{{ maskCardNo(selectedBankCard.bank_card_no) }}</div>
                </div>
            </div>
        </div>

        <van-popup v-model:show="showBankCardPicker" position="bottom" round>
            <div class="picker-header">
                <span class="picker-cancel" @click="showBankCardPicker = false">{{ $lang('取消') }}</span>
                <span class="picker-title">{{ $lang('选择银行卡') }}</span>
                <span class="picker-confirm" @click="showBankCardPicker = false">{{ $lang('确认') }}</span>
            </div>
            <div class="picker-list">
                <div v-for="card in bankCards" :key="card.id" class="picker-item"
                    :class="{ active: selectedBankCard.id === card.id }" @click="selectBankCard(card)">
                    <div class="picker-item-info">
                        <div class="picker-card-no">{{ maskCardNo(card.bank_card_no) }}</div>
                    </div>
                    <svg v-if="selectedBankCard.id === card.id" class="check-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
        </van-popup>

        <!-- Amount Selection -->
        <div class="amount-section">
            <div class="section-title">{{ $lang('选择或输入提现金额') }}</div>

            <!-- Amount Presets -->
            <div class="amount-presets">
                <template v-for="preset in amountPresets" :key="preset">
                    <button v-if="parseFloat(preset.amount) > minAmount" class="preset-btn"
                        :class="{ active: selectedAmount == preset.amount }" @click="selectAmount(preset.amount)">
                        R$ {{ parseFloat(preset.amount) }}
                    </button>
                </template>
            </div>

            <!-- Custom Amount Input -->
            <div class="custom-amount">
                <span class="prefix">R$</span>
                <input v-model="customAmount" type="number" class="amount-input" :placeholder="$lang('请输入金额')"
                    @input="onCustomInput" />
            </div>
        </div>

        <!-- Actual Amount -->
        <div class="actual-amount" v-if="actualAmount > 0">
            <span class="label" translate="no">{{ $lang('实际到账金额') }}</span>
            <span class="value">R$ {{ actualAmount.toFixed(2) }}</span>
        </div>


        <!-- Submit Button -->
        <button class="submit-btn" :disabled="!canSubmit"  @click="handleSubmit">
            {{ $lang('确认提现') }}
        </button>

        <!-- Bottom Description -->
        <!-- <div class="description">
            <p>根据巴西税法规定，员工每次提款都需要缴纳10%的税款，该税款由巴西政府征收。</p>
            <p>当您申请提款时，SP财务部门会将您的银行信息发送给与SP合作的银行，该银行将为您进行转账。请您核对您的银行账户信息是否正确。</p>
            <p>银行将在0至72小时内完成转账，请您耐心等待。</p>
        </div> -->

        <!-- Success Modal -->
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
                    <button class="modal-btn modal-btn--confirm" @click="showSuccessModal = false">{{ $lang('确认')
                    }}</button>
                </div>
            </div>
        </van-popup>
        <PaymentPasswordPopup v-model:show="showPaymentPopup" @cancel="showPaymentPopup = false"
            @confirm="handlePasswordConfirm"></PaymentPasswordPopup>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#imports'
import { bankCardWithdrawalRate, bankCardWithdrawal } from '~/api/withdrawal'
import { getBalance } from '~/api/member'
import { storage } from '~/utils'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
const $dialog = nuxtApp.$dialog
const router = useRouter()

definePageMeta({ layout: 'second-page' })

onMounted(async () => {
    getBankCardWithdrawalRate()
    handelGetBance()
})
const level = ref(0)
const handelGetBance = () => {
    getBalance({}).then(res => {
        if (res.success) {
            level.value = res.data.level
            let userData = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : {}
            if (Object.keys(userData).length > 0 && userData.level != level.value) {
                userData.level = level.value
                storage.set('user_data', JSON.stringify(userData))
            }
        } else {
            let userData = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : {}
            if (Object.keys(userData).length > 0) {
                level.value = userData.level
            }
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        showMsg(error.message, 'fail')
    })
}

const checkBankCardBind = async (length) => {
    if (length > 0) return true

    try {
        await $dialog.confirm({
            title: $lang('提示'),
            message: $lang('请先绑定银行卡'),
            confirmButtonText: $lang('确认'),
            cancelButtonText: $lang('取消')
        })
        navigateTo('/profile/bankInfo')
    } catch (_error) {
        if (window.history.length > 1) {
            router.back()
        } else {
            navigateTo('/profile')
        }
    }
    return false
}

const withdrawalData = ref({})
const tax = ref(0)
const getBankCardWithdrawalRate = async () => {
    showLoading($lang('加载中'))
    try {
        const res = await bankCardWithdrawalRate({})
        hideLoading()
        if (res.success) {
            withdrawalData.value = res.data
            amountPresets.value = res.data.amount_configs || []
            balance.value = parseFloat(res.data.amount_data.amount)
            tax.value = res.data.without_tax
            minAmount.value = parseFloat(res.data.without_min)
            bankCards.value = res.data.bank_cards || []
            canWithout.value = res.data.is_without_tax
            if (bankCards.value.length > 0) {
                selectedBankCard.value = bankCards.value[0]
            }
            await checkBankCardBind(res.data.bank_cards.length)
        } else {
            showMsg(res.message, 'fail')
        }
    } catch (error) {
        hideLoading()
        showMsg(error.message, 'fail')
    }
}

const balance = ref('')
const minAmount = ref(0)
const canWithout = ref(0)

const bankCards = ref([])
const selectedBankCard = ref({})
const showBankCardPicker = ref(false)
const selectBankCard = (card) => {
    selectedBankCard.value = card
    showBankCardPicker.value = false
}

const maskCardNo = (cardNo) => {
    if (!cardNo || cardNo.length < 8) return cardNo
    const start = cardNo.substring(0, 4)
    const end = cardNo.substring(cardNo.length - 4)
    return `${start}*****${end}`
}

const amountPresets = ref([])
const selectedAmount = ref(0)
const customAmount = ref('')


const showSuccessModal = ref(false)

const actualAmount = computed(() => {
    const amount = selectedAmount.value || parseFloat(customAmount.value) || 0
    return amount * (1 - (tax.value / 100))
})

const canSubmit = computed(() => {
    const amount = selectedAmount.value || parseFloat(customAmount.value) || 0
    return amount >= minAmount.value && canWithout.value
})

const selectAmount = (amount) => {
    selectedAmount.value = parseFloat(amount)
    customAmount.value = parseFloat(amount)
}

const onCustomInput = () => {
    selectedAmount.value = 0
}

const showPaymentPopup = ref(false)
const handleSubmit = () => {
    if (level.value == 0) {
        $dialog.confirm({
            title: $lang('提示'),
            message: $lang('只有VIP用户可提现,请前往充值页充值！'),
            confirmText: $lang('确认'),
            cancelText: $lang('取消')
        }).then(() => {
            navigateTo('/profile/recharge')
        }).catch(() => {
        })
        return
    }
    showPaymentPopup.value = true

}

const handlePasswordConfirm = (password) => {
    showPaymentPopup.value = false
    showLoading($lang('加载中'))
    let params = {
        amount: customAmount.value,
        pay_password: password,
        bank_card_id: selectedBankCard.value.id,
    }
    bankCardWithdrawal(params).then(res => {
        hideLoading();
        if (res.success) {
            showSuccessModal.value = true
            getBankCardWithdrawalRate();
        } else {
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')
    })
}


</script>

<style scoped lang="scss">
.withdrawal-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding: rem(16);
}

.balance-card {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border-radius: $radius-xl;
    padding: rem(20);
    margin-bottom: rem(12);
    box-shadow: $shadow-gold;
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
    justify-content: space-between;
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

.bank-card-section {
    background: #fff;
    border-radius: $radius-lg;
    padding: rem(16);
    margin-bottom: rem(12);
}

.bank-card-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: $color-bg-page;
    border-radius: $radius-md;
    padding: rem(14);
    cursor: pointer;
}

.bank-card-info {
    flex: 1;
}

.bank-name {
    font-size: rem(14);
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: rem(4);
}

.card-number {
    font-size: rem(12);
    color: $color-text-secondary;
}

.arrow-icon {
    width: rem(20);
    height: rem(20);
    color: $color-text-muted;
}

.picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(16);
    border-bottom: 1px solid $color-border;
}

.picker-cancel,
.picker-confirm {
    font-size: rem(14);
    color: $color-primary;
    cursor: pointer;
}

.picker-title {
    font-size: rem(16);
    font-weight: 600;
    color: $color-text-primary;
}

.picker-list {
    overflow-y: auto;
}

.picker-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(16);
    border-bottom: 1px solid $color-border;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    &.active {
        background: rgba($color-primary, 0.05);
    }
}

.picker-item-info {
    flex: 1;
}

.picker-bank-name {
    font-size: rem(14);
    font-weight: 500;
    color: $color-text-primary;
    margin-bottom: rem(4);
}

.picker-card-no {
    font-size: rem(12);
    color: $color-text-secondary;
}

.check-icon {
    width: rem(20);
    height: rem(20);
    color: $color-primary;
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
    background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto rem(16);
    color: #d97706;

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
