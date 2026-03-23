<template>
    <van-popup v-model:show="visible" position="bottom" class="bottom-popup" safe-area-inset-bottom>
        <div class="modal modal-password">
            <div class="modal-header">
                <span class="modal-title">{{ title }}</span>
                <button class="modal-close" @click="close" aria-label="关闭">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <!-- Old Password -->
                <div class="form-group">
                    <div class="input-wrapper">
                        <div class="input-icon"
                             :class="{ 'icon-trade': type === 'trade', 'icon-login': type === 'login' }">
                            <svg v-if="type === 'trade'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                                      stroke-width="1.8" stroke-linejoin="round"/>
                                <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.3"/>
                                <path d="M12 12v2M10 14h4" stroke="currentColor" stroke-width="1.5"
                                      stroke-linecap="round"/>
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                                      stroke-width="1.8" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <input v-model="form.oldPassword" type="password" class="form-input" placeholder="旧密码"/>
                    </div>
                </div>
                <!-- New Password -->
                <div class="form-group">
                    <div class="input-wrapper">
                        <div class="input-icon"
                             :class="{ 'icon-trade': type === 'trade', 'icon-login': type === 'login' }">
                            <svg v-if="type === 'trade'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                                      stroke-width="1.8" stroke-linejoin="round"/>
                                <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.3"/>
                                <path d="M12 12v2M10 14h4" stroke="currentColor" stroke-width="1.5"
                                      stroke-linecap="round"/>
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                                      stroke-width="1.8" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <input v-model="form.newPassword" type="password" class="form-input" placeholder="新密码"/>
                    </div>
                </div>
                <!-- Confirm Password -->
                <div class="form-group">
                    <div class="input-wrapper">
                        <div class="input-icon"
                             :class="{ 'icon-trade': type === 'trade', 'icon-login': type === 'login' }">
                            <svg v-if="type === 'trade'" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                                      stroke-width="1.8" stroke-linejoin="round"/>
                                <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.3"/>
                                <path d="M12 12v2M10 14h4" stroke="currentColor" stroke-width="1.5"
                                      stroke-linecap="round"/>
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                                      stroke-width="1.8" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <input v-model="form.confirmPassword" type="password" class="form-input" placeholder="确认新密码"/>
                    </div>
                </div>
                <button class="confirm-btn" @click="submit">确认</button>
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
        type: {
            type: String,
            default: 'trade' // 'trade' or 'login'
        }
    })

    const emit = defineEmits(['update:modelValue', 'submit'])

    const visible = ref(props.modelValue)
    const form = ref({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const title = computed(() => props.type === 'trade' ? '修改交易密码' : '修改登录密码')

    watch(() => props.modelValue, (val) => {
        visible.value = val
    })

    watch(visible, (val) => {
        emit('update:modelValue', val)
        if (!val) {
            // Reset form on close
            form.value = {oldPassword: '', newPassword: '', confirmPassword: ''}
        }
    })

    const close = () => {
        visible.value = false
    }

    const submit = () => {
        if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmPassword) {
            alert('请填写完整信息')
            return
        }
        if (form.value.newPassword !== form.value.confirmPassword) {
            alert('新密码与确认密码不一致')
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

    .modal-password {
        border-radius: $radius-xl $radius-xl 0 0;
        padding-bottom: env(safe-area-inset-bottom, 0);
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

        &.icon-trade {
            color: #D97706;
        }

        &.icon-login {
            color: #D97706;
        }
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
