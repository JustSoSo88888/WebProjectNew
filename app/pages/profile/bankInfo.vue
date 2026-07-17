<template>
    <div class="bank-info-page">
        <div class="form-card">
            

            

            <div class="form-item">
                <div class="form-label">{{ $lang('银行卡号') }}<span style="color: red;">*</span></div>
                <div class="form-input" :class="{ focused: inputFocused.bank_card_no }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" stroke-width="1.8" />
                            <path d="M1 10h22" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </div>
                    <input v-model="form.bank_card_no" type="tel" inputmode="numeric" pattern="[0-9]*"
                        :disabled="isEdit" class="input" :placeholder="$lang('请输入银行卡号')"
                        @input="handleBankCardInput" @focus="inputFocused.bank_card_no = true"
                        @blur="inputFocused.bank_card_no = false" />
                </div>
            </div>

            <div class="form-item">
                <div class="form-label">{{ $lang('银行名称') }}<span style="color: red;">*</span></div>
                <div class="form-input" :class="{ focused: inputFocused.bank_name }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"
                                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <input v-model="form.bank_name" type="text" :disabled="isEdit" class="input"
                        :placeholder="$lang('请输入银行名称')" @focus="inputFocused.bank_name = true"
                        @blur="inputFocused.bank_name = false" />
                </div>
            </div>

            <div class="form-item">
                <div class="form-label">{{ $lang('手机号') }}<span style="color: red;">*</span></div>
                <div class="form-input phone-input" :class="{ focused: inputFocused.phone }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <input v-model="form.phone" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="19"
                        :disabled="isEdit" class="input" :placeholder="$lang('请输入手机号')" @input="handlePhoneInput"
                        @focus="inputFocused.phone = true" @blur="inputFocused.phone = false" />
                </div>
            </div>

            <div class="form-item">
                <div class="form-label">{{ $lang('用户名称') }}<span style="color: red;">*</span></div>
                <div class="form-input" :class="{ focused: inputFocused.user_name }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" />
                            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </div>
                    <input v-model="form.user_name" :disabled="isEdit" type="text" class="input"
                        :placeholder="$lang('请输入用户名称')" @focus="inputFocused.user_name = true"
                        @blur="inputFocused.user_name = false" />
                </div>
            </div>

            <div class="form-item">
                <div class="form-label">{{ $lang('邮箱') }}</div>
                <div class="form-input" :class="{ focused: inputFocused.mail }">
                    <div class="input-icon">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                                stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                            <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <input v-model="form.mail" type="text" :disabled="isEdit" class="input"
                        :placeholder="$lang('请输入邮箱')" @focus="inputFocused.mail = true"
                        @blur="inputFocused.mail = false" />
                </div>
            </div>
        </div>
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

definePageMeta({ layout: 'second-page' })

const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

onMounted(() => {
    getBankCardList();
})

const getBankCardList = () => {
    showLoading($lang('加载中'))
    bankCardList({}).then(res => {
        hideLoading();
        if (res.success) {
            if (res.data.rows && res.data.rows.length > 0) {
                isEdit.value = true
                form.value.user_name = res.data.rows[0].user_name
                form.value.phone = res.data.rows[0].phone
                form.value.bank_name = res.data.rows[0].bank_name
                form.value.bank_card_no = res.data.rows[0].bank_card_no
                form.value.mail = res.data.rows[0].mail
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


const isEdit = ref(false)

const inputFocused = ref({
    user_name: false,
    phone: false,
    bank_name: false,
    bank_card_no: false,
    mail: false,
})

const form = ref({
    user_name: '',
    phone: '',
    mail: '',
    bank_card_no: '',
    bank_name: '',
})

const handlePhoneInput = () => {
    form.value.phone = String(form.value.phone).replace(/\D/g, '').slice(0, 19)
}

const handleBankCardInput = () => {
    form.value.bank_card_no = String(form.value.bank_card_no).replace(/\D/g, '')
}

const canSubmit = computed(() => {
    return form.value.user_name &&
        form.value.phone &&
        String(form.value.phone).length < 20 &&
        /^\d+$/.test(form.value.phone) &&
        form.value.bank_card_no &&
        /^\d+$/.test(form.value.bank_card_no) &&
        form.value.bank_name &&
        !isEdit.value

})

const handleSubmit = () => {
    if (!canSubmit.value) return
    let params = {
        phone: '92' +form.value.phone,
        mail: form.value.mail,
        bank_card_no: form.value.bank_card_no,
        bank_name: form.value.bank_name,
        user_name: form.value.user_name,
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
