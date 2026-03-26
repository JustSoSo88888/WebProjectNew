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
                <div class="tools">
                    <button class="tool-icon" @click="showLang = true">
                        <svg viewBox="0 0 24 24" fill="none" class="lang-icon">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                            <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18"
                                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </button>
                    <button class="tool-icon" @click="navigateTo('/profile/email')">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="tool-icon" @click="navigateTo('/chat')">
                        <van-icon name="service-o" size=".35rem" />
                    </button>
                </div>
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
                        <span class="qc-label">充值</span>
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
                        <span class="qc-label">收益</span>
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
            <div class="vip-list">
                <div v-for="vip in vipLevels" :key="vip.level" class="vip-card"
                    :class="{ 'vip-card--current': vip.current }">
                    <div class="vip-header">
                        <div class="vip-badge" :style="{ background: vip.gradient }">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                    fill="white" />
                            </svg>
                        </div>
                        <div class="vip-info">
                            <div class="vip-name">{{ vip.name }} <span class="vip-tag"
                                    :style="{ background: vip.tagBg, color: vip.tagColor }">{{ vip.tag }}</span>
                            </div>
                            <div class="vip-desc">{{ vip.desc }}</div>
                            <div class="vip-progress-bar" v-if="vip.progress">
                                <div class="vip-progress-fill" :style="{ width: vip.progress + '%' }"></div>
                            </div>
                        </div>
                    </div>

                    <div class="vip-tasks" v-if="vip.tasks && vip.tasks.length">
                        <div class="vip-tasks-title">{{ vip.current ? '升级任务' : '升级条件' }}</div>
                        <div class="vip-task-item" v-for="task in vip.tasks" :key="task.name">
                            <div class="vip-task-left">
                                <span class="vip-task-dot" :class="{ done: task.done }"></span>
                                <span class="vip-task-name">{{ task.name }}</span>
                            </div>
                            <div class="vip-task-right">
                                <span class="vip-task-count">{{ task.progress }}</span>
                                <span class="vip-task-reward" :class="{ done: task.done }">{{ task.reward }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="vip-stats">
                        <div class="vip-stat">
                            <div class="vip-stat-val">{{ vip.stats.taskReward }}</div>
                            <div class="vip-stat-label">任务奖励</div>
                        </div>
                        <div class="vip-stat">
                            <div class="vip-stat-val">{{ vip.stats.taskCount }}</div>
                            <div class="vip-stat-label">任务数量</div>
                        </div>
                        <div class="vip-stat">
                            <div class="vip-stat-val">{{ vip.stats.taskAmount }}</div>
                            <div class="vip-stat-label">任务金额</div>
                        </div>
                    </div>

                    <button class="vip-join-btn"
                        :style="{ background: vip.current ? 'linear-gradient(135deg, #9CA3AF, #6B7280)' : 'linear-gradient(135deg, #d97706, #b45309)' }">
                        {{ vip.current ? '当前等级' : '立即加入' }}
                    </button>
                </div>
            </div>
        </div>
        <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="handleLangChange" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { showImagePreview } from 'vant'
import { navigateTo } from '#imports'
import { awardLog } from '~/api/system'
import LangModal from '~/components/LangModal.vue'
const currentLang = ref(storage.get('locale') || 'pt')
const showLang = ref(false)
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
        label: '新闻',
        bg: '#EFF6FF',
        icon: '<path d="M4 6h16M4 10h16M4 14h10" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>',
        path:'/profile/news'
    },
    {
        label: '关于我们',
        bg: '#F5F3FF',
        icon: '<circle cx="12" cy="12" r="9" stroke="#7C3AED" stroke-width="1.8"/><path d="M12 8v4l3 3" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round"/>',
        path:'/profile/aboutUs'
    },
    {
        label: '現金贈禮',
        bg: '#FFF7ED',
        icon: '<path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="#D97706" stroke-width="1.6" stroke-linejoin="round"/>',
        path:'gift'
    },
    {
        label: '幸运转盘',
        bg: '#FFF1F2',
        icon: '<circle cx="12" cy="12" r="9" stroke="#DC2626" stroke-width="1.8"/><path d="M12 3v9l6 3" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round"/>',
        path:'/profile/lucky'
    },
    {
        label: '邀请',
        bg: '#F0FDF4',
        icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="#059669" stroke-width="1.8"/><path d="M19 8v6M22 11h-6" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/>',
        path:'/team?tab=invite'
    },
    {
        label: '手册',
        bg: '#F0F9FF',
        icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#0284C7" stroke-width="1.8" stroke-linejoin="round"/>',
        path:'/profile/help'
    },
]

const vipLevels = [
    {
        level: 1,
        name: '普通会员',
        tag: 'LV1',
        tagBg: '#E5E7EB',
        tagColor: '#6B7280',
        gradient: 'linear-gradient(135deg, #9CA3AF, #6B7280)',
        desc: '享受基础服务',
        progress: null,
        tasks: [
            { name: '注册账户', progress: '已完成', reward: '-', done: true },
        ],
        stats: { taskReward: 'R$0', taskCount: '0', taskAmount: 'R$0' },
        current: false
    },
    {
        level: 2,
        name: '青铜会员',
        tag: 'LV2',
        tagBg: '#FEF3C7',
        tagColor: '#D97706',
        gradient: 'linear-gradient(135deg, #CD7F32, #8B4513)',
        desc: '享受9.5折优惠',
        progress: null,
        tasks: [
            { name: '累计充值', progress: '1/3 次', reward: '+R$200', done: false },
            { name: '完成交易', progress: '2/5 笔', reward: '+R$100', done: false },
        ],
        stats: { taskReward: 'R$580', taskCount: '5', taskAmount: 'R$20,000' },
        current: false
    },
    {
        level: 3,
        name: '白银会员',
        tag: 'LV3',
        tagBg: '#E5E7EB',
        tagColor: '#9CA3AF',
        gradient: 'linear-gradient(135deg, #C0C0C0, #808080)',
        desc: '享受9折优惠',
        progress: null,
        tasks: [
            { name: '累计充值', progress: '3/5 次', reward: '+R$300', done: false },
            { name: '完成交易', progress: '6/8 笔', reward: '+R$150', done: false },
            { name: '邀请好友', progress: '1/2 人', reward: '+R$100', done: false },
        ],
        stats: { taskReward: 'R$920', taskCount: '9', taskAmount: 'R$35,000' },
        current: false
    },
    {
        level: 4,
        name: '黄金会员',
        tag: 'LV4',
        tagBg: '#FEF3C7',
        tagColor: '#F59E0B',
        gradient: 'linear-gradient(135deg, #FFD700, #D97706)',
        desc: '享受8.5折优惠',
        progress: 65,
        tasks: [
            { name: '累计充值', progress: '3/5 次', reward: '+R$500', done: false },
            { name: '完成交易', progress: '8/10 笔', reward: '+R$200', done: false },
            { name: '邀请好友', progress: '2/2 人', reward: '+R$100', done: true },
        ],
        stats: { taskReward: 'R$1,280', taskCount: '13', taskAmount: 'R$50,000' },
        current: true
    },
    {
        level: 5,
        name: '铂金会员',
        tag: 'LV5',
        tagBg: '#DBEAFE',
        tagColor: '#2563EB',
        gradient: 'linear-gradient(135deg, #E5E4E2, #A0AEC0)',
        desc: '享受8折优惠',
        progress: null,
        tasks: [
            { name: '累计充值', progress: '5/8 次', reward: '+R$800', done: false },
            { name: '完成交易', progress: '12/15 笔', reward: '+R$300', done: false },
            { name: '邀请好友', progress: '3/5 人', reward: '+R$200', done: false },
        ],
        stats: { taskReward: 'R$2,580', taskCount: '20', taskAmount: 'R$100,000' },
        current: false
    },
    {
        level: 6,
        name: '钻石会员',
        tag: 'LV6',
        tagBg: '#EDE9FE',
        tagColor: '#7C3AED',
        gradient: 'linear-gradient(135deg, #E5E4E2, #B9F2FF)',
        desc: '享受7.5折优惠',
        progress: null,
        tasks: [
            { name: '累计充值', progress: '8/10 次', reward: '+R$1,000', done: false },
            { name: '完成交易', progress: '18/20 笔', reward: '+R$500', done: false },
            { name: '邀请好友', progress: '5/8 人', reward: '+R$300', done: false },
        ],
        stats: { taskReward: 'R$5,000', taskCount: '30', taskAmount: 'R$200,000' },
        current: false
    },
]

function previewActivity(index) {
    showImagePreview({ images: activityList, startPosition: index })
}

const handleMenu = (path) => {
    if(path === 'gift'){
        return
    }
    navigateTo(path)
}

onMounted(() => {
    getAwardLog()
})

onUnmounted(() => {
})

//邀请收益列表
const awardList = ref([])
const getAwardLog = () => {
    showLoading($lang('加载中'))
    awardLog({ page: 1, pageSize: 10 }).then(res => {
        hideLoading();
        if (res.success) {
            if(res.data.rows && res.data.rows.length > 0){
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

    .tools {
        display: flex;
        gap: rem(8);
    }

    .tool-icon {
        width: rem(36);
        height: rem(36);
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

.vip-list {
    padding: 0 rem(16);
    display: flex;
    flex-direction: column;
    gap: rem(12);
}

.vip-card {
    background: linear-gradient(135deg, $color-bg-page 0%, $color-white 100%);
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    padding: rem(16);
    transition: $transition-fast;

    &--current {
        border-color: $color-primary;
        background: linear-gradient(135deg, $color-primary-bg 0%, #FEF3C7 100%);
        box-shadow: $shadow-gold;
    }
}

.vip-header {
    display: flex;
    gap: rem(14);
    align-items: flex-start;
    margin-bottom: rem(16);
}

.vip-badge {
    flex-shrink: 0;
    width: rem(56);
    height: rem(56);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    svg {
        width: rem(30);
        height: rem(30);
    }
}

.vip-info {
    flex: 1;
}

.vip-name {
    font-size: rem(16);
    font-weight: 700;
    color: $color-text-primary;
    margin-bottom: rem(4);
    display: flex;
    align-items: center;
    gap: rem(6);
}

.vip-tag {
    font-size: rem(10);
    font-weight: 700;
    padding: rem(2) rem(8);
    border-radius: $radius-full;
}

.vip-desc {
    font-size: rem(12);
    color: $color-text-secondary;
    margin-bottom: rem(8);
}

.vip-progress-bar {
    height: rem(6);
    background: $color-border-light;
    border-radius: $radius-full;
    overflow: hidden;
}

.vip-progress-fill {
    height: 100%;
    background: $gradient-primary;
    border-radius: $radius-full;
    box-shadow: 0 0 8px rgba($color-primary, 0.4);
}

.vip-tasks {
    margin-bottom: rem(14);

    .vip-tasks-title {
        font-size: rem(11);
        font-weight: 600;
        color: $color-text-muted;
        margin-bottom: rem(10);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .vip-task-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(10) 0;
        border-bottom: 1px solid $color-border-light;

        &:last-child {
            border-bottom: none;
        }
    }

    .vip-task-left {
        display: flex;
        align-items: center;
        gap: rem(8);
    }

    .vip-task-dot {
        width: rem(8);
        height: rem(8);
        border-radius: $radius-full;
        background: $color-border;
        border: 1.5px solid $color-gray-300;
        flex-shrink: 0;

        &.done {
            background: $color-success;
            border-color: $color-success;
        }
    }

    .vip-task-name {
        font-size: rem(13);
        color: $color-text-primary;
        font-weight: 500;
    }

    .vip-task-right {
        display: flex;
        align-items: center;
        gap: rem(10);
    }

    .vip-task-count {
        font-size: rem(11);
        color: $color-text-muted;
    }

    .vip-task-reward {
        font-size: rem(12);
        font-weight: 700;
        color: $color-primary;
        background: $color-primary-bg;
        padding: rem(3) rem(8);
        border-radius: $radius-full;

        &.done {
            color: $color-success;
            background: $color-success-bg;
        }
    }
}

.vip-stats {
    display: flex;
    background: $color-white;
    border-radius: $radius-md;
    border: 1px solid $color-border;
    margin-bottom: rem(14);
    overflow: hidden;

    .vip-stat {
        flex: 1;
        text-align: center;
        padding: rem(14) rem(4);
        border-right: 1px solid $color-border;

        &:last-child {
            border-right: none;
        }
    }

    .vip-stat-val {
        font-size: rem(15);
        font-weight: 700;
        color: $color-text-primary;
        margin-bottom: rem(4);
    }

    .vip-stat-label {
        font-size: rem(10);
        color: $color-text-muted;
    }
}

.vip-join-btn {
    width: 100%;
    height: rem(46);
    background: $gradient-primary;
    color: $color-white;
    border: none;
    border-radius: $radius-md;
    font-size: rem(15);
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.5px;
    box-shadow: $shadow-gold;
    transition: $transition-fast;

    &:active {
        opacity: 0.9;
        transform: translateY(1px);
    }
}
</style>
