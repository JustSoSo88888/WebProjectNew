<template>
    <div class="bank-info-page">
        <div class="form-card">
            <!-- 用户姓名 -->
            <div class="form-item">
                <div class="form-label">{{ $lang('姓名') }}</div>
                <div class="form-input" :class="{ focused: inputFocused.name }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" />
                            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </div>
                    <input v-model="form.name" :disabled="isEdit" type="text" class="input" :placeholder="$lang('请输入姓名')"
                        @focus="inputFocused.name = true" @blur="inputFocused.name = false" />
                </div>
            </div>

            <!-- 手机号 -->
            <div class="form-item">
                <div class="form-label">{{ $lang('手机号') }}</div>
                <div class="form-input phone-input" :class="{ focused: inputFocused.phone }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="area-code">+55</div>
                    <input v-model="form.phone" type="number" :disabled="isEdit" class="input" :placeholder="$lang('请输入手机号')"
                        @focus="inputFocused.phone = true" @blur="inputFocused.phone = false" />
                </div>
            </div>
            <div class="form-item">
                <div class="form-label">{{ $lang('银行卡号') }}</div>
                <div class="form-input" :class="{ focused: inputFocused.account }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" stroke-width="1.8" />
                            <path d="M1 10h22" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </div>
                    <input v-model="form.account" type="text" :disabled="isEdit" class="input" :placeholder="$lang('请输入银行卡号')"
                        @focus="inputFocused.account = true" @blur="inputFocused.account = false" />
                </div>
            </div>
            <div class="form-item">
                <div class="form-label">{{ $lang('类型') }}</div>
                <div class="form-input form-select" :class="{ focused: inputFocused.payWayType }"
                    @click="handleShowPicker">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"
                                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="select-value" :class="{ placeholder: !selectedBankName }">
                        {{ selectedBankName || $lang('请选择银行类型') }}
                    </div>
                    <div class="select-arrow">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- 账户号码 -->
            <!-- <div class="form-item">
                <div class="form-label">{{ $lang('账户号码') }}</div>
                <div class="form-input" :class="{ focused: inputFocused.account }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" stroke-width="1.8" />
                            <path d="M1 10h22" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </div>
                    <input v-model="form.account" type="text" class="input" :placeholder="$lang('请输入账户号码')"
                        @focus="inputFocused.account = true" @blur="inputFocused.account = false" />
                </div>
            </div> -->
        </div>

        <!-- 银行选择器 -->
        <van-popup overlay-class="popup-overlay" class="popup-overlay" v-model:show="showPicker" position="bottom"
            round>
            <van-picker :columns="bankColumns" class="popup-overlay" @confirm="onBankConfirm"
                @cancel="showPicker = false" :confirm-button-text="$lang('确认')" :cancel-button-text="$lang('取消')" />
        </van-popup>
        <!-- 提交按钮 -->
        <div class="submit-wrap">
            <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">
                {{ !isEdit ? $lang('提交') : $lang('请联系客服更改') }}
            </button>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { bankCardList, bindBankCard } from '~/api/member';
import { tokenChannelTypeConfigList } from '~/api/token_channel';

definePageMeta({ layout: 'second-page' })

const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const bankList = ref([])

onMounted(() => {
    getBankCardList();
    getTokenChannelTypeConfigList();
})

const getTokenChannelTypeConfigList = () => {
    tokenChannelTypeConfigList({}).then(res => {
        if (res.success) {
            bankList.value = res.data
        }
    })
}

const handleShowPicker = () => {
    if(isEdit.value) return
    showPicker.value = true
}
const getBankCardList = () => {
    showLoading($lang('加载中'))
    bankCardList({}).then(res => {
        hideLoading();
        if (res.success) {
            if (res.data.rows && res.data.rows.length > 0) {
                isEdit.value = true
                form.value.name = res.data.rows[0].user_name
                form.value.phone = res.data.rows[0].phone
                form.value.bank = res.data.rows[0].bank_name
                form.value.account = res.data.rows[0].bank_card_no
                form.value.payWayType = res.data.rows[0].pay_way_type
            } else {
                isEdit.value = false
            }
        } else {
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')
    })
}

const showPicker = ref(false)
const isEdit = ref(false)
const bankColumns = computed(() => bankList.value.map(bank => ({ text: bank.name, value: bank.id })))

const selectedBankName = computed(() => {
    const bank = bankList.value.find(b => b.id == form.value.payWayType)
    return bank ? bank.name : ''
})

const onBankConfirm = ({ selectedOptions }) => {
    form.value.payWayType = selectedOptions[0].value
    showPicker.value = false
}

const inputFocused = ref({
    name: false,
    phone: false,
    bank: true,
    account: false,
    payWayType: false,
})

const form = ref({
    name: '',
    phone: '',
    bank: 'PIX',
    account: '',
    payWayType: '',
})


const canSubmit = computed(() => {
    return form.value.name && form.value.phone  && form.value.account && form.value.payWayType && !isEdit.value
})

const handleSubmit = () => {
    if (!canSubmit.value) return
    let params = {
        phone: form.value.phone,
        bank_card_no: form.value.account,
        bank_name: form.value.bank,
        user_name: form.value.name,
        pay_way_type: form.value.payWayType
    }
    showLoading($lang('加载中'))
    bindBankCard(params).then(res => {
        hideLoading();
        if (res.success) {
            showMsg($lang('绑定成功'), 'success')
            setTimeout(() => {
                getBankCardList();
            }, 1000)
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
.popup-overlay {
    width: rem(375);
    left: calc(50% - rem(187.5));
}

.bank-info-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding: rem(20) rem(16) rem(100);
}

.form-card {
    background: #fff;
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
    padding: rem(16);
}

.form-item {
    &:not(:last-child) {
        margin-bottom: rem(16);
    }
}

.form-label {
    font-size: rem(14);
    font-weight: 500;
    color: $color-text-primary;
    margin-bottom: rem(8);
}

.form-input,
.form-select {
    border: rem(1.5) solid $color-border;
    border-radius: $radius-md;
    background: $color-bg-page;
    transition: border-color 0.2s, background 0.2s;

    &.focused {
        border-color: $color-primary;
        background: #fff;
    }
}

.form-input {
    display: flex;
    align-items: center;
    padding: 0 rem(14);

    .input-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: rem(20);
        height: rem(20);
        margin-right: rem(12);
        color: $color-text-muted;
        flex-shrink: 0;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    &.phone-input {
        .area-code {
            font-size: rem(15);
            font-weight: 500;
            color: $color-text-primary;
            padding-right: rem(12);
            border-right: rem(1) solid $color-border-light;
            margin-right: rem(12);
            line-height: rem(44);
        }
    }

    .input {
        flex: 1;
        border: none;
        outline: none;
        font-size: rem(15);
        color: $color-text-primary;
        background: transparent;
        padding: rem(12) 0;
        line-height: 1.5;

        &::placeholder {
            color: $color-text-placeholder;
        }
    }
}

.form-select {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    min-height: rem(48);

    .input-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: rem(20);
        height: rem(20);
        margin-right: rem(12);
        color: $color-text-muted;
        flex-shrink: 0;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .select-value {
        flex: 1;
        font-size: rem(15);
        color: $color-text-primary;
        line-height: 1.5;

        &.placeholder {
            color: $color-text-placeholder;
        }
    }

    .select-arrow {
        color: $color-text-muted;
        margin-left: rem(8);

        svg {
            width: rem(20);
            height: rem(20);
        }
    }
}

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
