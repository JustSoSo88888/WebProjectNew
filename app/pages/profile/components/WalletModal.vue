<template>
    <van-popup v-model:show="visible" position="bottom" class="bottom-popup" safe-area-inset-bottom>
        <div class="modal modal-wallet">
            <div class="modal-header">
                <span class="modal-title">银行卡设置</span>
                <button class="modal-close" @click="close" aria-label="关闭">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <!-- Username -->
                <div class="form-group">
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor"
                                      stroke-width="1.8" stroke-linecap="round"/>
                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
                            </svg>
                        </div>
                        <input v-model="form.name" type="text" class="form-input" placeholder="用户名"/>
                    </div>
                </div>

                <!-- Phone -->
                <div class="form-group">
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                                      stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="country-code">+55</span>
                        <input v-model="form.phone" type="tel" class="form-input" placeholder="手机号"/>
                    </div>
                </div>

                <!-- Bank Select -->
                <div class="form-group">
                    <div class="input-wrapper" @click="showPicker = true">
                        <div class="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"
                                      stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <input v-model="bankName" type="text" class="form-input form-select" placeholder="选择银行账户" readonly />
                        <div class="select-arrow">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Bank Picker -->
                <van-popup v-model:show="showPicker" position="bottom">
                    <van-picker
                        :columns="bankColumns"
                        @confirm="onBankConfirm"
                        @cancel="showPicker = false"
                    />
                </van-popup>

                <!-- Card Number -->
                <div class="form-group">
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor"
                                      stroke-width="1.8"/>
                                <path d="M1 10h22" stroke="currentColor" stroke-width="1.8"/>
                            </svg>
                        </div>
                        <input v-model="form.cardNumber" type="text" class="form-input" placeholder="银行卡号"/>
                    </div>
                </div>

                <button class="confirm-btn" @click="submit">保存</button>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
    import {ref, watch, computed} from 'vue'

    const props = defineProps({
        modelValue: {
            type: Boolean,
            default: false
        },
        initialData: {
            type: Object,
            default: () => ({})
        }
    })

    const emit = defineEmits(['update:modelValue', 'submit'])

    const visible = ref(props.modelValue)
    const showPicker = ref(false)
    const form = ref({
        name: '',
        phone: '',
        bank: '',
        cardNumber: ''
    })

    const bankOptions = [
        { text: 'Banco do Brasil', value: 'bank1' },
        { text: 'Caixa Econômica', value: 'bank2' },
        { text: 'Itaú', value: 'bank3' },
        { text: 'Bradesco', value: 'bank4' },
        { text: 'Santander', value: 'bank5' }
    ]

    const bankColumns = computed(() => bankOptions.map(opt => ({ text: opt.text, value: opt.value })))

    const bankName = computed({
        get: () => {
            const selected = bankOptions.find(opt => opt.value === form.value.bank)
            return selected ? selected.text : ''
        },
        set: (val) => {
            const selected = bankOptions.find(opt => opt.text === val)
            if (selected) {
                form.value.bank = selected.value
            }
        }
    })

    const onBankConfirm = (value) => {
        const selected = bankOptions.find(opt => opt.text === value[0])
        if (selected) {
            form.value.bank = selected.value
        }
        showPicker.value = false
    }

    watch(() => props.modelValue, (val) => {
        visible.value = val
    })

    watch(visible, (val) => {
        emit('update:modelValue', val)
    })

    watch(() => props.initialData, (data) => {
        if (data && Object.keys(data).length > 0) {
            form.value = { ...data }
        }
    }, { immediate: true })

    const close = () => {
        visible.value = false
        showPicker.value = false
    }

    const submit = () => {
        if (!form.value.name || !form.value.phone || !form.value.bank || !form.value.cardNumber) {
            alert('请填写完整信息')
            return
        }
        emit('submit', {...form.value})
        close()
    }
</script>

<style scoped lang="scss">
    .modal {
        width: 100%;
        background: #fff;
        overflow: hidden;
        max-height: 90vh;
    }

    .modal-wallet {
        max-height: 80vh;
        overflow-y: auto;
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(16);
        border-bottom: rem(1) solid $color-border-light;
    }

    .modal-title {
        font-size: rem(16);
        font-weight: 600;
        color: $color-text-primary;
    }

    .modal-close {
        width: rem(32);
        height: rem(32);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: $color-bg-page;
        color: $color-text-secondary;
        cursor: pointer;

        svg {
            width: rem(16);
            height: rem(16);
        }
    }

    .modal-body {
        padding: rem(16);
    }

    .form-group {
        margin-bottom: rem(16);
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        border: rem(1) solid $color-border;
        border-radius: $radius-md;
        padding: 0 rem(12);
        transition: border-color 0.2s;

        &:focus-within {
            border-color: $color-primary;
        }
    }

    .input-icon {
        color: $color-text-muted;
        flex-shrink: 0;

        svg {
            width: rem(18);
            height: rem(18);
        }
    }

    .country-code {
        font-size: rem(14);
        color: $color-text-secondary;
        margin-left: rem(12);
        padding-right: rem(12);
        border-right: rem(1) solid $color-border-light;
    }

    .form-input {
        flex: 1;
        border: none;
        outline: none;
        padding: rem(12) rem(12);
        font-size: rem(14);
        color: $color-text-primary;
        background: transparent;

        &::placeholder {
            color: $color-text-placeholder;
        }

        &.form-select {
            appearance: none;
            cursor: pointer;
            user-select: none;
        }
    }

    .select-arrow {
        color: $color-text-muted;
        flex-shrink: 0;

        svg {
            width: rem(16);
            height: rem(16);
        }
    }

    .confirm-btn {
        width: 100%;
        padding: rem(14) 0;
        border-radius: $radius-md;
        background: $gradient-primary;
        color: #fff;
        font-size: rem(15);
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
        margin-top: rem(8);

        &:active {
            opacity: 0.9;
        }
    }

.bottom-popup {
  width: 100%;
  max-width: rem(375);
  left: 50%;
  margin-left: calc(rem(375) / -2);
  border-radius: rem(16) rem(16) 0 0;
}
</style>
