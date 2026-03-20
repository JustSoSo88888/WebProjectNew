<template>
    <div class="recharge-page">

        <!-- ① 当前余额 -->
        <div class="balance-card">
            <div class="balance-label">当前余额</div>
            <div class="balance-amount">
                <span class="balance-unit">R$</span>
                <span class="balance-value">{{ balance }}</span>
            </div>
        </div>

        <!-- ② 充值金额 -->
        <div class="section-card">
            <div class="section-title">充值金额</div>
            <div class="preset-grid">
                <button
                    v-for="amt in amountPresets"
                    :key="amt"
                    class="preset-btn"
                    :class="{ active: selectedAmount === amt && !customActive }"
                    @click="selectPreset(amt)"
                >
                    <span class="preset-unit">R$</span>{{ amt }}
                </button>
            </div>
            <div class="input-wrap" :class="{ focused: inputFocused }">
                <span class="input-prefix">R$</span>
                <input
                    v-model="customAmount"
                    type="number"
                    inputmode="decimal"
                    class="amount-input"
                    placeholder="输入其他金额"
                    @focus="onInputFocus"
                    @blur="inputFocused = false"
                    @input="onCustomInput"
                />
            </div>
        </div>

        <!-- ③ 充值方式 -->
        <div class="section-card">
            <div class="section-title">充值方式</div>
            <div class="channel-list">
                <button
                    v-for="channel in channels"
                    :key="channel.id"
                    class="channel-item"
                    :class="{ active: selectedChannel === channel.id }"
                    @click="selectedChannel = channel.id"
                >
                    <div class="channel-icon" :style="{ background: channel.iconBg }">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" v-html="channel.icon" />
                    </div>
                    <div class="channel-info">
                        <div class="channel-name">{{ channel.name }}</div>
                        <div class="channel-range">{{ channel.range }}</div>
                    </div>
                    <div class="channel-radio">
                        <div class="radio-inner" v-if="selectedChannel === channel.id" />
                    </div>
                </button>
            </div>
        </div>

        <!-- ④ 底部说明 -->
        <div class="notice-card">
            <div class="notice-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <p class="notice-text">
                由于巴西金融系统频繁遭受网络攻击，巴西中央银行已展开调查。如果某笔交易触发风险警告，这属于正常的安全警报，您可以尝试其他官方渠道。如果您仍有疑问，请联系您的招聘经理寻求帮助。
            </p>
        </div>

        <!-- ⑤ 确认充值按钮 -->
        <div class="submit-wrap">
            <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">
                确认充值{{ finalAmount ? `  R$${finalAmount}` : '' }}
            </button>
        </div>

    </div>
</template>

<script setup>
    import {ref, computed} from 'vue'
    import {navigateTo} from '#imports'

    definePageMeta({layout: 'second-page'})

    // 当前余额（模拟）
    const balance = ref('2,580.00')

    // 快捷金额预设
    const amountPresets = [100, 200, 500, 1000, 2000, 5000]

    // 选中状态
    const selectedAmount = ref(null)
    const customAmount = ref('')
    const customActive = ref(false)
    const inputFocused = ref(false)

    // 充值通道
    const channels = [
        {
            id: 'pix',
            name: 'PIX 支付',
            range: 'R$100 - R$50,000',
            iconBg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
            icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#059669" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
        },
        {
            id: 'bank',
            name: '银行转账',
            range: 'R$500 - R$200,000',
            iconBg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
            icon: '<rect x="2" y="5" width="20" height="14" rx="2" stroke="#2563EB" stroke-width="1.8"/><path d="M2 10h20" stroke="#2563EB" stroke-width="1.8"/><path d="M6 15h4M14 15h4" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>',
        },
        {
            id: 'usdt',
            name: 'USDT 加密支付',
            range: 'R$200 - R$100,000',
            iconBg: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            icon: '<circle cx="12" cy="12" r="10" stroke="#D97706" stroke-width="1.8"/><path d="M8 9h8M12 9v6M9 12h6" stroke="#D97706" stroke-width="1.8" stroke-linecap="round"/>',
        },
    ]

    const selectedChannel = ref('pix')

    // 选中快捷金额
    const selectPreset = (amt) => {
        selectedAmount.value = amt
        customAmount.value = ''
        customActive.value = false
    }

    // 手动输入时取消快捷选中
    const onInputFocus = () => {
        inputFocused.value = true
        customActive.value = true
        selectedAmount.value = null
    }

    const onCustomInput = () => {
        customActive.value = !!customAmount.value
        if (customActive.value) selectedAmount.value = null
    }

    // 最终充值金额
    const finalAmount = computed(() => {
        if (customActive.value && customAmount.value) return Number(customAmount.value)
        return selectedAmount.value
    })

    const canSubmit = computed(() => !!finalAmount.value && finalAmount.value > 0)

    const handleSubmit = () => {
        if (!canSubmit.value) return
        console.log('充值金额:', finalAmount.value, '通道:', selectedChannel.value)
        // TODO: 调用充值接口
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
</style>
