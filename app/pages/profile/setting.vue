<template>
    <div class="setting-page">
        <!-- Settings List -->
        <div class="settings-list">
            <!-- 银行卡设置 -->
            <div class="settings-group">
                <div class="group-title">支付设置</div>
                <div class="setting-item" @click="navigateTo('/profile/wallet')">
                    <div class="item-info">
                        <div class="item-icon wallet-icon">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor"
                                      stroke-width="1.8"/>
                                <path d="M2 10h20" stroke="currentColor" stroke-width="1.8"/>
                            </svg>
                        </div>
                        <span class="item-label">银行卡设置</span>
                    </div>
                    <div class="item-action">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- 安全设置 -->
            <div class="settings-group">
                <div class="group-title">安全设置</div>
                <div class="setting-item" @click="openPasswordModal('trade')">
                    <div class="item-info">
                        <div class="item-icon security-icon">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                                      stroke-width="1.8" stroke-linejoin="round"/>
                                <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.3"/>
                                <path d="M12 12v2M10 14h4" stroke="currentColor" stroke-width="1.5"
                                      stroke-linecap="round"/>
                            </svg>
                        </div>
                        <span class="item-label">修改交易密码</span>
                    </div>
                    <div class="item-action">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div class="setting-item" @click="openPasswordModal('login')">
                    <div class="item-info">
                        <div class="item-icon security-icon">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                                      stroke-width="1.8" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="item-label">修改登录密码</span>
                    </div>
                    <div class="item-action">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>



        <!-- Password Modal (Trade/Login) -->
        <PasswordModal v-model="showPasswordModal" :type="passwordType" @submit="savePassword" />

    </div>
</template>

<script setup>
    import {ref} from 'vue'
    import {navigateTo} from '#imports'
    import PasswordModal from './components/PasswordModal.vue'

    definePageMeta({ layout: 'second-page' })

    const showPasswordModal = ref(false)
    const passwordType = ref('trade')
    const passwordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

    const openPasswordModal = (type) => {
        passwordType.value = type
        passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
        showPasswordModal.value = true
    }

    const savePassword = () => {
        if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
            alert('请填写完整信息')
            return
        }
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
            alert('新密码与确认密码不一致')
            return
        }
        console.log('Saving password:', passwordForm.value)
        alert('密码修改成功')
        showPasswordModal.value = false
    }

    const confirmLogout = () => {
        showLogoutConfirm.value = true
    }
</script>

<style scoped lang="scss">
    .setting-page {
        min-height: 100vh;
        background: $color-bg-page;
    }

    // Settings List
    .settings-list {
        margin: rem(12) rem(16);
    }

    .settings-group {
        margin-bottom: rem(16);
        background: #fff;
        border-radius: $radius-lg;
        box-shadow: $shadow-sm;
        overflow: hidden;
    }

    .group-title {
        padding: rem(12) rem(16);
        font-size: rem(12);
        color: $color-text-muted;
        background: $color-bg-page;
        border-bottom: rem(1) solid $color-border-light;
    }

    .setting-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(14) rem(16);
        cursor: pointer;
        transition: background 0.15s;

        &:active {
            background: $color-bg-hover;
        }

        &:not(:last-child) {
            border-bottom: rem(1) solid $color-border-light;
        }

        &.logout-item {
            .item-label {
                color: $color-danger;
            }

            .item-icon {
                color: $color-danger;
            }
        }
    }

    .item-info {
        display: flex;
        align-items: center;
        gap: rem(12);
    }

    .item-icon {
        width: rem(36);
        height: rem(36);
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $color-bg-page;

        svg {
            width: rem(18);
            height: rem(18);
        }

        &.wallet-icon {
            color: #D97706;
            background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
        }

        &.security-icon {
            color: #D97706;
            background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
        }

        &.logout-icon {
            color: $color-danger;
            background: linear-gradient(135deg, #FFF1F2, #FFE4E6);
        }
    }

    .item-label {
        font-size: rem(14);
        color: $color-text-primary;
        font-weight: 500;
    }

    .item-action {
        color: $color-text-muted;

        svg {
            width: rem(20);
            height: rem(20);
        }
    }

    // Modals (Using Vant Popup)
    .modal {
        width: 100%;
        background: #fff;
        overflow: hidden;
        max-height: 90vh; // Prevent going off screen

        &-sm {
            border-radius: $radius-xl;
            width: 100%;
            align-items: center;
            max-height: auto;
        }
    }

    // Components are now imported separately, styles are in component files

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





    .logout-icon {
        width: rem(56);
        height: rem(56);
        border-radius: 50%;
        background: $color-danger-bg;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto rem(12);

        svg {
            width: rem(26);
            height: rem(26);
        }
    }

    .logout-title {
        font-size: rem(16);
        font-weight: 600;
        color: $color-text-primary;
        margin-bottom: rem(20);
    }

    .logout-actions {
        display: flex;
        gap: rem(10);
    }

    .logout-cancel,
    .logout-confirm {
        flex: 1;
        padding: rem(12) 0;
        border-radius: $radius-md;
        font-size: rem(14);
        font-weight: 500;
        cursor: pointer;
        transition: $transition-fast;
    }

    .logout-cancel {
        background: $color-bg-page;
        color: $color-text-secondary;
        border: rem(1) solid $color-border;
    }

    .logout-confirm {
        background: $color-danger;
        color: #fff;
    }
</style>
