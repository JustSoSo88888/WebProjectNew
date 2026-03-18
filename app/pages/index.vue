<template>
  <div class="home">
    <!-- 顶部 Header -->
    <header class="home__header">
      <div class="home__header-left">
        <div class="home__avatar">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="home__greeting">
          <span class="home__greeting-sub">欢迎回来</span>
          <span class="home__greeting-name">{{ userName }}</span>
        </div>
      </div>
      <div class="home__header-right">
        <button class="home__notice-btn" @click="goNotice">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-if="noticeCount > 0" class="home__notice-dot">{{ noticeCount }}</span>
        </button>
      </div>
    </header>

    <!-- 资产概览卡片 -->
    <section class="home__asset-card">
      <div class="home__asset-label">总资产 (USDT)</div>
      <div class="home__asset-amount">
        <span class="home__asset-int">{{ assetInt }}</span>
        <span class="home__asset-dec">.{{ assetDec }}</span>
      </div>
      <div class="home__asset-row">
        <div class="home__asset-item">
          <span class="home__asset-item-label">今日收益</span>
          <span class="home__asset-item-val home__asset-item-val--up">+{{ todayProfit }}</span>
        </div>
        <div class="home__asset-divider"></div>
        <div class="home__asset-item">
          <span class="home__asset-item-label">累计收益</span>
          <span class="home__asset-item-val home__asset-item-val--up">+{{ totalProfit }}</span>
        </div>
      </div>
    </section>

    <!-- 快捷功能 -->
    <section class="home__quick">
      <div
        v-for="item in quickActions"
        :key="item.key"
        class="home__quick-item"
        @click="item.action"
      >
        <div class="home__quick-icon" :style="{ background: item.bg }">
          <component :is="item.icon" />
        </div>
        <span class="home__quick-label">{{ item.label }}</span>
      </div>
    </section>

    <!-- 公告栏 -->
    <section class="home__notice-bar" @click="goNotice">
      <svg class="home__notice-bar-icon" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="home__notice-bar-text">
        <span>{{ noticeText }}</span>
      </div>
      <svg class="home__notice-bar-arrow" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </section>

    <!-- 理财产品 -->
    <section class="home__products">
      <div class="home__section-header">
        <span class="home__section-title">热门理财</span>
        <NuxtLink to="/finance" class="home__section-more">查看全部 ›</NuxtLink>
      </div>
      <div class="home__product-list">
        <div
          v-for="product in products"
          :key="product.id"
          class="home__product-card"
          @click="goProduct(product)"
        >
          <div class="home__product-top">
            <span class="home__product-name">{{ product.name }}</span>
            <span class="home__product-tag">{{ product.tag }}</span>
          </div>
          <div class="home__product-rate">
            <span class="home__product-rate-num">{{ product.rate }}</span>
            <span class="home__product-rate-unit">%</span>
            <span class="home__product-rate-label">年化收益</span>
          </div>
          <div class="home__product-bottom">
            <span class="home__product-period">{{ product.period }}</span>
            <span class="home__product-min">起投 {{ product.minAmount }} USDT</span>
          </div>
          <button class="home__product-btn">立即投资</button>
        </div>
      </div>
    </section>

    <!-- 底部占位 -->
    <div class="home__bottom-placeholder"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'default',
})

const router = useRouter()

const userName = ref('用户')
const noticeCount = ref(3)
const noticeText = ref('平台公告：系统将于今晚22:00进行例行维护，请提前做好安排。')

const totalAsset = ref(12580.68)
const todayProfit = ref('28.50')
const totalProfit = ref('1,258.30')

const assetInt = computed(() => Math.floor(totalAsset.value).toLocaleString())
const assetDec = computed(() => totalAsset.value.toFixed(2).split('.')[1])

const quickActions = [
  {
    key: 'recharge',
    label: '充值',
    bg: 'rgba(37, 99, 235, 0.1)',
    action: () => router.push('/finance/recharge'),
    icon: {
      template: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/></svg>`,
    },
  },
  {
    key: 'withdraw',
    label: '提现',
    bg: 'rgba(5, 150, 105, 0.1)',
    action: () => router.push('/finance/withdraw'),
    icon: {
      template: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
  },
  {
    key: 'transfer',
    label: '转账',
    bg: 'rgba(124, 58, 237, 0.1)',
    action: () => router.push('/finance/transfer'),
    icon: {
      template: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    },
  },
  {
    key: 'record',
    label: '记录',
    bg: 'rgba(217, 119, 6, 0.1)',
    action: () => router.push('/finance/record'),
    icon: {
      template: `<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#D97706" stroke-width="1.8"/><path d="M9 8h6M9 12h6M9 16h4" stroke="#D97706" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    },
  },
]

const products = ref([
  { id: 1, name: '稳健增利', tag: '低风险', rate: '8.50', period: '30天', minAmount: '100' },
  { id: 2, name: '量化精选', tag: '中风险', rate: '15.20', period: '90天', minAmount: '500' },
  { id: 3, name: '高频套利', tag: '高收益', rate: '28.80', period: '180天', minAmount: '1000' },
])

const goNotice = () => router.push('/profile/notice')
const goProduct = (product) => router.push(`/finance/product/${product.id}`)

onMounted(() => {
})
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: rem(80);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(16) rem(20) rem(12);
    background: $color-bg-card;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: rem(10);
  }

  &__avatar {
    width: rem(40);
    height: rem(40);
    border-radius: $radius-full;
    background: $color-primary-bg;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-primary;

    svg {
      width: rem(22);
      height: rem(22);
    }
  }

  &__greeting {
    display: flex;
    flex-direction: column;
    gap: rem(2);
  }

  &__greeting-sub {
    font-size: rem(11);
    color: $color-text-muted;
  }

  &__greeting-name {
    font-size: rem(15);
    font-weight: 600;
    color: $color-text-primary;
  }

  &__notice-btn {
    position: relative;
    width: rem(36);
    height: rem(36);
    border-radius: $radius-full;
    background: $color-bg-page;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-secondary;
    cursor: pointer;

    svg {
      width: rem(20);
      height: rem(20);
    }
  }

  &__notice-dot {
    position: absolute;
    top: rem(4);
    right: rem(4);
    min-width: rem(16);
    height: rem(16);
    border-radius: $radius-full;
    background: $color-danger;
    color: #fff;
    font-size: rem(9);
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 rem(3);
  }

  &__asset-card {
    margin: rem(12) rem(16);
    padding: rem(20) rem(20) rem(16);
    background: $gradient-primary;
    border-radius: $radius-xl;
    box-shadow: $shadow-blue;
    color: #fff;
  }

  &__asset-label {
    font-size: rem(12);
    opacity: 0.8;
    margin-bottom: rem(8);
  }

  &__asset-amount {
    display: flex;
    align-items: baseline;
    gap: rem(2);
    margin-bottom: rem(16);
  }

  &__asset-int {
    font-size: rem(32);
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  &__asset-dec {
    font-size: rem(18);
    font-weight: 600;
    opacity: 0.9;
  }

  &__asset-row {
    display: flex;
    align-items: center;
    gap: rem(16);
    padding-top: rem(12);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  &__asset-item {
    display: flex;
    flex-direction: column;
    gap: rem(4);
  }

  &__asset-item-label {
    font-size: rem(11);
    opacity: 0.75;
  }

  &__asset-item-val {
    font-size: rem(14);
    font-weight: 600;

    &--up {
      color: #6EE7B7;
    }
  }

  &__asset-divider {
    width: 1px;
    height: rem(28);
    background: rgba(255, 255, 255, 0.25);
  }

  &__quick {
    display: flex;
    justify-content: space-around;
    padding: rem(16) rem(12);
    background: $color-bg-card;
    margin: 0 rem(16) rem(12);
    border-radius: $radius-lg;
    box-shadow: $shadow-sm;
  }

  &__quick-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(8);
    cursor: pointer;

    &:active {
      opacity: 0.6;
    }
  }

  &__quick-icon {
    width: rem(48);
    height: rem(48);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: rem(24);
      height: rem(24);
    }
  }

  &__quick-label {
    font-size: rem(12);
    color: $color-text-secondary;
    font-weight: 500;
  }

  &__notice-bar {
    display: flex;
    align-items: center;
    gap: rem(8);
    margin: 0 rem(16) rem(12);
    padding: rem(10) rem(14);
    background: $color-bg-card;
    border-radius: $radius-md;
    box-shadow: $shadow-xs;
    cursor: pointer;

    &:active {
      opacity: 0.7;
    }
  }

  &__notice-bar-icon {
    width: rem(16);
    height: rem(16);
    color: $color-primary;
    flex-shrink: 0;
  }

  &__notice-bar-text {
    flex: 1;
    overflow: hidden;

    span {
      font-size: rem(12);
      color: $color-text-secondary;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
  }

  &__notice-bar-arrow {
    width: rem(14);
    height: rem(14);
    color: $color-text-muted;
    flex-shrink: 0;
  }

  &__products {
    margin: 0 rem(16);
  }

  &__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: rem(12);
  }

  &__section-title {
    font-size: rem(16);
    font-weight: 700;
    color: $color-text-primary;
  }

  &__section-more {
    font-size: rem(12);
    color: $color-primary;
    text-decoration: none;
  }

  &__product-list {
    display: flex;
    flex-direction: column;
    gap: rem(10);
  }

  &__product-card {
    background: $color-bg-card;
    border-radius: $radius-lg;
    padding: rem(16);
    box-shadow: $shadow-sm;
    cursor: pointer;
    transition: $transition-fast;

    &:active {
      transform: scale(0.98);
    }
  }

  &__product-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: rem(10);
  }

  &__product-name {
    font-size: rem(15);
    font-weight: 600;
    color: $color-text-primary;
  }

  &__product-tag {
    font-size: rem(10);
    padding: rem(3) rem(8);
    border-radius: $radius-full;
    background: $color-primary-bg;
    color: $color-primary;
    font-weight: 500;
  }

  &__product-rate {
    display: flex;
    align-items: baseline;
    gap: rem(2);
    margin-bottom: rem(10);
  }

  &__product-rate-num {
    font-size: rem(28);
    font-weight: 700;
    color: $color-primary;
    line-height: 1;
  }

  &__product-rate-unit {
    font-size: rem(16);
    font-weight: 600;
    color: $color-primary;
  }

  &__product-rate-label {
    font-size: rem(12);
    color: $color-text-muted;
    margin-left: rem(4);
  }

  &__product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: rem(12);
  }

  &__product-period,
  &__product-min {
    font-size: rem(12);
    color: $color-text-muted;
  }

  &__product-btn {
    width: 100%;
    height: rem(38);
    border-radius: $radius-md;
    background: $gradient-primary;
    border: none;
    color: #fff;
    font-size: rem(14);
    font-weight: 600;
    cursor: pointer;
    transition: $transition-fast;
    box-shadow: $shadow-blue;

    &:active {
      opacity: 0.85;
    }
  }

  &__bottom-placeholder {
    height: rem(16);
  }
}
</style>
