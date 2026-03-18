<template>
  <div class="profile-page">

    <!-- ① 顶部头部区域 -->
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="user-info">
        <div class="avatar-wrap">
          <img
            class="avatar"
            :src="userInfo.avatar"
            alt="用户头像"
          />
          <div class="avatar-badge">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#F59E0B" stroke="#F59E0B" stroke-width="1" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="user-meta">
          <div class="user-account">{{ userInfo.account }}</div>
          <div class="user-tags">
            <span class="tag tag--credit">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              信用分 {{ userInfo.creditScore }}
            </span>
            <span class="tag tag--level">Lv.{{ userInfo.level }}</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn action-btn--recharge" @click="showRecharge = true" aria-label="充值">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            充值
          </button>
          <button class="action-btn action-btn--withdraw" @click="showWithdraw = true" aria-label="提现">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 19V5M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
          <div class="wallet-amount">¥{{ userInfo.balance }}</div>
        </div>
        <div class="wallet-divider"></div>
        <div class="wallet-item">
          <div class="wallet-label">保证金</div>
          <div class="wallet-amount wallet-amount--warning">¥{{ userInfo.deposit }}</div>
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
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        收益统计
      </div>
      <div class="time-tabs">
        <button
          v-for="tab in timeTabs"
          :key="tab.key"
          class="time-tab"
          :class="{ active: activeTimeTab === tab.key }"
          @click="activeTimeTab = tab.key"
        >{{ tab.label }}</button>
      </div>
      <div class="earnings-grid">
        <div class="earnings-item">
          <div class="earnings-label">团队任务收入</div>
          <div class="earnings-val earnings-val--blue">¥{{ currentEarnings.taskIncome }}</div>
        </div>
        <div class="earnings-item">
          <div class="earnings-label">团队邀请收入</div>
          <div class="earnings-val earnings-val--purple">¥{{ currentEarnings.inviteIncome }}</div>
        </div>
        <div class="earnings-item earnings-item--full">
          <div class="earnings-label">总收入</div>
          <div class="earnings-val earnings-val--green">¥{{ currentEarnings.total }}</div>
        </div>
      </div>
    </div>

    <!-- ④ 功能菜单 -->
    <div class="menu-card">
      <div
        v-for="item in menuItems"
        :key="item.key"
        class="menu-item"
        :class="{ 'menu-item--danger': item.danger }"
        @click="handleMenu(item)"
        role="button"
        :aria-label="item.label"
        tabindex="0"
        @keydown.enter="handleMenu(item)"
      >
        <div class="menu-icon" :style="{ background: item.iconBg }">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" v-html="item.icon"></svg>
        </div>
        <span class="menu-label">{{ item.label }}</span>
        <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
        <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- ⑤ 充值弹窗 -->
    <div v-if="showRecharge" class="modal-overlay" @click.self="showRecharge = false" role="dialog" aria-modal="true" aria-label="充值">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">充值</span>
          <button class="modal-close" @click="showRecharge = false" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="amount-presets">
            <button
              v-for="amt in rechargePresets"
              :key="amt"
              class="preset-btn"
              :class="{ active: rechargeAmount === amt }"
              @click="rechargeAmount = amt"
            >¥{{ amt }}</button>
          </div>
          <div class="input-wrap">
            <span class="input-prefix">¥</span>
            <input v-model="rechargeAmount" type="number" class="amount-input" placeholder="输入充值金额" aria-label="充值金额" min="1"/>
          </div>
          <button class="confirm-btn" @click="confirmRecharge">确认充值</button>
        </div>
      </div>
    </div>

    <!-- ⑥ 提现弹窗 -->
    <div v-if="showWithdraw" class="modal-overlay" @click.self="showWithdraw = false" role="dialog" aria-modal="true" aria-label="提现">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">提现</span>
          <button class="modal-close" @click="showWithdraw = false" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="balance-hint">可提现余额：<strong>¥{{ userInfo.balance }}</strong></div>
          <div class="amount-presets">
            <button
              v-for="amt in withdrawPresets"
              :key="amt"
              class="preset-btn"
              :class="{ active: withdrawAmount === amt }"
              @click="withdrawAmount = amt"
            >¥{{ amt }}</button>
          </div>
          <div class="input-wrap">
            <span class="input-prefix">¥</span>
            <input v-model="withdrawAmount" type="number" class="amount-input" placeholder="输入提现金额" aria-label="提现金额" min="1"/>
          </div>
          <button class="confirm-btn confirm-btn--withdraw" @click="confirmWithdraw">确认提现</button>
        </div>
      </div>
    </div>

    <!-- ⑦ 语言切换弹窗 -->
    <div v-if="showLang" class="modal-overlay" @click.self="showLang = false" role="dialog" aria-modal="true" aria-label="语言切换">
      <div class="modal modal--sm">
        <div class="modal-header">
          <span class="modal-title">选择语言</span>
          <button class="modal-close" @click="showLang = false" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <button
            v-for="lang in languages"
            :key="lang.code"
            class="lang-btn"
            :class="{ active: currentLang === lang.code }"
            @click="switchLang(lang.code)"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            <span class="lang-name">{{ lang.name }}</span>
            <svg v-if="currentLang === lang.code" class="lang-check" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ⑧ 退出登录确认弹窗 -->
    <div v-if="showLogout" class="modal-overlay" @click.self="showLogout = false" role="dialog" aria-modal="true" aria-label="退出登录">
      <div class="modal modal--sm">
        <div class="modal-body modal-body--center">
          <div class="logout-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="logout-title">确认退出登录？</div>
          <div class="logout-desc">退出后需要重新登录才能使用</div>
          <div class="logout-actions">
            <button class="logout-cancel" @click="showLogout = false">取消</button>
            <button class="logout-confirm" @click="confirmLogout">退出</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'default' })

const router = useRouter()

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

// 弹窗状态
const showRecharge = ref(false)
const showWithdraw = ref(false)
const showLang = ref(false)
const showLogout = ref(false)

// 充值/提现
const rechargeAmount = ref(null)
const withdrawAmount = ref(null)
const rechargePresets = [100, 200, 500, 1000]
const withdrawPresets = [100, 200, 500, 1000]

const confirmRecharge = () => {
  if (!rechargeAmount.value) return
  showRecharge.value = false
  rechargeAmount.value = null
}

const confirmWithdraw = () => {
  if (!withdrawAmount.value) return
  showWithdraw.value = false
  withdrawAmount.value = null
}

// 收益统计
const activeTimeTab = ref('today')
const timeTabs = [
  { key: 'yesterday', label: '昨天' },
  { key: 'today', label: '今天' },
  { key: 'week', label: '本星期' },
  { key: 'month', label: '本月' },
]

const earningsData = {
  yesterday: { taskIncome: '320.00', inviteIncome: '80.00', total: '400.00' },
  today:     { taskIncome: '150.00', inviteIncome: '50.00', total: '200.00' },
  week:      { taskIncome: '1,280.00', inviteIncome: '420.00', total: '1,700.00' },
  month:     { taskIncome: '5,600.00', inviteIncome: '1,800.00', total: '7,400.00' },
}

const currentEarnings = computed(() => earningsData[activeTimeTab.value])

// 语言
const currentLang = ref('zh')
const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

const switchLang = (code) => {
  currentLang.value = code
  showLang.value = false
}

// 菜单
const menuItems = [
  {
    key: 'settings',
    label: '设置',
    iconBg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
    icon: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="#2563EB" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="#2563EB" stroke-width="1.8"/>',
    route: '/settings',
  },
  {
    key: 'address',
    label: '地址',
    iconBg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)',
    icon: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#059669" stroke-width="1.8"/><circle cx="12" cy="10" r="3" stroke="#059669" stroke-width="1.8"/>',
    route: '/address',
  },
  {
    key: 'finance',
    label: '财务记录',
    iconBg: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)',
    icon: '<rect x="2" y="5" width="20" height="14" rx="2" stroke="#D97706" stroke-width="1.8"/><path d="M2 10h20" stroke="#D97706" stroke-width="1.8"/><path d="M6 15h4M14 15h4" stroke="#D97706" stroke-width="1.8" stroke-linecap="round"/>',
    route: '/finance',
  },
  {
    key: 'trade',
    label: '交易记录',
    iconBg: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
    icon: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    route: '/trade',
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
    route: '/coupon',
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
    route: '/invite',
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
  if (item.action === 'lang') { showLang.value = true; return }
  if (item.action === 'logout') { showLogout.value = true; return }
  if (item.route) router.push(item.route)
}

const confirmLogout = () => {
  showLogout.value = false
  router.push('/login/login')
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
    background: rgba(255,255,255,0.08);
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: rem(150);
    height: rem(150);
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
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
  border: rem(2) solid rgba(255,255,255,0.6);
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
    background: rgba(255,255,255,0.2);
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
    &:active { opacity: 0.85; }
  }

  &--withdraw {
    background: rgba(255,255,255,0.2);
    color: #fff;
    border: rem(1) solid rgba(255,255,255,0.4);
    &:active { opacity: 0.85; }
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

.earnings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: rem(10);
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

  &--blue   { color: $color-primary; }
  &--purple { color: #7C3AED; }
  &--green  { color: $color-success; }
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

  &:last-child { border-bottom: none; }
  &:active { background: $color-bg-hover; }

  &--danger .menu-label { color: $color-danger; }
  &--danger .menu-arrow { color: $color-danger; }
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
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal {
  width: 100%;
  max-width: rem(375);
  background: #fff;
  border-radius: $radius-xl $radius-xl 0 0;
  overflow: hidden;

  &--sm {
    border-radius: $radius-xl;
    margin: 0 rem(20) rem(20);
    width: calc(100% - rem(40));
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: rem(16) rem(16) rem(12);
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
  cursor: pointer;
  color: $color-text-secondary;

  svg { width: rem(16); height: rem(16); }
  &:active { background: $color-border; }
}

.modal-body {
  padding: rem(16);

  &--center {
    text-align: center;
    padding: rem(24) rem(16);
  }
}

.balance-hint {
  font-size: rem(13);
  color: $color-text-secondary;
  margin-bottom: rem(12);

  strong { color: $color-primary; }
}

.amount-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: rem(8);
  margin-bottom: rem(12);
}

.preset-btn {
  padding: rem(8) 0;
  border-radius: $radius-md;
  font-size: rem(13);
  font-weight: 500;
  background: $color-bg-page;
  color: $color-text-secondary;
  cursor: pointer;
  transition: $transition-fast;
  border: rem(1) solid $color-border;

  &.active {
    background: $color-primary-bg;
    color: $color-primary;
    border-color: $color-primary;
    font-weight: 600;
  }
}

.input-wrap {
  display: flex;
  align-items: center;
  border: rem(1) solid $color-border;
  border-radius: $radius-md;
  padding: rem(10) rem(12);
  margin-bottom: rem(16);
  transition: border-color 0.2s;

  &:focus-within { border-color: $color-primary; }
}

.input-prefix {
  font-size: rem(16);
  font-weight: 600;
  color: $color-text-secondary;
  margin-right: rem(6);
}

.amount-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: rem(16);
  font-weight: 600;
  color: $color-text-primary;
  background: transparent;

  &::placeholder { color: $color-text-placeholder; font-weight: 400; }
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

  &:active { opacity: 0.9; }

  &--withdraw {
    background: linear-gradient(135deg, #059669, #0284C7);
  }
}

// ── Lang Modal ───────────────────────────────────────────────
.lang-btn {
  display: flex;
  align-items: center;
  gap: rem(12);
  width: 100%;
  padding: rem(14) rem(4);
  border-bottom: rem(1) solid $color-border-light;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: $radius-sm;

  &:last-child { border-bottom: none; }
  &:active { background: $color-bg-hover; }

  &.active .lang-name { color: $color-primary; font-weight: 600; }
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

  svg { width: rem(26); height: rem(26); }
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

  &:active { background: $color-border; }
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

  &:active { opacity: 0.9; }
}
</style>

