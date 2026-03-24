<template>
    <div class="profile-page">

        <!-- ① 顶部头部区域 -->
        <div class="profile-header">
            <div class="header-bg"></div>
            <div class="user-info">
                <div class="avatar-wrap">
                    <img class="avatar" :src="userInfo.avatar" alt="用户头像" />
                    <div class="avatar-badge">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                fill="#F59E0B" stroke="#F59E0B" stroke-width="1" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
                <div class="user-meta">
                    <div class="user-account">{{ userData.id }}</div>
                    <div class="user-tags">
                        <span class="tag tag--credit">
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
                                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                            </svg>
                            信用分 {{ userInfo.creditScore }}
                        </span>
                        <span class="tag tag--level">Lv.{{ userData.level }}</span>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="action-btn action-btn--recharge" @click="navigateTo('/recharge')" aria-label="充值">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        充值
                    </button>
                    <button class="action-btn action-btn--withdraw" @click="navigateTo('/withdrawal')" aria-label="提现">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 19V5M5 12l7 7 7-7" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        提现
                    </button>
                </div>
            </div>
        </div>

        <!-- ② 钱包余额卡片 -->
        <div class="wallet-card">
            <div class="wallet-row">
                <div class="wallet-item">
                    <div class="wallet-label">钱包余额</div>
                    <div class="wallet-amount" translate="no">R${{ balance }}</div>
                </div>
                <div class="wallet-divider"></div>
                <div class="wallet-item">
                    <div class="wallet-label">保证金</div>
                    <div class="wallet-amount wallet-amount--warning">R${{ userInfo.deposit }}</div>
                </div>
                <div class="wallet-divider"></div>
                <div class="wallet-item">
                    <div class="wallet-label">等级生效日期</div>
                    <div class="wallet-date">{{ userInfo.levelDate }}</div>
                </div>
            </div>
        </div>

        <!-- ③ 收益统计 -->
        <div class="earnings-card">
            <div class="card-title">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor"
                        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                收益统计
            </div>
            <div class="time-tabs">
                <button v-for="(tab, index) in timeTabs" :key="tab.key" class="time-tab"
                    :class="{ active: activeTimeTab === tab.key }" @click="switchTab(tab.key, index)">{{ tab.label }}
                </button>
            </div>
            <div class="earnings-grid-wrap">
                <Transition :name="slideDirection" mode="out-in">
                    <div :key="activeTimeTab" class="earnings-grid">
                        <div class="earnings-item">
                            <div class="earnings-label">团队任务收入</div>
                            <div class="earnings-val earnings-val--blue">R${{
                                currentEarnings.taskIncome }}</div>
                        </div>
                        <div class="earnings-item">
                            <div class="earnings-label">团队邀请收入</div>
                            <div class="earnings-val earnings-val--purple">R${{
                                currentEarnings.inviteIncome }}</div>
                        </div>
                        <div class="earnings-item earnings-item--full">
                            <div class="earnings-label">总收入</div>
                            <div class="earnings-val earnings-val--green">R${{ currentEarnings.total
                                }}</div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- ④ 功能菜单 -->
        <div class="menu-card">
            <div v-for="item in menuItems" :key="item.key" class="menu-item"
                :class="{ 'menu-item--danger': item.danger }" @click="handleMenu(item)" role="button"
                :aria-label="item.label" tabindex="0" @keydown.enter="handleMenu(item)">
                <div class="menu-icon" :style="{ background: item.iconBg }">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" v-html="item.icon"></svg>
                </div>
                <span class="menu-label">{{ item.label }}</span>
                <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
        </div>

        <!-- ⑤ 语言切换弹窗 -->
        <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="switchLang" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#imports'
import LangModal from '~/components/LangModal'
import { getBalance, loginOut } from '~/api/member'
import { storage } from '~/utils/index'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
const $dialog = nuxtApp.$dialog


definePageMeta({ layout: 'default' })
onMounted(() => {
    init();
})
//初始化
const userData = ref({})
const init = () => {
    getBalanceData();
    let user_data = storage.get('user_data') ? JSON.parse(storage.get('user_data')):null;
    if(user_data){
        userData.value = user_data
        
    }
}
// 语言弹窗
const showLang = ref(false)
const currentLang = ref(storage.get('locale') || 'pt')
const switchLang = (lang) => {
    if (currentLang.value == lang) return;
    storage.set('locale', lang)
    currentLang.value = lang
    location.reload()
}

//获取余额

const balance = ref(0)
const getBalanceData = () => {
    showLoading($lang('加载中'))
    getBalance({}).then(res => {
        hideLoading();
        if(res.success){
            balance.value = res.data.amount
        }else{
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')

    })
}



// 用户信息
const userInfo = ref({
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile&backgroundColor=b6e3f4',
    account: 'user_8823',
    creditScore: 98,
    level: 3,
    balance: '2,580.00',
    deposit: '500.00',
    levelDate: '2026-06-18',
})



// 收益统计
const activeTimeTab = ref('today')
const slideDirection = ref('slide-right')
const currentTabIndex = ref(1)
const timeTabs = [
    { key: 'yesterday', label: '昨天' },
    { key: 'today', label: '今天' },
    { key: 'week', label: '本星期' },
    { key: 'month', label: '本月' },
]

const earningsData = {
    yesterday: { taskIncome: '320.00', inviteIncome: '80.00', total: '400.00' },
    today: { taskIncome: '150.00', inviteIncome: '50.00', total: '200.00' },
    week: { taskIncome: '1,280.00', inviteIncome: '420.00', total: '1,700.00' },
    month: { taskIncome: '5,600.00', inviteIncome: '1,800.00', total: '7,400.00' },
}

const currentEarnings = computed(() => earningsData[activeTimeTab.value])

const switchTab = (key, index) => {
    if (key === activeTimeTab.value) return
    slideDirection.value = index > currentTabIndex.value ? 'slide-left' : 'slide-right'
    currentTabIndex.value = index
    activeTimeTab.value = key
}


// 菜单
const menuItems = [
    {
        key: 'settings',
        label: '设置',
        iconBg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
        icon: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#2563EB" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#2563EB" stroke-width="1.8"/>',
        route: '/profile/setting',
    },
    {
        key: 'address',
        label: '地址',
        iconBg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)',
        icon: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#059669" stroke-width="1.8"/><circle cx="12" cy="10" r="3" stroke="#059669" stroke-width="1.8"/>',
        route: '/profile/address',
    },
    {
        key: 'finance',
        label: '财务记录',
        iconBg: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)',
        icon: '<rect x="2" y="5" width="20" height="14" rx="2" stroke="#D97706" stroke-width="1.8"/><path d="M2 10h20" stroke="#D97706" stroke-width="1.8"/><path d="M6 15h4M14 15h4" stroke="#D97706" stroke-width="1.8" stroke-linecap="round"/>',
        route: '/profile/finance',
    },
    {
        key: 'trade',
        label: '交易记录',
        iconBg: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
        icon: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
        route: '/profile/trade',
    },
    {
        key: 'lucky',
        label: '幸运大转盘',
        iconBg: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)',
        icon: '<circle cx="12" cy="12" r="10" stroke="#DC2626" stroke-width="1.8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="3" stroke="#DC2626" stroke-width="1.8"/>',
        route: '/lucky',
        badge: 'NEW',
    },
    {
        key: 'coupon',
        label: '优惠券',
        iconBg: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)',
        icon: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="#D97706" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7" cy="7" r="1.5" fill="#D97706"/>',
        route: '/profile/coupon',
        badge: '3',
    },
    {
        key: 'message',
        label: '信息',
        iconBg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
        icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#2563EB" stroke-width="1.8" stroke-linejoin="round"/>',
        route: '/message',
        badge: '5',
    },
    {
        key: 'invite',
        label: '邀请',
        iconBg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)',
        icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="#059669" stroke-width="1.8"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/>',
        route: '/team?tab=invite',
    },
    {
        key: 'lang',
        label: '语言切换',
        iconBg: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
        icon: '<circle cx="12" cy="12" r="10" stroke="#7C3AED" stroke-width="1.8"/><path d="M12 2c-2.5 3-4 5.5-4 10s1.5 7 4 10M12 2c2.5 3 4 5.5 4 10s-1.5 7-4 10M2 12h20" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round"/>',
        action: 'lang',
    },
    {
        key: 'logout',
        label: '退出登录',
        iconBg: 'linear-gradient(135deg,#FFF1F2,#FFE4E6)',
        icon: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
        action: 'logout',
        danger: true,
    },
]

const handleMenu = (item) => {
    if (item.action === 'lang') {
        showLang.value = true;
        return
    }
    if (item.action === 'logout') {
        $dialog.confirm({
            title: $lang('提示'),
            message: $lang('确认退出登录？'),
        }).then(() => {
            showLoading($lang('加载中'))
            loginOut({}).then(res => {
                hideLoading();
                if (res.success) {
                    showMsg($lang('退出成功'), 'success')
                    setTimeout(() => {
                        loginOutDialog();
                        navigateTo('/login/login');
                    }, 1500)
                } else {
                    showMsg(res.message, 'fail')
                }

            }).catch(error => {
                hideLoading();
                showMsg(error.message, 'fail')
            })
        }).catch(() => {
        })
        return
    }
    if (item.route) navigateTo(item.route)
}

const confirmLogout = () => {
    navigateTo('/login/login')
}
</script>

<style scoped lang="scss">
.profile-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding-bottom: rem(24);
}

// ── Header ──────────────────────────────────────────────────
.profile-header {
    position: relative;
    padding: rem(24) rem(16) rem(20);
    background: $gradient-primary;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -40%;
        right: -20%;
        width: rem(200);
        height: rem(200);
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -30%;
        left: -10%;
        width: rem(150);
        height: rem(150);
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
    }
}

.user-info {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: rem(12);
}

.avatar-wrap {
    position: relative;
    flex-shrink: 0;
}

.avatar {
    width: rem(60);
    height: rem(60);
    border-radius: 50%;
    border: rem(2) solid rgba(255, 255, 255, 0.6);
    object-fit: cover;
    background: #fff;
}

.avatar-badge {
    position: absolute;
    bottom: rem(-2);
    right: rem(-2);
    width: rem(20);
    height: rem(20);
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-sm;

    svg {
        width: rem(12);
        height: rem(12);
    }
}

.user-meta {
    flex: 1;
    min-width: 0;
}

.user-account {
    font-size: rem(16);
    font-weight: 600;
    color: #fff;
    margin-bottom: rem(6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-tags {
    display: flex;
    gap: rem(6);
    flex-wrap: wrap;
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: rem(3);
    padding: rem(2) rem(8);
    border-radius: $radius-full;
    font-size: rem(11);
    font-weight: 500;

    svg {
        width: rem(11);
        height: rem(11);
    }

    &--credit {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
    }

    &--level {
        background: #F59E0B;
        color: #fff;
    }
}

.header-actions {
    display: flex;
    flex-direction: column;
    gap: rem(6);
    flex-shrink: 0;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: rem(4);
    padding: rem(6) rem(12);
    border-radius: $radius-full;
    font-size: rem(12);
    font-weight: 500;
    cursor: pointer;
    transition: $transition-fast;
    min-width: rem(64);
    justify-content: center;

    svg {
        width: rem(13);
        height: rem(13);
    }

    &--recharge {
        background: #fff;
        color: $color-primary;

        &:active {
            opacity: 0.85;
        }
    }

    &--withdraw {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        border: rem(1) solid rgba(255, 255, 255, 0.4);

        &:active {
            opacity: 0.85;
        }
    }
}

// ── Wallet Card ──────────────────────────────────────────────
.wallet-card {
    margin: rem(14) rem(14) 0;
    background: $color-bg-card;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    padding: rem(16);
}

.wallet-row {
    display: flex;
    align-items: center;
}

.wallet-item {
    flex: 1;
    text-align: center;
}

.wallet-divider {
    width: rem(1);
    height: rem(36);
    background: $color-border;
}

.wallet-label {
    font-size: rem(11);
    color: $color-text-muted;
    margin-bottom: rem(4);
}

.wallet-amount {
    font-size: rem(16);
    font-weight: 700;
    color: $color-text-primary;

    &--warning {
        color: $color-warning;
    }
}

.wallet-date {
    font-size: rem(12);
    font-weight: 600;
    color: $color-primary;
}

// ── Earnings Card ────────────────────────────────────────────
.earnings-card {
    margin: rem(12) rem(14) 0;
    background: $color-bg-card;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    padding: rem(16);
}

.card-title {
    display: flex;
    align-items: center;
    gap: rem(6);
    font-size: rem(14);
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: rem(12);

    svg {
        width: rem(16);
        height: rem(16);
        color: $color-primary;
    }
}

.time-tabs {
    display: flex;
    gap: rem(6);
    margin-bottom: rem(14);
    background: $color-bg-page;
    border-radius: $radius-md;
    padding: rem(3);
}

.time-tab {
    flex: 1;
    padding: rem(6) 0;
    border-radius: rem(7);
    font-size: rem(12);
    font-weight: 500;
    color: $color-text-secondary;
    cursor: pointer;
    transition: $transition-fast;
    text-align: center;

    &.active {
        background: #fff;
        color: $color-primary;
        font-weight: 600;
        box-shadow: $shadow-xs;
    }
}

.earnings-grid-wrap {
    position: relative;
    overflow: hidden;
}

.earnings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: rem(10);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.25s ease-out;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(rem(30));
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(rem(-30));
}

.slide-right-enter-from {
    opacity: 0;
    transform: translateX(rem(-30));
}

.slide-right-leave-to {
    opacity: 0;
    transform: translateX(rem(30));
}

.earnings-item {
    background: $color-bg-page;
    border-radius: $radius-md;
    padding: rem(12);

    &--full {
        grid-column: 1 / -1;
        background: linear-gradient(135deg, #EFF6FF, #F5F3FF);
    }
}

.earnings-label {
    font-size: rem(11);
    color: $color-text-muted;
    margin-bottom: rem(4);
}

.earnings-val {
    font-size: rem(18);
    font-weight: 700;

    &--blue {
        color: $color-primary;
    }

    &--purple {
        color: #7C3AED;
    }

    &--green {
        color: $color-success;
    }
}

// ── Menu Card ────────────────────────────────────────────────
.menu-card {
    margin: rem(12) rem(14) 0;
    background: $color-bg-card;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    overflow: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: rem(12);
    padding: rem(14) rem(16);
    cursor: pointer;
    transition: background 0.15s ease;
    border-bottom: rem(1) solid $color-border-light;

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background: $color-bg-hover;
    }

    &--danger .menu-label {
        color: $color-danger;
    }

    &--danger .menu-arrow {
        color: $color-danger;
    }
}

.menu-icon {
    width: rem(36);
    height: rem(36);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
        width: rem(18);
        height: rem(18);
    }
}

.menu-label {
    flex: 1;
    font-size: rem(14);
    color: $color-text-primary;
    font-weight: 500;
}

.menu-badge {
    font-size: rem(10);
    font-weight: 600;
    padding: rem(2) rem(6);
    border-radius: $radius-full;
    background: $color-danger;
    color: #fff;
    margin-right: rem(4);
}

.menu-arrow {
    width: rem(16);
    height: rem(16);
    color: $color-text-muted;
}

// ── Modal ────────────────────────────────────────────────────
// .modal-overlay is no longer used directly in this file as popups are now components

.modal-body {
    padding: rem(16);

    &--center {
        text-align: center;
        padding: rem(24) rem(16);
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

    &:active {
        opacity: 0.9;
    }
}


.lang-flag {
    font-size: rem(22);
    line-height: 1;
}

.lang-name {
    flex: 1;
    font-size: rem(14);
    color: $color-text-primary;
    text-align: left;
}

.lang-check {
    width: rem(18);
    height: rem(18);
}

// ── Logout Modal ─────────────────────────────────────────────
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
    margin-bottom: rem(6);
}

.logout-desc {
    font-size: rem(13);
    color: $color-text-muted;
    margin-bottom: rem(20);
}

.logout-actions {
    display: flex;
    gap: rem(10);
}

.logout-cancel {
    flex: 1;
    padding: rem(12) 0;
    border-radius: $radius-md;
    background: $color-bg-page;
    color: $color-text-secondary;
    font-size: rem(14);
    font-weight: 500;
    cursor: pointer;
    border: rem(1) solid $color-border;
    transition: $transition-fast;

    &:active {
        background: $color-border;
    }
}

.logout-confirm {
    flex: 1;
    padding: rem(12) 0;
    border-radius: $radius-md;
    background: $color-danger;
    color: #fff;
    font-size: rem(14);
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:active {
        opacity: 0.9;
    }
}
</style>
