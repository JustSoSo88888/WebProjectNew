<template>
    <div class="finance-detail-page">
        <!-- Product Header -->
        <div class="product-header">
            <img :src="detail.image_url" class="product-image" />
            <div class="product-info">
                <h1 class="product-name">{{ detail.title }}</h1>
            </div>
        </div>

        <!-- Product Stats -->
        <div class="stats-card">
            <div class="stat-item">
                <span class="stat-value" translate="no">{{ detail.day_number }}</span>
                <span class="stat-label">{{ $lang('天数') }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-value highlight">{{ detail.daily_income_rate }}%</span>
                <span class="stat-label">{{ $lang('日收益率') }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-value">R$ {{ detail.min_amount }}</span>
                <span class="stat-label">{{ $lang('最低金额') }}</span>
            </div>
        </div>

        <!-- Product Description -->
        <div class="desc-card" v-if="detail.desc">
            <div class="card-title">{{ $lang('产品简介') }}</div>
            <div class="desc-content" v-html="detail.desc">
            </div>
        </div>

        <!-- Investment Form -->
        <div class="invest-card">
            <div class="card-title">{{ $lang('购买理财') }}</div>

            <!-- Amount Input -->
            <div class="form-item">
                <label class="form-label">{{ $lang('投资金额') }}</label>
                <div class="amount-input-wrap">
                    <span class="currency">R$</span>
                    <input v-model="investAmount" type="number" class="amount-input" :placeholder="$lang('请输入投资金额')" />
                </div>
                <div class="amount-hint">{{$lang('最低投资金额')}}：R$ {{ detail.min_amount }}</div>
            </div>

            <!-- Select Coupon -->
            <div class="form-item">
                <label class="form-label">{{ $lang('选择优惠券') }}</label>
                <div class="coupon-select" @click="handleShowCouponPicker">
                    <span class="coupon-value">
                        {{ selectedCoupon ? `${selectedCoupon.title} -
                        R$${parseFloat(selectedCoupon.limit_deductible_amount)}` :  $lang('选择优惠券')}}
                    </span>
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="coupon-hint" v-if="selectedCoupon">
                    {{$lang('已优惠')}}：R$ {{ parseFloat(selectedCoupon.limit_deductible_amount) }}
                </div>
            </div>

            <!-- Discount Preview -->
            <div class="discount-preview" v-if="investAmount >= detail.min_amount">
                <div class="preview-row">
                    <span>{{ $lang('投资金额') }}</span>
                    <span>R$ {{ investAmount || 0 }}</span>
                </div>
                <div class="preview-row" v-if="selectedCoupon">
                    <span>{{ $lang('优惠') }}</span>
                    <span class="discount">-R$ {{ parseFloat(selectedCoupon.limit_deductible_amount) }}</span>
                </div>
                <div class="preview-row total">
                    <span>{{ $lang('实付金额') }}</span>
                    <span class="total-value">R$ {{ actualAmount }}</span>
                </div>
                <div class="preview-row profit">
                    <span>{{ $lang('预计总收益') }}</span>
                    <span class="profit-value">+R$ {{ estimatedProfit }}</span>
                </div>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div class="bottom-bar">
            <div class="profit-info">
                <span class="profit-label">{{ $lang('预计总收益') }}</span>
                <span class="profit-amount">+R$ {{ estimatedProfit }}</span>
            </div>
            <button class="invest-btn" :disabled="!canInvest" @click="handleInvest">
                {{ $lang('立即投资') }}
            </button>
        </div>

        <!-- Coupon Picker Popup -->
        <van-popup v-model:show="showCouponPicker" overlay-class="popup-bottom" class="popup-bottom" position="bottom"
            round>
            <div class="coupon-picker">
                <div class="picker-header">
                    <span class="picker-title">{{ $lang('选择优惠券') }}</span>
                    <button class="picker-close" @click="showCouponPicker = false">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" />
                        </svg>
                    </button>
                </div>
                <div class="coupon-list">
                    <div class="coupon-option" :class="{ selected: !selectedCoupon }" @click="selectCoupon(null)">
                        <div class="option-info">
                            <span class="option-title">{{ $lang('不使用优惠券') }}</span>
                        </div>
                        <div class="option-check" v-if="!selectedCoupon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div v-for="coupon in availableCoupons" :key="coupon.id" class="coupon-option"
                        :class="{ selected: selectedCoupon?.id === coupon.id }" @click="selectCoupon(coupon)">
                        <div class="option-info">
                            <span class="option-title">{{ coupon.title }}</span>
                            <span class="option-value">R${{ parseFloat(coupon.limit_deductible_amount) }}</span>
                        </div>
                        <div class="option-check" v-if="selectedCoupon?.id === coupon.id">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
        <PaymentPasswordPopup v-model:show="showPaymentPopup" @cancel="showPaymentPopup = false"
            @confirm="handlePasswordConfirm"></PaymentPasswordPopup>
        <!-- Success Modal -->
        <van-popup v-model:show="showSuccessModal" position="center" round>
            <div class="success-modal">
                <div class="success-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
                        <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="success-title">{{ $lang('投资成功') }}</div>
                <div class="success-desc">{{ $lang('您的理财产品已购买成功，请耐心等待收益') }}</div>
                <button class="success-btn" @click="goToRecord">{{ $lang('查看理财记录') }}</button>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { navigateTo } from '#imports'
import { mealDetail, mealBuy } from '~/api/meal'
import { getCouponList } from '~/api/member'
import PaymentPasswordPopup from '~/components/PaymentPasswordPopup.vue'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
definePageMeta({ layout: 'second-page' })
const route = useRoute()


const id = ref(null)
const detail = ref({})
onMounted(async () => {
    let mealId = route.query.id
    if (mealId) {
        id.value = mealId
        showLoading($lang('加载中'))
        try {
            let res = await mealDetail({ id: id.value });
            hideLoading();
            if (res.success) {
                detail.value = res.data
            } else {
                showMsg(res.message, 'fail')
            }
        } catch (error) {
            showMsg(error.message, 'fail')
        }

    } else {
        history.back()
    }

})


// Estimated Profit
const estimatedProfit = computed(() => {
    if (!investAmount.value) return '0.00'
    const amount = parseFloat(investAmount.value)
    const dailyProfit = amount * (detail.value.daily_income_rate / 100)
    return (dailyProfit * detail.value.day_number).toFixed(2)
})


// Investment Form
const investAmount = ref('')
const selectedCoupon = ref(null)
const showCouponPicker = ref(false)
const showSuccessModal = ref(false)

// Available Coupons (mock)
const availableCoupons = ref([])
const handleShowCouponPicker = async () => {
    try {
        showLoading($lang('加载中'))
        let res = await getCouponList({ status: 0 })

        hideLoading();
        if (res.success) {
            availableCoupons.value = res.data.rows || []
            showCouponPicker.value = true
        } else {
            showMsg(res.message, 'fail')
        }
    } catch (error) {
        showMsg(error.message, 'fail')
    }
}


// Actual Amount to Pay
const actualAmount = computed(() => {
    if (!investAmount.value) return 0
    const discount = selectedCoupon.value ? parseFloat(selectedCoupon.value.limit_deductible_amount) : 0
    if (parseFloat(investAmount.value) - discount < 0) {
        return 0
    }
    return parseFloat(investAmount.value) - discount
})



// Can Invest
const canInvest = computed(() => {
    if (!investAmount.value) return false
    const amount = parseFloat(investAmount.value)
    return amount >= detail.value.min_amount
})


// Select Coupon
const selectCoupon = (coupon) => {
    selectedCoupon.value = coupon
    showCouponPicker.value = false
}

// Handle Invest

const showPaymentPopup = ref(false)
const handlePasswordConfirm = async (val) => {
    try {
        let params = {
            meal_id: id.value,
            amount: investAmount.value,
            pay_password: val,
        }
        if(selectedCoupon.value){
            params.coupon_id = selectedCoupon.value.id
        }
        showLoading($lang('加载中'))
        let res = await mealBuy(params)
        hideLoading();
        if (res.success) {
            showSuccessModal.value = true
        } else {
            showMsg(res.message, 'fail')
        }
    } catch (error) {
        hideLoading();
        showMsg(error.message, 'fail')
    }


    showPaymentPopup.value = false
}
const handleInvest = async () => {
    if (!canInvest.value) {
        showMsg(`${$lang('最低投资金额为')} R$ ${detail.value.min_amount}`,'fail')
        return
    }
    showPaymentPopup.value = true
}

// Go to Record
const goToRecord = () => {
    showSuccessModal.value = false
    navigateTo('/finance/record')
}
</script>

<style scoped lang="scss">
.finance-detail-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding-bottom: rem(80);
}

// ── Product Header ──────────────────────────────────────────
.product-header {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    padding: rem(16);
    display: flex;
    gap: rem(16);
}

.product-image {
    width: rem(100);
    height: rem(70);
    border-radius: $radius-md;
    object-fit: cover;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.product-name {
    font-size: rem(18);
    font-weight: 700;
    color: #fff;
    margin-bottom: rem(8);
}

.product-tags {
    display: flex;
    gap: rem(6);
}

.tag {
    font-size: rem(10);
    padding: rem(2) rem(8);
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: $radius-full;
}

// ── Stats Card ────────────────────────────────────────────────
.stats-card {
    display: flex;
    background: #fff;
    margin: rem(12) rem(14);
    border-radius: $radius-lg;
    padding: rem(16);
    box-shadow: $shadow-md;
}

.stat-item {
    flex: 1;
    text-align: center;
}

.stat-value {
    font-size: rem(18);
    font-weight: 700;
    color: $color-text-primary;
    display: block;
    margin-bottom: rem(4);

    &.highlight {
        color: $color-success;
    }
}

.stat-label {
    font-size: rem(11);
    color: $color-text-muted;
}

.stat-divider {
    width: 1px;
    background: $color-border;
    margin: 0 rem(8);
}

// ── Description Card ─────────────────────────────────────────
.desc-card {
    background: #fff;
    margin: 0 rem(14) rem(12);
    border-radius: $radius-lg;
    padding: rem(16);
    box-shadow: $shadow-md;
}

.card-title {
    font-size: rem(15);
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: rem(12);
}

.desc-content {
    p {
        font-size: rem(13);
        color: $color-text-secondary;
        line-height: 1.6;
        margin-bottom: rem(12);
    }
}

.desc-list {
    li {
        font-size: rem(12);
        color: $color-text-muted;
        line-height: 1.8;
        padding-left: rem(16);
        position: relative;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: rem(8);
            width: rem(4);
            height: rem(4);
            border-radius: 50%;
            background: $color-primary;
        }
    }
}

// ── Invest Card ─────────────────────────────────────────────
.invest-card {
    background: #fff;
    margin: 0 rem(14);
    border-radius: $radius-lg;
    padding: rem(16);
    box-shadow: $shadow-md;
}

.form-item {
    margin-bottom: rem(16);

    &:last-child {
        margin-bottom: 0;
    }
}

.form-label {
    font-size: rem(13);
    font-weight: 500;
    color: $color-text-primary;
    margin-bottom: rem(8);
    display: block;
}

.amount-input-wrap {
    display: flex;
    align-items: center;
    background: $color-bg-page;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    padding: rem(12);
}

.currency {
    font-size: rem(15);
    color: $color-text-secondary;
    margin-right: rem(8);
}

.amount-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: rem(16);
    font-weight: 600;
    color: $color-text-primary;
    outline: none;

    &::placeholder {
        color: $color-text-muted;
        font-weight: 400;
    }
}

.amount-hint {
    font-size: rem(11);
    color: $color-text-muted;
    margin-top: rem(6);
}

.coupon-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: $color-bg-page;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    padding: rem(12);
    cursor: pointer;

    svg {
        width: rem(16);
        height: rem(16);
        color: $color-text-muted;
    }
}

.coupon-value {
    font-size: rem(14);
    color: $color-text-primary;
}

.coupon-hint {
    font-size: rem(11);
    color: $color-success;
    margin-top: rem(6);
}

.discount-preview {
    background: $color-bg-page;
    border-radius: $radius-md;
    padding: rem(12);
    margin-top: rem(16);
}

.preview-row {
    display: flex;
    justify-content: space-between;
    font-size: rem(13);
    color: $color-text-secondary;
    margin-bottom: rem(8);

    &:last-child {
        margin-bottom: 0;
    }

    &.total {
        padding-top: rem(8);
        border-top: 1px dashed $color-border;
        margin-top: rem(8);
        font-weight: 600;
        color: $color-text-primary;
    }

    &.profit {
        color: $color-success;
    }

    .discount {
        color: $color-danger;
    }

    .total-value {
        font-size: rem(16);
        font-weight: 700;
        color: $color-primary;
    }

    .profit-value {
        font-size: rem(15);
        font-weight: 700;
    }
}

// ── Bottom Bar ────────────────────────────────────────────────
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: rem(375);
    display: flex;
    align-items: center;
    padding: rem(12) rem(16);
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 100;
}

.profit-info {
    flex: 1;
}

.profit-label {
    font-size: rem(11);
    color: $color-text-muted;
    display: block;
}

.profit-amount {
    font-size: rem(16);
    font-weight: 700;
    color: $color-success;
}

.invest-btn {
    padding: rem(12) rem(32);
    background: $gradient-primary;
    color: #fff;
    border-radius: $radius-md;
    font-size: rem(15);
    font-weight: 600;

    &:disabled {
        background: $color-border;
        color: $color-text-muted;
    }
}

// ── Coupon Picker ────────────────────────────────────────────

.popup-bottom {
    width: rem(375);
    left: calc(50% - rem(187.5));
}

.coupon-picker {
    background: #fff;
    max-height: 60vh;
    overflow-y: auto;
}

.picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(16);
    border-bottom: 1px solid $color-border;
}

.picker-title {
    font-size: rem(16);
    font-weight: 600;
    color: $color-text-primary;
}

.picker-close {
    width: rem(32);
    height: rem(32);
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-bg-page;
    border-radius: 50%;

    svg {
        width: rem(16);
        height: rem(16);
        color: $color-text-secondary;
    }
}

.coupon-list {
    padding: rem(12);
}

.coupon-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(14);
    background: $color-bg-page;
    border-radius: $radius-md;
    margin-bottom: rem(8);

    &:last-child {
        margin-bottom: 0;
    }

    &.selected {
        background: rgba($color-primary, 0.1);
        border: 1px solid $color-primary;
    }
}

.option-info {
    flex: 1;
}

.option-title {
    font-size: rem(14);
    font-weight: 600;
    color: $color-text-primary;
    display: block;
}

.option-value {
    font-size: rem(13);
    color: $color-success;
    display: block;
    margin-top: rem(4);
}

.option-desc {
    font-size: rem(11);
    color: $color-text-muted;
    display: block;
    margin-top: rem(2);
}

.option-check {
    width: rem(20);
    height: rem(20);
    color: $color-primary;
}

// ── Success Modal ────────────────────────────────────────────
.success-modal {
    background: #fff;
    border-radius: $radius-xl;
    padding: rem(24);
    text-align: center;
    width: 100%;
    max-width: rem(300);
}

.success-icon {
    width: rem(56);
    height: rem(56);
    margin: 0 auto rem(16);
    color: $color-success;
}

.success-title {
    font-size: rem(18);
    font-weight: 700;
    color: $color-text-primary;
    margin-bottom: rem(8);
}

.success-desc {
    font-size: rem(13);
    color: $color-text-secondary;
    margin-bottom: rem(20);
}

.success-btn {
    width: 100%;
    padding: rem(12) 0;
    background: $gradient-primary;
    color: #fff;
    border-radius: $radius-md;
    font-size: rem(14);
    font-weight: 600;
}
</style>
