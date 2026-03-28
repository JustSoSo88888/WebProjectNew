<template>
    <div class="home">

        <!-- Hero Banner -->
        <div class="hero-banner">
            <van-swipe class="hero-swipe" :autoplay="4000" indicator-color="#d97706">
                <van-swipe-item v-for="(item, index) in bannerList" :key="index">
                    <img :src="item" alt="旅游景点">
                    <div class="hero-overlay"></div>
                </van-swipe-item>
            </van-swipe>

            <!-- 公告轮播 -->
            <div class="hero-notice">
                <NoticeMarquee :list="awardList" />
            </div>

            <!-- 顶部工具栏 -->
            <div class="top-bar">
                <div class="brand">Nova Travel</div>
                <ConnectionStatus></ConnectionStatus>

            </div>

            <div class="tools">
                <button class="tool-icon" @click="showLang = true">
                    <svg viewBox="0 0 24 24" fill="none" class="lang-icon">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                        <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    </svg>
                </button>
                <!-- <button class="tool-icon" @click="navigateTo('/profile/email')">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button> -->
                <button class="tool-icon" @click="navigateTo('/chat')">
                    <van-icon name="service-o" size=".35rem" />
                    <span class="dot" v-if="appStore.getUnReadCount > 0">{{ appStore.getUnReadCount }}</span>
                </button>
            </div>
            <!-- 快捷操作卡片 -->
            <div class="quick-cards">
                <button class="qc-item qc-recharge" @click="navigateTo('/profile/recharge')">
                    <div class="qc-glow qc-glow--recharge"></div>
                    <div class="qc-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
                            <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="qc-content">
                        <span class="qc-label">{{ $lang('充值') }}</span>
                    </div>
                </button>
                <button class="qc-item qc-withdraw" @click="navigateTo('/profile/withdrawal')">
                    <div class="qc-glow qc-glow--withdraw"></div>
                    <div class="qc-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v13M7 7l5-5 5 5" stroke="currentColor" stroke-width="2.5"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5 17h14v3H5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="qc-content">
                        <span class="qc-label">提现</span>
                    </div>
                </button>
                <button class="qc-item qc-profit" @click="navigateTo('/profile/article')">
                    <div class="qc-glow qc-glow--profit"></div>
                    <div class="qc-icon">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7l3-7z" stroke="currentColor"
                                stroke-width="2" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="qc-content">
                        <span class="qc-label">{{ $lang('收益') }}</span>
                    </div>
                </button>
            </div>
        </div>


        <!-- 功能菜单 -->
        <div class="features-section">
            <div class="features-grid">
                <button v-for="item in menuItems" :key="item.label" class="feature-card" @click="handleMenu(item.path)">
                    <div class="feature-icon" :style="{ background: item.bg }">
                        <svg viewBox="0 0 24 24" fill="none" v-html="item.icon"></svg>
                    </div>
                    <span class="feature-label">{{ item.label }}</span>
                </button>
            </div>
        </div>

        <!-- 精选活动 -->
        <div class="activity-section">
            <van-swipe class="activity-swipe" :autoplay="3000" indicator-color="#d97706">
                <van-swipe-item v-for="(item, index) in activityList" :key="index">
                    <img :src="item" alt="活动" @click="previewActivity(index)">
                </van-swipe-item>
            </van-swipe>
        </div>

        <!-- 会员等级 -->
        <div class="vip-section">
            <div class="section-header">
                <h2>会员等级</h2>
                <p>升级享受更多专属权益</p>
            </div>
            <div class="vip-banner">
                <img src="../assets/img/index/2.png" class="vip-banner-img" />
                <div class="vip-banner-title">SSS</div>
            </div>
            <div class="vip-table">
                <div class="vip-table-header">
                    <span></span>
                    <span>任务奖励</span>
                    <span>任务</span>
                    <span>价值</span>
                    <span></span>
                </div>
                <div class="vip-table-row" v-for="item in vipLevels" :key="item.id">
                    <span class="vip-level">{{ item.name }}</span>
                    <span>{{ item.income_amount }}</span>
                    <span>{{ item.daily_order_number }}</span>
                    <span>{{ item.price }}</span>
                    <button class="vip-buy-btn">立即加入</button>
                </div>
            </div>
        </div>
        <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="handleLangChange" />
        <RedeemModal v-model="showRedeem" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { showImagePreview } from 'vant'
import { navigateTo } from '#imports'
import { awardLog } from '~/api/system'
import LangModal from '~/components/LangModal.vue'
import RedeemModal from '~/components/RedeemModal.vue'
import { messageUnreadCount, getAgentId } from '~/api/chat'
import { useAppStore } from '~/stores/app.js'
import ConnectionStatus from '~/components/ConnectionStatus.vue'
import { levelConfigList } from '~/api/level'

const appStore = useAppStore()

const currentLang = ref(storage.get('locale') || 'pt')
const showLang = ref(false)
const showRedeem = ref(false)
const handleLangChange = (lang) => {
    if (currentLang.value == lang) return;
    storage.set('locale', lang)
    currentLang.value = lang
    location.reload()
}

definePageMeta({
    layout: 'default',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const bannerList = [
    new URL('../assets/img/index/1.jpg', import.meta.url),
    new URL('../assets/img/index/2.jpg', import.meta.url),
    new URL('../assets/img/index/3.jpg', import.meta.url),
    new URL('../assets/img/index/4.jpg', import.meta.url),
]
const activityList = [
    new URL('../assets/img//activity/activity.jpg', import.meta.url),
    new URL('../assets/img//activity/activity1.jpg', import.meta.url),
]

const menuItems = [
    {
        label: $lang('新闻'),
        bg: '#EFF6FF',
        icon: '<path d="M4 6h16M4 10h16M4 14h10" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>',
        path: '/profile/news'
    },
    {
        label: $lang('关于我们'),
        bg: '#F5F3FF',
        icon: '<circle cx="12" cy="12" r="9" stroke="#7C3AED" stroke-width="1.8"/><path d="M12 8v4l3 3" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round"/>',
        path: '/profile/aboutUs'
    },
    {
        label: $lang('现金礼物'),
        bg: '#FFF7ED',
        icon: '<path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="#D97706" stroke-width="1.6" stroke-linejoin="round"/>',
        path: 'gift'
    },
    {
        label: $lang('幸运转盘'),
        bg: '#FFF1F2',
        icon: '<circle cx="12" cy="12" r="9" stroke="#DC2626" stroke-width="1.8"/><path d="M12 3v9l6 3" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round"/>',
        path: '/profile/lucky'
    },
    {
        label: $lang('邀请'),
        bg: '#F0FDF4',
        icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="#059669" stroke-width="1.8"/><path d="M19 8v6M22 11h-6" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/>',
        path: '/team?tab=invite'
    },
    {
        label: $lang('手册'),
        bg: '#F0F9FF',
        icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#0284C7" stroke-width="1.8" stroke-linejoin="round"/>',
        path: '/profile/help'
    },
]

const vipLevels = ref([])

function previewActivity(index) {
    showImagePreview({ images: activityList, startPosition: index })
}

const handleMenu = (path) => {
    if (path === 'gift') {
        showRedeem.value = true
        return
    }
    navigateTo(path)
}

onMounted(() => {
    handleLevelConfigList();
    getAwardLog()
    getMessageUnreadCount();
})

onUnmounted(() => {
    levelConfigList
})

const handleLevelConfigList = () => {
    showLoading($lang('加载中'))
    levelConfigList({}).then(res => {
        hideLoading();
        if (res.success) {
            vipLevels.value = res.data.level_configs || []
        } else {
            showMsg(res.message, 'fail')
        }

    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')
    })
}

//获取未读消息
const getMessageUnreadCount = () => {
    getAgentId({}).then(res => {
        if (res.success) {
            messageUnreadCount({ chat_user_id: res.data }).then(res => {
                appStore.setUnReadCount(appStore.getUnReadCount + Number(res.data.total))
            })
        }
    })

}
//邀请收益列表
const awardList = ref([])
const getAwardLog = () => {
    showLoading($lang('加载中'))
    awardLog({ page: 1, pageSize: 10 }).then(res => {
        hideLoading();
        if (res.success) {
            if (res.data.rows && res.data.rows.length > 0) {
                awardList.value = [...res.data.rows, ...res.data.rows]
            }
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
@use '~/assets/scss/config' as *;

.home {
    background: $color-bg-page;
    min-height: 100vh;
    padding-bottom: rem(80);
}

// Hero Banner
.hero-banner {
    position: relative;
    height: rem(480);
    overflow: hidden;
}

.hero-notice {
    position: absolute;
    top: rem(60);
    left: 0;
    right: 0;
    z-index: 3;
    padding: 0 rem(16);
}

.hero-swipe {
    width: 100%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%);
}

.top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(16) rem(16);
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, transparent 100%);

    .brand {
        font-size: rem(20);
        font-weight: 600;
        color: $color-white;
        letter-spacing: 2px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

}

.tools {
    position: absolute;
    right: rem(10);
    top: rem(110);
    z-index: 1;
    gap: rem(8);

    .tool-icon {
        width: rem(36);
        height: rem(36);
        margin-bottom: rem(10);
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: $radius-full;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: $color-white;
        cursor: pointer;
        transition: $transition-fast;
        position: relative;

        .dot {
            position: absolute;
            right: rem(-5);
            top: rem(-5);
            border-radius: 50%;
            aspect-ratio: 1/1;
            width: rem(20);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: rem(12);
            background: $color-danger;
        }

        .lang-icon {
            width: rem(22);
            height: rem(22);
        }

        svg {
            width: rem(18);
            height: rem(18);
        }

        &:active {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(0.95);
        }
    }
}

.hero-content {
    position: absolute;
    bottom: rem(80);
    left: 0;
    right: 0;
    z-index: 3;
    text-align: center;
    padding: 0 rem(20);

    .hero-title {
        font-size: rem(32);
        font-weight: 700;
        color: $color-white;
        margin-bottom: rem(8);
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
        letter-spacing: 1px;
    }

    .hero-subtitle {
        font-size: rem(15);
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
        letter-spacing: 2px;
    }
}

// 快捷卡片
.quick-cards {
    display: flex;
    gap: rem(12);
    padding: 0 rem(16) rem(16);
    position: absolute;
    bottom: rem(10);
    width: 100%;
    z-index: 4;
    box-sizing: border-box;
}

.qc-item {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(8);
    padding: rem(14) rem(10);
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: rem(16);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.6);
    overflow: hidden;

    &:active {
        transform: translateY(2px) scale(0.98);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .qc-glow {
        position: absolute;
        top: -50%;
        width: 120%;
        height: 100%;
        opacity: 0.15;
        filter: blur(30px);
        pointer-events: none;
        transition: opacity 0.3s;

        &--recharge {
            background: linear-gradient(180deg, #F59E0B 0%, #D97706 100%);
        }

        &--withdraw {
            background: linear-gradient(180deg, #10B981 0%, #059669 100%);
        }

        &--profit {
            background: linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%);
        }
    }

    &:hover .qc-glow {
        opacity: 0.25;
    }

    .qc-icon {
        width: rem(52);
        height: rem(52);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: rem(14);
        color: $color-white;
        position: relative;
        z-index: 1;
        transition: transform 0.3s;

        svg {
            width: rem(26);
            height: rem(26);
        }
    }

    &:hover .qc-icon {
        transform: scale(1.05);
    }

    .qc-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: rem(2);
        position: relative;
        z-index: 1;
    }

    .qc-label {
        font-size: rem(14);
        font-weight: 700;
        color: $color-text-primary;
        letter-spacing: 0.5px;
    }

    .qc-desc {
        font-size: rem(10);
        color: $color-text-muted;
        font-weight: 500;
    }

    &.qc-recharge .qc-icon {
        background: linear-gradient(135deg, #FBBF24 0%, #D97706 50%, #B45309 100%);
        box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4);
    }

    &.qc-withdraw .qc-icon {
        background: linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    &.qc-profit .qc-icon {
        background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%);
        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    }
}

// 通用区域样式
.section-header {
    padding: rem(20) rem(16) rem(12);

    h2 {
        font-size: rem(18);
        font-weight: 700;
        color: $color-text-primary;
        margin-bottom: rem(4);
    }

    p {
        font-size: rem(13);
        color: $color-text-secondary;
    }
}

// 功能菜单
.features-section {
    margin: rem(16) rem(16) rem(20);
    background: $color-white;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    border: 1px solid $color-border;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: rem(8);
    padding: rem(8) rem(12) rem(16);
}

.feature-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(8);
    padding: rem(12) rem(8);
    border-radius: $radius-md;
    cursor: pointer;
    transition: $transition-fast;

    &:active {
        background: $color-bg-hover;
    }

    .feature-icon {
        width: rem(52);
        height: rem(52);
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: rem(24);
            height: rem(24);
        }
    }

    .feature-label {
        font-size: rem(12);
        font-weight: 500;
        color: $color-text-secondary;
    }
}

// 活动区域
.activity-section {
    margin: 0 rem(16) rem(20);
    background: $color-white;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    border: 1px solid $color-border;
    overflow: hidden;
}

.activity-swipe {
    height: rem(180);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
    }
}

// VIP会员区域
.vip-section {
    margin: 0 rem(16) rem(20);
    background: $color-white;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    border: 1px solid $color-border;
    padding-bottom: rem(16);
}

.vip-banner {
    position: relative;
    margin: 0 rem(16);
    border-radius: $radius-md;
    overflow: hidden;

    .vip-banner-img {
        width: 100%;
        height: rem(160);
        object-fit: cover;
    }

    .vip-banner-title {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        padding: rem(8);
        background: rgba(0, 0, 0, 0.5);
        color: $color-white;
        font-size: rem(18);
        font-weight: 600;
    }
}

.vip-table {
    margin: rem(12) rem(16) 0;
}

.vip-table-header {
    display: grid;
    grid-template-columns: rem(40) 1fr 1fr 1fr rem(70);
    gap: rem(8);
    padding: rem(10) rem(8);
    background: #3B82F6;
    border-radius: $radius-sm $radius-sm 0 0;
    font-size: rem(12);
    color: $color-white;
    text-align: center;
}

.vip-table-row {
    display: grid;
    grid-template-columns: rem(40) 1fr 1fr 1fr rem(70);
    gap: rem(8);
    padding: rem(10) rem(8);
    background: $color-white;
    border-bottom: 1px solid $color-border;
    font-size: rem(12);
    color: $color-text-secondary;
    text-align: center;
    align-items: center;

    .vip-level {
        font-weight: 600;
        color: $color-text-primary;
    }

    .vip-buy-btn {
        padding: rem(6) rem(8);
        background: linear-gradient(135deg, #3B82F6, #2563EB);
        color: $color-white;
        border-radius: $radius-sm;
        font-size: rem(11);
        white-space: nowrap;
    }
}



</style>
