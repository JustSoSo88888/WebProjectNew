<template>
    <div class="home">

        <!-- ① Banner + 工具栏 + 公告 + 快捷功能 -->
        <div class="banner">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item, index) in bannerList" :key="index">
                    <img :src="item" alt="">
                </van-swipe-item>
            </van-swipe>

            <!-- 工具栏：右上角 -->
            <div class="tools-bar">
                <button class="tool-btn">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white"
                              stroke-width="1.8"
                              stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="tool-btn">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.8"/>
                        <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18"
                              stroke="white"
                              stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                </button>
                <button class="tool-btn">
                    <svg viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" stroke-width="1.8"/>
                        <path d="M3 7l9 6 9-6" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>

            <!-- 公告：顶部玻璃条 -->
            <div class="banner-notice">
        <span class="banner-notice-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="white"
                  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
                <div class="banner-notice-scroll">
                    <div class="banner-notice-track" :style="{ transform: `translateX(${noticeX}px)` }">
                        <span>系统公告：平台升级维护通知，请关注最新动态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动公告：现金赠礼活动火热进行中，立即参与&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;温馨提示：请妥善保管账户信息，谨防诈骗</span>
                    </div>
                </div>
            </div>

            <!-- 快捷功能：底部渐变按钮 -->
            <div class="quick-actions">
                <button class="qa-btn qa-btn--blue" @click="navigateTo('/recharge')">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    <span>充值</span>
                </button>
                <button class="qa-btn qa-btn--green" @click="navigateTo('/withdrawal')">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 19V5M5 12l7-7 7 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>提现</span>
                </button>
                <button class="qa-btn qa-btn--purple" @click="() => { }">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>收益</span>
                </button>
            </div>
        </div>

        <!-- ④ 功能菜单 -->
        <div class="section menu-grid">
            <div class="menu-list">
                <button v-for="item in menuItems" :key="item.label" class="menu-item" @click="item.action?.()">
          <span class="menu-icon" :style="{ background: item.bg }">
            <svg viewBox="0 0 24 24" fill="none" v-html="item.icon"></svg>
          </span>
                    <span class="menu-label">{{ item.label }}</span>
                </button>
            </div>
        </div>

        <!-- ⑤ 图片轮播 -->
        <div class="section carousel-section">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item, index) in activityList" :key="index">
                    <img :src="item" alt="" @click="previewActivity(index)">
                </van-swipe-item>
            </van-swipe>
        </div>

        <!-- ⑥ 会员等级 -->
        <div class="section vip-section">
            <div class="section-title">会员等级</div>
            <div class="vip-list">
                <div v-for="vip in vipLevels" :key="vip.level" class="vip-card"
                     :class="{ 'vip-card--current': vip.current }">
                    <div class="vip-header">
                        <div class="vip-badge" :style="{ background: vip.gradient }">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                      fill="white"/>
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
                            :style="{ background: vip.current ? 'linear-gradient(135deg, #9CA3AF, #6B7280)' : 'linear-gradient(135deg, #2563EB, #7C3AED)' }">
                        {{ vip.current ? '当前等级' : '立即加入' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
    import {ref, onMounted, onUnmounted} from 'vue'
    import {showImagePreview} from 'vant'
    import {navigateTo} from '#imports'
    import img1 from '@/assets/img/index/1.jpg'
    import img2 from '@/assets/img/index/2.jpg'
    import img3 from '@/assets/img/index/3.jpg'
    import img4 from '@/assets/img/index/4.jpg'
    import activity from '@/assets/img/activity/activity.jpg'
    import activity1 from '@/assets/img/activity/activity1.jpg'

    definePageMeta({
    layout: 'default',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

    const noticeX = ref(0)
    let noticeTimer = null

    const bannerList = [img1, img2, img3, img4]
    const activityList = [activity, activity1]

    const menuItems = [
        {
            label: '新闻',
            bg: '#EFF6FF',
            icon: '<path d="M4 6h16M4 10h16M4 14h10" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>'
        },
        {
            label: '关于我们',
            bg: '#F5F3FF',
            icon: '<circle cx="12" cy="12" r="9" stroke="#7C3AED" stroke-width="1.8"/><path d="M12 8v4l3 3" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round"/>'
        },
        {
            label: '現金贈禮',
            bg: '#FFF7ED',
            icon: '<path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="#D97706" stroke-width="1.6" stroke-linejoin="round"/>'
        },
        {
            label: '幸运转盘',
            bg: '#FFF1F2',
            icon: '<circle cx="12" cy="12" r="9" stroke="#DC2626" stroke-width="1.8"/><path d="M12 3v9l6 3" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round"/>'
        },
        {
            label: '邀请',
            bg: '#F0FDF4',
            icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="#059669" stroke-width="1.8"/><path d="M19 8v6M22 11h-6" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/>'
        },
        {
            label: '手册',
            bg: '#F0F9FF',
            icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#0284C7" stroke-width="1.8" stroke-linejoin="round"/>'
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
                {name: '注册账户', progress: '已完成', reward: '-', done: true},
            ],
            stats: {taskReward: 'R$0', taskCount: '0', taskAmount: 'R$0'},
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
                {name: '累计充值', progress: '1/3 次', reward: '+R$200', done: false},
                {name: '完成交易', progress: '2/5 笔', reward: '+R$100', done: false},
            ],
            stats: {taskReward: 'R$580', taskCount: '5', taskAmount: 'R$20,000'},
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
                {name: '累计充值', progress: '3/5 次', reward: '+R$300', done: false},
                {name: '完成交易', progress: '6/8 笔', reward: '+R$150', done: false},
                {name: '邀请好友', progress: '1/2 人', reward: '+R$100', done: false},
            ],
            stats: {taskReward: 'R$920', taskCount: '9', taskAmount: 'R$35,000'},
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
                {name: '累计充值', progress: '3/5 次', reward: '+R$500', done: false},
                {name: '完成交易', progress: '8/10 笔', reward: '+R$200', done: false},
                {name: '邀请好友', progress: '2/2 人', reward: '+R$100', done: true},
            ],
            stats: {taskReward: 'R$1,280', taskCount: '13', taskAmount: 'R$50,000'},
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
                {name: '累计充值', progress: '5/8 次', reward: '+R$800', done: false},
                {name: '完成交易', progress: '12/15 笔', reward: '+R$300', done: false},
                {name: '邀请好友', progress: '3/5 人', reward: '+R$200', done: false},
            ],
            stats: {taskReward: 'R$2,580', taskCount: '20', taskAmount: 'R$100,000'},
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
                {name: '累计充值', progress: '8/10 次', reward: '+R$1,000', done: false},
                {name: '完成交易', progress: '18/20 笔', reward: '+R$500', done: false},
                {name: '邀请好友', progress: '5/8 人', reward: '+R$300', done: false},
            ],
            stats: {taskReward: 'R$5,000', taskCount: '30', taskAmount: 'R$200,000'},
            current: false
        },
    ]

    function previewActivity(index) {
        showImagePreview({images: activityList, startPosition: index})
    }

    onMounted(() => {
        noticeTimer = setInterval(() => {
            noticeX.value -= 0.8
            if (noticeX.value < -800) noticeX.value = 0
        }, 16)
    })

    onUnmounted(() => {
        if (noticeTimer) clearInterval(noticeTimer)
    })
</script>

<style scoped lang="scss">
    .home {
        padding-bottom: rem(20);
    }

    // ① Banner
    .banner {
        position: relative;
        width: 100%;
        height: rem(400);
        overflow: hidden;
    }

    .my-swipe {
        width: 100%;
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    }

    .tools-bar {
        position: absolute;
        top: rem(50);
        right: rem(12);
        display: flex;
        flex-direction: column;
        gap: rem(10);
        z-index: 2;
    }

    .tool-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: rem(3);
        cursor: pointer;
        padding: rem(8) rem(8);
        border-radius: $radius-md;
        transition: $transition-fast;
        font-size: rem(10);
        color: rgba(255, 255, 255, 0.85);
        font-weight: 500;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(8px);

        svg {
            width: rem(18);
            height: rem(18);
        }

        &:active {
            background: rgba(255, 255, 255, 0.2);
        }
    }

    // ② 快捷功能 — 渐变按钮
    .quick-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        display: flex;
        gap: rem(8);
        padding: rem(8);
    }

    .qa-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: rem(6);
        padding: rem(10) 0;
        border-radius: $radius-md;
        font-size: rem(13);
        font-weight: 600;
        color: #fff;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

        svg {
            width: rem(20);
            height: rem(20);
        }

        &:active {
            opacity: 0.9;
            transform: scale(0.98);
        }

        &--blue {
            background: linear-gradient(135deg, #1E40AF, #3B82F6);
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        &--green {
            background: linear-gradient(135deg, #047857, #10B981);
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        &--purple {
            background: linear-gradient(135deg, #5B21B6, #8B5CF6);
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
    }

    .section {
        margin: rem(10) rem(14);
        background: #FFFFFF;
        border-radius: $radius-lg;
        border: 1px solid $color-border;
        box-shadow: $shadow-sm;
        overflow: hidden;


    }

    .carousel-section {
        height: rem(150);
    }

    .section-title {
        font-size: rem(13);
        font-weight: 700;
        color: $color-text-primary;
        padding: rem(14) rem(14) rem(4);
        letter-spacing: -0.2px;
    }

    // ③ 公告 — 叠在 banner 顶部
    .banner-notice {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: rem(8);
        padding: rem(8) rem(12);
        background: rgba(0, 0, 0, 0.32);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .banner-notice-icon {
        flex-shrink: 0;
        width: rem(16);
        height: rem(16);
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .banner-notice-scroll {
        flex: 1;
        overflow: hidden;
        height: rem(18);
        position: relative;
    }

    .banner-notice-track {
        white-space: nowrap;
        position: absolute;
        top: 0;
        left: 0;
        font-size: rem(11);
        color: rgba(255, 255, 255, 0.85);
        line-height: rem(18);
    }

    // ④ 功能菜单
    .menu-grid {
        padding-bottom: rem(14);
    }

    .menu-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: rem(2);
        padding: rem(8) rem(8) 0;
    }

    .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: rem(7);
        padding: rem(10) rem(4);
        cursor: pointer;
        border-radius: $radius-md;
        transition: $transition-fast;

        &:active {
            background: $color-bg-hover;
        }
    }

    .menu-icon {
        width: rem(46);
        height: rem(46);
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: rem(22);
            height: rem(22);
        }
    }

    .menu-label {
        font-size: rem(11);
        color: $color-text-secondary;
        font-weight: 500;
        white-space: nowrap;
    }


    .carousel-track {
        display: flex;
        gap: rem(10);
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding: rem(4) rem(14) rem(4);

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .carousel-item {
        flex-shrink: 0;
        width: rem(280);
        height: rem(120);
        border-radius: $radius-md;
        scroll-snap-align: start;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: rem(8);
        border: 1px solid $color-border;

        svg {
            width: rem(28);
            height: rem(28);
        }

        span {
            font-size: rem(12);
            color: $color-text-muted;
        }
    }

    .carousel-dots {
        display: flex;
        justify-content: center;
        gap: rem(6);
        margin-top: rem(10);

        span {
            width: rem(6);
            height: rem(6);
            border-radius: $radius-full;
            background: $color-border;
            cursor: pointer;
            transition: $transition-fast;

            &.active {
                width: rem(18);
                background: $color-primary;
            }
        }
    }

    // ⑥ 会员等级
    .vip-section {
        padding-bottom: rem(16);
    }

    .vip-list {
        padding: 0 rem(14);
        display: flex;
        flex-direction: column;
        gap: rem(12);
    }

    .vip-card {
        background: linear-gradient(135deg, #F8FAFF 0%, #EFF6FF 100%);
        border: 1px solid #DBEAFE;
        border-radius: $radius-lg;
        padding: rem(16);

        &--current {
            border-color: #F59E0B;
            background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
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
        width: rem(52);
        height: rem(52);
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            width: rem(28);
            height: rem(28);
        }
    }

    .vip-info {
        flex: 1;
    }

    .vip-name {
        font-size: rem(15);
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
        color: #D97706;
        background: #FEF3C7;
        border: 1px solid #FDE68A;
        border-radius: $radius-full;
        padding: rem(1) rem(6);
    }

    .vip-desc {
        font-size: rem(11);
        color: $color-text-secondary;
        margin-bottom: rem(8);
    }

    .vip-progress-bar {
        height: rem(5);
        background: #DBEAFE;
        border-radius: $radius-full;
        overflow: hidden;
    }

    .vip-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #2563EB, #7C3AED);
        border-radius: $radius-full;
    }

    .vip-tasks {
        margin-bottom: rem(14);
    }

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
        padding: rem(9) 0;
        border-bottom: 1px solid rgba(219, 234, 254, 0.6);

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
        padding: rem(2) rem(7);
        border-radius: $radius-full;

        &.done {
            color: $color-success;
            background: $color-success-bg;
        }
    }

    .vip-stats {
        display: flex;
        background: #FFFFFF;
        border-radius: $radius-md;
        border: 1px solid #DBEAFE;
        margin-bottom: rem(14);
        overflow: hidden;
    }

    .vip-stat {
        flex: 1;
        text-align: center;
        padding: rem(12) rem(4);
        border-right: 1px solid #DBEAFE;

        &:last-child {
            border-right: none;
        }
    }

    .vip-stat-val {
        font-size: rem(14);
        font-weight: 700;
        color: $color-text-primary;
        margin-bottom: rem(3);
    }

    .vip-stat-label {
        font-size: rem(10);
        color: $color-text-muted;
    }

    .vip-join-btn {
        width: 100%;
        height: rem(44);
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        color: #fff;
        border: none;
        border-radius: $radius-md;
        font-size: rem(14);
        font-weight: 700;
        cursor: pointer;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        transition: $transition-fast;

        &:active {
            opacity: 0.85;
            transform: scale(0.99);
        }
    }
</style>
