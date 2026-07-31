<template>
    <div class="profile-page">
        <section class="profile-account-card">
            <div class="profile-heading-row">
                <div class="profile-heading-copy">
                    <span>{{ $lang('个人中心') }}</span>
                    <h1>{{ userData.phone || userData.id || '-' }}</h1>
                </div>
                <button type="button" class="user-id" @click="copyText(userData.id)">
                    <span>ID:{{ userData.id || '-' }}</span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor"
                            stroke-width="1.8" stroke-linecap="round"></path>
                    </svg>
                </button>
            </div>

            <div class="profile-balance-block">
                <div class="balance-copy">
                    <span>{{ $lang('余额') }}</span>
                    <strong translate="no">Rs {{ formatAmount(availableBalance) }}</strong>
                </div>
                <button type="button" class="balance-refresh" @click="getBalanceData" :aria-label="$lang('余额')">
                    <van-icon name="replay"></van-icon>
                </button>
            </div>

            <div class="profile-quick-actions">
                <button type="button" class="quick-action quick-action--dark" @click="navigateTo('/profile/withdrawal')">
                    {{ $lang('提现') }}
                </button>
                <button type="button" class="quick-action" @click="navigateTo('/profile/recharge')">
                    {{ $lang('充值') }}
                </button>
            </div>
        </section>

        <!-- ③ 收益统计 -->
        <section class="earnings-card">
            <div class="profile-section-title">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor"
                        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                {{ $lang('收益统计') }}
            </div>
            <div class="earnings-grid-wrap">
                <Transition mode="out-in">
                    <div class="earnings-grid">
                        <div class="earnings-item">
                            <div class="earnings-label">{{ $lang('昨日收入') }}</div>
                            <div class="earnings-val" translate="no">Rs {{ formatAmount(awardTotalData.yesterday_income) }}</div>
                        </div>
                        <div class="earnings-item">
                            <div class="earnings-label">{{ $lang('今日收入') }}</div>
                            <div class="earnings-val" translate="no">Rs {{ formatAmount(awardTotalData.today_income) }}</div>
                        </div>
                        <div class="earnings-item">
                            <div class="earnings-label">{{ $lang('7日收入') }}</div>
                            <div class="earnings-val" translate="no">Rs {{ formatAmount(awardTotalData.week_income) }}</div>
                        </div>
                        <div class="earnings-item">
                            <div class="earnings-label">{{ $lang('本月收入') }}</div>
                            <div class="earnings-val" translate="no">Rs {{ formatAmount(awardTotalData.month_income) }}</div>
                        </div>
                        <div class="earnings-item earnings-item--full">
                            <div class="earnings-label">{{ $lang('总收入') }}</div>
                            <div class="earnings-val earnings-val--total" translate="no">Rs {{ formatAmount(awardTotalData.total_income) }}</div>
                        </div>
                    </div>
                </Transition>
            </div>
        </section>

        <!-- ④ 功能菜单 -->
        <section class="menu-card">
            <div class="profile-menu-grid">
                <button v-for="item in normalMenuItems" :key="item.key" type="button" class="profile-menu-tile"
                    :aria-label="item.label" @click="handleMenu(item)">
                    <span class="menu-icon" :style="{ '--icon-bg': item.iconBg, '--icon-color': item.iconColor }">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" v-html="item.icon"></svg>
                    </span>
                    <span class="menu-label">{{ item.label }}</span>
                    <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                            stroke-linejoin="round"></path>
                    </svg>
                </button>
            </div>

            <button v-if="logoutMenuItem" type="button" class="profile-menu-logout"
                :aria-label="logoutMenuItem.label" @click="handleMenu(logoutMenuItem)">
                <span class="menu-icon" :style="{ '--icon-bg': logoutMenuItem.iconBg, '--icon-color': logoutMenuItem.iconColor }">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" v-html="logoutMenuItem.icon"></svg>
                </span>
                <span class="menu-label">{{ logoutMenuItem.label }}</span>
                <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </svg>
            </button>
        </section>

        <!-- ⑤ 语言切换弹窗 -->
        <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="switchLang" />

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#imports'
import LangModal from '~/components/LangModal'
import { getBalance, loginOut, awardTotal } from '~/api/member'
import { storage } from '~/utils/index'
import { levelConfigList } from '~/api/level'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
const $dialog = nuxtApp.$dialog


definePageMeta({ layout: 'default' })
onMounted(() => {
    init();
})
//初始化
const userData = ref({})
const formatAmount = (amount) => {
    const value = Number.parseFloat(amount)
    return Number.isFinite(value) ? value : 0
}
const init = () => {
    getBalanceData();
    let user_data = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : null;
    if (user_data) {
        userData.value = user_data
    }
    getAwardTotal();
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

const awardTotalData = ref({
    meal_referral_income: 0,
    month_income: 0,
    order_referral_income: 0,
    today_income: 0,
    total_income: 0,
    week_income: 0,
    yesterday_income: 0
})
const getAwardTotal = () => {
    showLoading($lang('加载中'))
    awardTotal({}).then(res => {
        hideLoading();
        if (res.success) {
            awardTotalData.value = res.data
        } else {
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')
    })
}

//获取余额
const withdrawalOrderCacheKey = 'withdrawal_orders'
const balance = ref(0)
const cachedWithdrawalOrders = ref([])
const balanceData = ref({})
const levelData = ref({
    name: ''
})
const pendingWithdrawalAmount = computed(() => {
    return cachedWithdrawalOrders.value
        .filter(order => order.status === 'processing')
        .reduce((total, order) => total + formatAmount(order.amount), 0)
})
const availableBalance = computed(() => {
    return Math.max(formatAmount(balance.value) - pendingWithdrawalAmount.value, 0)
})
const refreshWithdrawalOrders = () => {
    try {
        const cache = storage.get(withdrawalOrderCacheKey)
        const orders = cache ? JSON.parse(cache) : []
        cachedWithdrawalOrders.value = Array.isArray(orders) ? orders : []
    } catch (_error) {
        cachedWithdrawalOrders.value = []
    }
}
const getBalanceData = () => {
    refreshWithdrawalOrders()
    showLoading($lang('加载中'))
    getBalance({}).then(res => {
        hideLoading();
        if (res.success) {
            balance.value = formatAmount(res.data.amount)
            balanceData.value = res.data
            handlelevelConfigList(res.data.level);

        } else {
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')

    })
}

const handlelevelConfigList = (level) => {
    levelConfigList({}).then(res => {
        if (res.success) {
            let levelList = res.data.level_configs || []
            let levelArr = levelList.filter(item => item.level == level)
            levelData.value = levelArr[0]
        }

    })
}


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
        label: $lang('设置'),
        iconBg: '#F3F4F6',
        iconColor: '#333333',
        icon: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.8"/>',
        route: '/profile/setting',
    },
    {
        key: 'finance',
        label: $lang('财务记录'),
        iconBg: '#F3F4F6',
        iconColor: '#333333',
        icon: '<rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M2 10h20" stroke="currentColor" stroke-width="1.8"/><path d="M6 15h4M14 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
        route: '/profile/finance',
    },
    {
        key: 'trade',
        label: $lang('交易记录'),
        iconBg: '#F3F4F6',
        iconColor: '#525252',
        icon: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
        route: '/profile/trade',
    },
    {
        key: 'lang',
        label: $lang('语言'),
        iconBg: '#F3F4F6',
        iconColor: '#525252',
        icon: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><path d="M12 2c-2.5 3-4 5.5-4 10s1.5 7 4 10M12 2c2.5 3 4 5.5 4 10s-1.5 7-4 10M2 12h20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
        action: 'lang',
    },
    {
        key: 'logout',
        label: $lang('退出登录'),
        iconBg: '#FEF2F2',
        iconColor: '#DC2626',
        icon: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
        action: 'logout',
        danger: true,
    },
]

const normalMenuItems = computed(() => menuItems.filter(item => !item.danger))
const logoutMenuItem = computed(() => menuItems.find(item => item.danger))

const handleMenu = (item) => {
    if (item.action === 'lang') {
        showLang.value = true;
        return
    }
    if (item.action === 'logout') {
        $dialog.confirm({
            title: $lang('提示'),
            message: $lang('确认退出登录？'),
            confirmText: $lang('确认'),
            cancelText: $lang('取消')
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
async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text)
        showMsg($lang('复制成功'), 'success')
    } catch {
        showMsg($lang('复制失败，请手动复制'), 'fail')
    }
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/config' as *;

.profile-page {
    min-height: 100dvh;
    background: #F5F6F8;
    padding: rem(14) rem(14) rem(86);
}

.profile-account-card {
    position: relative;
    padding: rem(18);
    border: 1px solid rgba(22, 24, 30, 0.06);
    border-radius: rem(8);
    background: $color-white;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: rem(5);
        background: #CE0000;
    }
}

.profile-heading-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: rem(12);
}

.profile-heading-copy {
    min-width: 0;

    span {
        color: $color-text-muted;
        font-size: rem(12);
        line-height: 1;
        font-weight: 750;
    }

    h1 {
        margin: rem(7) 0 0;
        color: $color-text-primary;
        font-size: rem(21);
        line-height: 1.18;
        font-weight: 900;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.user-id {
    flex-shrink: 0;
    min-height: rem(32);
    display: inline-flex;
    align-items: center;
    gap: rem(6);
    padding: 0 rem(10);
    border: 1px solid $color-border-light;
    border-radius: rem(4);
    background: #FAFAFA;
    color: $color-text-secondary;
    font-size: rem(12);
    font-weight: 750;

    svg {
        width: rem(13);
        height: rem(13);
    }
}

.earnings-card,
.menu-card {
    margin-top: rem(10);
    border: 1px solid rgba(22, 24, 30, 0.06);
    border-radius: rem(8);
    background: $color-white;
}

.profile-balance-block {
    min-height: rem(96);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: rem(12);
    margin-top: rem(16);
    padding: rem(18);
    border-radius: rem(8);
    background: #FFF1F1;
}

.balance-copy {
    min-width: 0;

    span {
        display: block;
        margin-bottom: rem(10);
        color: $color-primary;
        font-size: rem(12);
        line-height: 1;
        font-weight: 850;
    }

    strong {
        display: block;
        color: $color-primary;
        font-size: rem(30);
        line-height: 1.05;
        font-weight: 900;
        overflow-wrap: anywhere;
    }
}

.balance-refresh {
    width: rem(40);
    height: rem(40);
    flex-shrink: 0;
    border-radius: rem(4);
    background: $color-white;
    color: $color-primary;
    font-size: rem(18);
    box-shadow: 0 rem(8) rem(18) rgba(206, 0, 0, 0.08);
}

.profile-quick-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: rem(8);
    margin-top: rem(12);
}

.quick-action {
    min-height: rem(44);
    border-radius: rem(4);
    background: $color-primary-bg;
    color: $color-primary;
    font-size: rem(14);
    font-weight: 850;
    cursor: pointer;
    transition: transform 0.16s ease, background 0.16s ease;

    &--dark {
        background: #303030;
        color: $color-white;
    }

    &:active {
        transform: scale(0.98);
    }
}

.earnings-card {
    padding: rem(16);
}

.profile-section-title {
    display: flex;
    align-items: center;
    gap: rem(7);
    margin-bottom: rem(13);
    color: $color-text-primary;
    font-size: rem(16);
    line-height: 1.2;
    font-weight: 900;

    svg {
        width: rem(18);
        height: rem(18);
        color: $color-primary;
    }
}

.earnings-grid-wrap {
    overflow: hidden;
}

.earnings-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: rem(8);
}

.earnings-item {
    min-height: rem(82);
    padding: rem(13) rem(12);
    border-radius: rem(8);
    background: #FAFAFA;

    &--full {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        min-height: rem(74);
        background: #FFF1F1;
    }
}

.earnings-label {
    margin-bottom: rem(9);
    color: $color-text-muted;
    font-size: rem(12);
    line-height: 1.1;
    font-weight: 650;
}

.earnings-val {
    color: $color-text-primary;
    font-size: rem(17);
    line-height: 1.18;
    font-weight: 900;
    overflow-wrap: anywhere;

    &--total {
        color: $color-primary;
        font-size: rem(20);
    }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-left-enter-from,
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(rem(20));
}

.slide-right-enter-from,
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(rem(-20));
}

.menu-card {
    padding: rem(12);
}

.profile-menu-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: rem(8);
}

.profile-menu-tile {
    appearance: none;
    min-height: rem(96);
    display: grid;
    grid-template-columns: minmax(0, 1fr) rem(16);
    grid-template-rows: rem(42) auto;
    align-items: center;
    gap: rem(9);
    padding: rem(12);
    border: 1px solid $color-border-light;
    border-radius: rem(8);
    background: #FAFAFA;
    text-align: left;
    font: inherit;
    cursor: pointer;
    transition: transform 0.16s ease, background 0.16s ease, border-color 0.16s ease;

    .menu-icon {
        grid-column: 1;
        grid-row: 1;
    }

    .menu-label {
        grid-column: 1 / -1;
        grid-row: 2;
    }

    .menu-arrow {
        grid-column: 2;
        grid-row: 1;
        justify-self: end;
    }

    &:active {
        background: #FFFFFF;
        border-color: rgba(206, 0, 0, 0.18);
        transform: scale(0.98);
    }

    &:focus-visible {
        outline: rem(2) solid rgba(206, 0, 0, 0.32);
        outline-offset: rem(2);
    }
}

.menu-icon {
    width: rem(42);
    height: rem(42);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: rem(8);
    background: var(--icon-bg);
    color: var(--icon-color);

    svg {
        width: rem(20);
        height: rem(20);
    }
}

.menu-label {
    min-width: 0;
    color: $color-text-primary;
    font-size: rem(13);
    line-height: 1.22;
    font-weight: 850;
    overflow-wrap: anywhere;
}

.menu-arrow {
    width: rem(16);
    height: rem(16);
    color: $color-text-muted;
}

.profile-menu-logout {
    appearance: none;
    width: 100%;
    min-height: rem(52);
    display: grid;
    grid-template-columns: rem(38) minmax(0, 1fr) rem(16);
    align-items: center;
    gap: rem(12);
    margin-top: rem(10);
    padding: rem(7) rem(10);
    border: 1px solid rgba(220, 38, 38, 0.12);
    border-radius: rem(8);
    background: #FFFFFF;
    text-align: left;
    font: inherit;
    cursor: pointer;
    transition: transform 0.16s ease, background 0.16s ease;

    .menu-icon {
        width: rem(38);
        height: rem(38);
    }

    .menu-label,
    .menu-arrow {
        color: $color-danger;
    }

    &:active {
        background: #FEF2F2;
        transform: scale(0.99);
    }

    &:focus-visible {
        outline: rem(2) solid rgba(220, 38, 38, 0.28);
        outline-offset: rem(2);
    }
}

@media (max-width: 374px) {
    .profile-page {
        padding-inline: rem(10);
    }

    .profile-account-card {
        padding-inline: rem(16);
    }

    .balance-copy strong {
        font-size: rem(26);
    }

    .earnings-val {
        font-size: rem(15);
    }
}
</style>
