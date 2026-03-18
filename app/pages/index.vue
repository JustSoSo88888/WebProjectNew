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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" stroke-width="1.8"
              stroke-linejoin="round" />
          </svg>
        </button>
        <button class="tool-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.8" />
            <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9M3 12h18" stroke="white"
              stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
        <button class="tool-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" stroke-width="1.8" />
            <path d="M3 7l9 6 9-6" stroke="white" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- 公告：顶部玻璃条 -->
      <div class="banner-notice">
        <span class="banner-notice-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="white"
              stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <div class="banner-notice-scroll">
          <div class="banner-notice-track" :style="{ transform: `translateX(${noticeX}px)` }">
            <span>系统公告：平台升级维护通知，请关注最新动态&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;活动公告：现金赠礼活动火热进行中，立即参与&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;温馨提示：请妥善保管账户信息，谨防诈骗</span>
          </div>
        </div>
      </div>

      <!-- 快捷功能：底部玻璃卡片 -->
      <div class="quick-actions">
        <button class="qa-btn" @click="() => { }">
          <span class="qa-icon qa-icon--blue">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.2" stroke-linecap="round" />
            </svg>
          </span>
          <span class="qa-label">充值</span>
        </button>
        <button class="qa-btn" @click="() => { }">
          <span class="qa-icon qa-icon--green">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="white" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </span>
          <span class="qa-label">提现</span>
        </button>
        <button class="qa-btn" @click="() => { }">
          <span class="qa-icon qa-icon--amber">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 17l4.5-5 4 3.5L16 9l5 4" stroke="white" stroke-width="2.2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M3 20h18" stroke="white" stroke-width="2.2" stroke-linecap="round" />
            </svg>
          </span>
          <span class="qa-label">收益</span>
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
      <div class="vip-card">
        <div class="vip-header">
          <div class="vip-badge">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill="url(#vg)" />
              <path d="M24 10l3.6 7.3 8.1 1.2-5.85 5.7 1.38 8.05L24 28.3l-7.23 3.95 1.38-8.05L12.3 18.5l8.1-1.2L24 10z"
                fill="white" />
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#F59E0B" />
                  <stop offset="1" stop-color="#D97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="vip-info">
            <div class="vip-name">黄金会员 <span class="vip-tag">LV3</span></div>
            <div class="vip-desc">再完成 2 个任务即可升级铂金</div>
            <div class="vip-progress-bar">
              <div class="vip-progress-fill" style="width:65%"></div>
            </div>
          </div>
        </div>

        <div class="vip-tasks">
          <div class="vip-tasks-title">升级任务</div>
          <div class="vip-task-item">
            <div class="vip-task-left">
              <span class="vip-task-dot"></span>
              <span class="vip-task-name">累计充值</span>
            </div>
            <div class="vip-task-right">
              <span class="vip-task-count">3/5 次</span>
              <span class="vip-task-reward">+¥500</span>
            </div>
          </div>
          <div class="vip-task-item">
            <div class="vip-task-left">
              <span class="vip-task-dot"></span>
              <span class="vip-task-name">完成交易</span>
            </div>
            <div class="vip-task-right">
              <span class="vip-task-count">8/10 笔</span>
              <span class="vip-task-reward">+¥200</span>
            </div>
          </div>
          <div class="vip-task-item">
            <div class="vip-task-left">
              <span class="vip-task-dot done"></span>
              <span class="vip-task-name">邀请好友</span>
            </div>
            <div class="vip-task-right">
              <span class="vip-task-count">2/2 人</span>
              <span class="vip-task-reward done">+¥100</span>
            </div>
          </div>
        </div>

        <div class="vip-stats">
          <div class="vip-stat">
            <div class="vip-stat-val">¥1,280</div>
            <div class="vip-stat-label">任务奖励</div>
          </div>
          <div class="vip-stat">
            <div class="vip-stat-val">13</div>
            <div class="vip-stat-label">任务数量</div>
          </div>
          <div class="vip-stat">
            <div class="vip-stat-val">¥50,000</div>
            <div class="vip-stat-label">任务金额</div>
          </div>
        </div>

        <button class="vip-join-btn">立即加入</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { showImagePreview } from 'vant'
import img1 from '@/assets/img/index/1.jpg'
import img2 from '@/assets/img/index/2.jpg'
import img3 from '@/assets/img/index/3.jpg'
import img4 from '@/assets/img/index/4.jpg'
import activity from '@/assets/img/activity/activity.jpg'
import activity1 from '@/assets/img/activity/activity1.jpg'

definePageMeta({ layout: 'default' })

const noticeX = ref(0)
let noticeTimer = null

const bannerList = [img1, img2, img3, img4]
const activityList = [activity, activity1]

const menuItems = [
  { label: '新闻',    bg: '#EFF6FF', icon: '<path d="M4 6h16M4 10h16M4 14h10" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>' },
  { label: '关于我们', bg: '#F5F3FF', icon: '<circle cx="12" cy="12" r="9" stroke="#7C3AED" stroke-width="1.8"/><path d="M12 8v4l3 3" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round"/>' },
  { label: '現金贈禮', bg: '#FFF7ED', icon: '<path d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="#D97706" stroke-width="1.6" stroke-linejoin="round"/>' },
  { label: '幸运转盘', bg: '#FFF1F2', icon: '<circle cx="12" cy="12" r="9" stroke="#DC2626" stroke-width="1.8"/><path d="M12 3v9l6 3" stroke="#DC2626" stroke-width="1.8" stroke-linecap="round"/>' },
  { label: '邀请',    bg: '#F0FDF4', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="#059669" stroke-width="1.8"/><path d="M19 8v6M22 11h-6" stroke="#059669" stroke-width="1.8" stroke-linecap="round"/>' },
  { label: '手册',    bg: '#F0F9FF', icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#0284C7" stroke-width="1.8" stroke-linecap="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#0284C7" stroke-width="1.8" stroke-linejoin="round"/>' },
]

function previewActivity(index) {
  showImagePreview({ images: activityList, startPosition: index })
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

// ② 快捷功能 — 玻璃拟态，叠在轮播底部
.quick-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  padding: rem(5) rem(5);
  gap: rem(4);
}

.qa-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: rem(6);
  cursor: pointer;
  padding: rem(6) 0;
  border-radius: $radius-md;
  transition: $transition-fast;

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.qa-icon {
  width: rem(44);
  height: rem(44);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);

  svg {
    width: rem(20);
    height: rem(20);
  }
}

.qa-icon--blue {
  background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
  border-color: rgba(59, 130, 246, 0.4);
}

.qa-icon--green {
  background: linear-gradient(135deg, #059669 0%, #10B981 100%);
  border-color: rgba(16, 185, 129, 0.4);
}

.qa-icon--amber {
  background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
  border-color: rgba(245, 158, 11, 0.4);
}

.qa-label {
  font-size: rem(11);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
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

.vip-card {
  margin: rem(4) rem(14) 0;
  background: linear-gradient(135deg, #F8FAFF 0%, #EFF6FF 100%);
  border: 1px solid #DBEAFE;
  border-radius: $radius-lg;
  padding: rem(16);
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

  svg {
    width: 100%;
    height: 100%;
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
