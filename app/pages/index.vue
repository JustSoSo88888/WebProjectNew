<template>
    <div class="home">

        <!-- Hero Banner -->
        <div class="hero-banner">
            <van-swipe class="hero-swipe" :autoplay="4000" indicator-color="#d97706">
                <van-swipe-item v-for="(item, index) in bannerList" :key="index">
                    <img :src="item">
                    <div class="hero-overlay"></div>
                </van-swipe-item>
            </van-swipe>

            <!-- 公告轮播 -->
            <div class="hero-notice">
                <NoticeMarquee :list="awardList" />
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
            </div>

            <!-- 顶部工具栏 -->
            <div class="top-bar">
                <div class="brand">Nova Travel</div>
                <ConnectionStatus></ConnectionStatus>

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
                        <span class="qc-label">{{ $lang('提现') }}</span>
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
                    <img :src="item" alt="active" @click="previewActivity(index)">
                </van-swipe-item>
            </van-swipe>
        </div>

        <!-- 会员等级 -->
        <div class="vip-section">
            <div class="section-header">
                <h2>{{ $lang('会员等级') }}</h2>
                <van-icon name="warning-o" class="icon" @click="navigateTo('/profile/levelInfo')" />
            </div>
            <div class="vip-list">
                <div class="vip-card" :class="{ 'vip-card--current': item.level == level }" v-for="item in vipLevels"
                    :key="item.id">
                    <div class="current-badge" v-if="item.level == level">{{ $lang('当前等级') }}</div>
                    <div class="vip-img-box">
                        <img :src="item.image_url" class="vip-img" />
                        <div class="vip-name">{{ item.name }}</div>
                        <div class="vip-lock-mask" v-if="item.level > level">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" stroke-width="2" />
                                <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="white" stroke-width="2"
                                    stroke-linecap="round" />
                            </svg>
                        </div>
                    </div>
                    <div class="vip-info">
                        <div class="vip-row">
                            <div>{{ $lang('奖励') }}</div>
                            <div class="amount" translate="n
                        ">R$ {{ item.income_amount }}</div>
                        </div>
                        <div class="vip-row">
                            <div>{{ $lang('任务') }}</div>
                            <div class="amount">{{ item.daily_order_number }}</div>
                        </div>
                        <div class="vip-row">
                            <div>{{ $lang('价格') }}</div>
                            <div class="amount" translate="no">R$ {{ item.price }}</div>
                        </div>
                    </div>
                    <button class="vip-buy-btn" v-if="item.level > level" @click="handleUpdateLevel(item)">{{
                        $lang('立即加入') }}</button>
                </div>
            </div>
        </div>
        <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="handleLangChange" />
        <RedeemModal v-model="showRedeem" />
        <PaymentPasswordPopup v-model:show="showPaymentPopup" @cancel="showPaymentPopup = false"
            @confirm="handlePasswordConfirm"></PaymentPasswordPopup>

        <!-- 升级成功动画 -->
        <van-popup v-model:show="showUpgradeSuccess" @close="closeUpgradeSuccess" class="upgrade-success-modal">
            <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#10B981" stroke-width="2" />
                    <path d="M8 12l3 3 5-6" stroke="#10B981" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <div class="success-title">{{ $lang('升级成功') }}</div>
        </van-popup>
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
import { levelConfigList, updateLevel } from '~/api/level'
import { getBalance } from '~/api/member'
import PaymentPasswordPopup from '~/components/PaymentPasswordPopup.vue'
import { storage } from '~/utils'

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
const showPaymentPopup = ref(false)
const showUpgradeSuccess = ref(false)
const closeUpgradeSuccess = () => {
    showUpgradeSuccess.value = false
}
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
const upLevelData = ref({})
const $dialog = nuxtApp.$dialog
const handleUpdateLevel = (item) => {
    upLevelData.value = item
    $dialog.confirm({
        title: $lang('提示'),
        message: $lang('确认要升级？'),
        confirmText: $lang('确认'),
        cancelText: $lang('取消')
    }).then(() => {
        showPaymentPopup.value = true
    }).catch(() => {
        upLevelData.value = {}
    })

}
const handlePasswordConfirm = async (val) => {

    let param = {
        config_id: upLevelData.value.id,
        pay_password: val
    }
    showPaymentPopup.value = false
    showLoading($lang('加载中'))
    updateLevel(param).then(async res => {
        hideLoading();
        if (res.success) {
            showUpgradeSuccess.value = true
            getBalanceData()
        } else {
            showMsg(res.message, 'fail')
        }

    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')
    })
}

const getBalanceData = () => {
    showLoading($lang('加载中'))
    getBalance({}).then(res => {
        if (res.success) {
            level.value = res.data.level
            let userData = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : {}
            if (Object.keys(userData).length > 0 && userData.level != level.value) {
                userData.level = level.value
                storage.set('user_data', JSON.stringify(userData))
            }
        } else {
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        showMsg(error.message, 'fail')
    }).finally(() => {
        hideLoading();
    })
}

const bannerList = [
    new URL('../assets/img/index/1.jpg', import.meta.url),
    new URL('../assets/img/index/2.jpg', import.meta.url),
    new URL('../assets/img/index/3.jpg', import.meta.url),
    new URL('../assets/img/index/4.jpg', import.meta.url),
    new URL('../assets/img/index/5.jpg', import.meta.url),
]
const activityList = [
    new URL('../assets/img//activity/1.png', import.meta.url).href,
    new URL('../assets/img//activity/2.png', import.meta.url).href,
    new URL('../assets/img//activity/3.jpg', import.meta.url).href,
    new URL('../assets/img//activity/4.jpg', import.meta.url).href,
    new URL('../assets/img//activity/5.jpg', import.meta.url).href,
    new URL('../assets/img//activity/6.jpg', import.meta.url).href,
    new URL('../assets/img//activity/8.jpg', import.meta.url).href,
    new URL('../assets/img//activity/9.jpg', import.meta.url).href,
    new URL('../assets/img//activity/10.jpg', import.meta.url).href,
    new URL('../assets/img//activity/11.jpg', import.meta.url).href,
    new URL('../assets/img//activity/12.jpg', import.meta.url).href,
    new URL('../assets/img//activity/13.jpg', import.meta.url).href,
    new URL('../assets/img//activity/14.jpg', import.meta.url).href,
    new URL('../assets/img//activity/15.jpg', import.meta.url).href,
    new URL('../assets/img//activity/16.jpg', import.meta.url).href,
    new URL('../assets/img//activity/17.jpg', import.meta.url).href,
    new URL('../assets/img//activity/18.jpg', import.meta.url).href,
    new URL('../assets/img//activity/19.jpg', import.meta.url).href,
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
    showImagePreview({ images: activityList, startPosition: index, closeable: true })
}

const handleMenu = (path) => {
    if (path === 'gift') {
        showRedeem.value = true
        return
    }
    navigateTo(path)
}

const level = ref(0)
onMounted(async () => {
    showLoading($lang('加载中'))
    try {
        let res = await getBalance();
        if (res.success) {
            level.value = res.data.level
            let userData = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : {}
            if (Object.keys(userData).length > 0 && userData.level != level.value) {
                userData.level = level.value
                storage.set('user_data', JSON.stringify(userData))
            }
        } else {
            showMsg(res.message, 'fail')
        }
    } catch (error) {
        showMsg(error.message, 'fail')
    } finally {
        hideLoading();
    }
    handleLevelConfigList();
    getAwardLog()
    getMessageUnreadCount();
})

onUnmounted(() => {
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
    // 随机生成10组测试数据
    const generateRandomPhone = () => {
        const areaCodes = ['11', '21', '31', '41', '51', '61', '71', '81', '91']
        const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)]
        const number = Math.floor(Math.random() * 900000000 + 100000000)
        return `${areaCode}${number}`
    }

    const levelConfig = {
        1: 32.4,
        2: 100.8,
        3: 312
    }

    const mockData = []
    for (let i = 0; i < 10; i++) {
        const level = Math.floor(Math.random() * 3) + 1
        mockData.push({
            phone: generateRandomPhone(),
            level: level,
            amount: levelConfig[level]
        })
    }

    // 复制一份实现滚动效果
    awardList.value = [...mockData, ...mockData]
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
    top: rem(50);
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
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: rem(10);

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
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        font-size: rem(18);
        font-weight: 700;
        color: $color-text-primary;
        margin-bottom: rem(4);
    }

    .icon {
        font-size: rem(16);
        font-weight: bold;
        cursor: pointer;
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
    position: relative;
    background: $color-bg-page;
    border-radius: $radius-md;
    overflow: hidden;
    text-align: center;

    .current-badge {
        position: absolute;
        top: 0;
        left: 0;
        background: $color-primary;
        color: #fff;
        font-size: rem(12);
        padding: rem(4) rem(8);
        border-radius: 0 0 $radius-sm 0;
        z-index: 1;
    }

    .vip-img-box {
        position: relative;
        overflow: hidden;
        border-radius: rem(10);
    }

    .vip-lock-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vip-lock-mask svg {
        width: rem(40);
        height: rem(40);
    }

    .vip-img {
        width: 100%;
        height: rem(140);
        object-fit: cover;
    }

    .vip-name {
        font-size: rem(18);
        font-weight: 600;
        color: #fff;
        padding: rem(10) 0 rem(6);
        position: absolute;
        bottom: 0;
        width: 100%;
        background: rgba(0, 0, 0, .3);
    }

    .vip-info {
        padding: rem(10) rem(12) rem(5);
        display: flex;
        justify-content: space-around;
    }

    .vip-row {
        padding: rem(6) 0;
        font-size: rem(13);
        color: $color-text-secondary;
        flex: 1;

        .amount {
            font-weight: bold;
            font-size: rem(14);
            margin-top: rem(3);
        }
    }

    .vip-buy-btn {
        width: calc(100% - rem(24));
        margin: 0 rem(12) rem(12);
        padding: rem(10);
        background: $color-primary;
        color: $color-white;
        border-radius: $radius-sm;
        font-size: rem(14);
        font-weight: 500;
    }
}

// 升级成功动画
.upgrade-success-overlay {
    position: fixed;
    inset: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    background: rgba(0, 0, 0, .7);
}

.upgrade-success-modal {
    background: #fff;
    border-radius: rem(20);
    padding: rem(40) rem(50);
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.3);
    border: 1px solid rgba(16, 185, 129, 0.3);
    width: rem(300);
    box-sizing: border-box;
}

.upgrade-close-btn {
    position: absolute;
    top: rem(8);
    right: rem(10);
    width: rem(28);
    height: rem(28);
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.06);
    color: #6b7280;
    font-size: rem(20);
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-icon {
    width: rem(80);
    height: rem(80);
    margin: 0 auto rem(20);
    animation: icon-bounce 0.6s ease-out 0.2s both;

    svg {
        width: 100%;
        height: 100%;

        circle {
            stroke-dasharray: 63;
            stroke-dashoffset: 63;
            animation: circle-draw 0.6s ease-out 0.3s forwards;
        }

        path {
            stroke-dasharray: 20;
            stroke-dashoffset: 20;
            animation: check-draw 0.4s ease-out 0.7s forwards;
        }
    }
}

.success-title {
    font-size: rem(24);
    font-weight: 700;
    color: #10B981;
    margin-bottom: rem(10);
    animation: text-fade 0.4s ease-out 0.5s both;
}

.success-level {
    font-size: rem(20);
    font-weight: 600;
    color: #fbbf24;
    animation: text-fade 0.4s ease-out 0.7s both;
}

@keyframes modal-pop {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes icon-bounce {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes circle-draw {
    to {
        stroke-dashoffset: 0;
    }
}

@keyframes check-draw {
    to {
        stroke-dashoffset: 0;
    }
}

@keyframes text-fade {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// Transition
.success-fade-enter-active {
    transition: opacity 0.3s ease;
}

.success-fade-leave-active {
    transition: opacity 0.3s ease 0.1s;
}

.success-fade-enter-from,
.success-fade-leave-to {
    opacity: 0;
}
</style>
