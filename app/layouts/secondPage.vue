<template>
    <div class="second-page">
        <!-- Fixed Header -->
        <div class="header">
            <button class="back-btn" @click="goBack">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>
            <h1 class="title">{{ pageTitle }}</h1>
            <div class="header-right">
                <slot name="right" />
                <!-- 充值页：显示充值记录入口图标 -->
                <button v-if="route.path === '/recharge'" class="header-icon-btn"
                    @click="navigateTo('/profile/finance?tab=recharge')" aria-label="充值记录">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.8"
                            stroke-linejoin="round" />
                        <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    </svg>
                </button>
                <!-- 提现页：显示提现记录入口图标 -->
                <button v-if="route.path === '/withdrawal'" class="header-icon-btn"
                    @click="navigateTo('/profile/finance?tab=withdraw')" aria-label="提现记录">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.8"
                            stroke-linejoin="round" />
                        <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    </svg>
                </button>
                <ConnectionStatus />
            </div>
        </div>

        <div class="second-page__content">
            <NuxtPage />
        </div>
        <MsgPopup></MsgPopup>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, navigateTo } from '#imports'
import MsgPopup from '~/components/MsgPopup.vue'

const route = useRoute()
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const pageTitleMap = {
    '/profile/bankInfo': $lang('银行卡信息'),
    '/profile/setPassword': $lang('设置交易密码'),
    '/profile/setting': $lang('设置'),
    '/profile/trade': $lang('交易记录'),
    '/profile/redeem': $lang('现金礼物记录'),
    '/profile/news': $lang('新闻'),
    '/profile/aboutUs': $lang('关于我们'),
    '/profile/article': $lang('收益'),
    '/profile/help': $lang('帮助'),
    '/profile/coupon': '卡券',
    '/profile/address': '地址管理',
    '/profile/address/addressAdd': '地址管理',
    '/profile/finance': '财务记录',
    '/profile/email': '邮箱',
    '/profile/email/details': '邮箱详情',
    '/profile/recharge': '充值',
    '/profile/withdrawal': '提现',
    '/team/details': $lang('团队详情'),
    '/task/details': $lang('任务详情'),
    '/finance/record': '理财记录',
    '/finance/detail': '产品详情',
    '/profile/lucky': $lang('幸运转盘'),
    '/profile/lucky/record': $lang('我的奖励'),
    '/chat': '客服',
}

const pageTitle = computed(() => {
    const path = route.path
    if (route.query.title) {
        return route.query.title
    }
    if (path.startsWith('/profile/address/addressAdd')) {
        return route.query.id ? '编辑地址' : '添加新地址'
    }

    for (const [key, title] of Object.entries(pageTitleMap)) {
        if (path.startsWith(key)) {
            return title
        }
    }

    return ''
})

const goBack = () => {
    history.back()
}
</script>

<style scoped lang="scss">
.second-page {
    width: rem(375);
    margin: 0 auto;
    overflow: hidden;
    height: 100vh;
    position: relative;
    background: #F8FAFC;

    &__content {
        height: 100%;
        overflow-y: auto;
        padding-top: rem(56); // 为固定头部留出空间
    }
}

// Header
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(12) rem(16);
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: rem(375);
    z-index: 1000;
}

.back-btn {
    width: rem(32);
    height: rem(32);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #F8FAFC;
    color: #0F172A;
    cursor: pointer;
    flex-shrink: 0;

    svg {
        width: rem(20);
        height: rem(20);
    }

    &:active {
        background: #E2E8F0;
    }
}

.title {
    font-size: rem(16);
    font-weight: 600;
    color: #0F172A;
    flex: 1;
    text-align: center;
    margin: 0 rem(8);
}

.header-right {
    width: rem(32);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.header-icon-btn {
    width: rem(32);
    height: rem(32);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #F8FAFC;
    color: #64748B;
    cursor: pointer;
    transition: background 0.15s;

    svg {
        width: rem(18);
        height: rem(18);
    }

    &:active {
        background: #E2E8F0;
    }
}
</style>
