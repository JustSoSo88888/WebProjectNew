<template>
  <div class="finance">

    <!-- 顶部用户卡片 -->
    <div class="hero-card">
      <div class="hero-top">
        <div class="user-info">
          <div class="user-avatar">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" stroke="white" stroke-width="1.8" stroke-linejoin="round" />
              <circle cx="12" cy="10" r="3" stroke="white" stroke-width="1.8" />
            </svg>
          </div>
          <div>
            <div class="user-account">{{ userData.id }}</div>
            <div class="credit-row">
              <svg viewBox="0 0 24 24" fill="none" class="credit-icon">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
                  fill="rgba(255,255,255,0.9)" />
              </svg>
              <span class="credit-label">信用评分</span>
              <span class="credit-val">{{ userInfo.creditScore }}</span>
            </div>
          </div>
        </div>
        <button class="record-btn" @click="goRecord">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="white"
              stroke-width="1.8" stroke-linecap="round" />
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="white" stroke-width="1.8" />
            <path d="M9 12h6M9 16h4" stroke="white" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          理财记录
        </button>
      </div>

      <!-- 钱包余额 -->
      <div class="wallet-row">
        <div class="wallet-label">钱包余额</div>
        <div class="wallet-amount">
          <span class="wallet-unit">R$</span>
          <span class="wallet-num" translate="no">{{ balance }}</span>
        </div>
      </div>

      <!-- 收益统计 -->
      <div class="earnings-row">
        <div class="earning-item">
          <div class="earning-val" translate="no">R${{ totalEarnings }}</div>
          <div class="earning-label">总收益</div>
        </div>
        <div class="earning-divider"></div>
        <div class="earning-item">
          <div class="earning-val earning-val--today">+R${{ userInfo.todayEarnings }}</div>
          <div class="earning-label">今日收益</div>
        </div>
      </div>
    </div>

    <!-- 理财产品列表 -->
    <div class="product-section">
      <div class="section-header">
        <span class="section-title">理财产品</span>
        <span class="section-count">{{ products.length }} 个产品</span>
      </div>

      <div class="product-list">
        <div v-for="item in products" :key="item.id" class="product-card" @click="handleBuy(item)">
          <div class="product-top">
            <img :src="item.image_url" :alt="item.name" class="product-img">
            <div class="product-meta">
              <div class="product-name">{{ item.title }}</div>
              <div class="product-days">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                  <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
                {{ item.day_number }} 天
              </div>
              <div class="product-profit">
                <span class="profit-label">日收益率</span>
                <span class="profit-val">{{ item.daily_income_rate }}%</span>
              </div>
            </div>
          </div>

          <div class="product-bottom">
            <div class="product-stat">
              <span class="stat-label">最低存款</span>
              <span class="stat-val" translate="no">R${{ parseFloat(item.min_amount) }}</span>
            </div>
            <div class="product-progress-wrap">
              <div class="progress-info">
                <span class="progress-pct">{{ item.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { navigateTo } from '#imports';
import { mealList } from '~/api/meal';
import { getBalance } from '~/api/member';
definePageMeta({ layout: 'default' })
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
const userData = ref({})
onMounted(() => {
  getMealList();
  getBalanceData();
  let user_data = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : null;
  if (user_data) {
    userData.value = user_data
  }
})

//获取余额

const balance = ref(0)
const getBalanceData = () => {
  showLoading($lang('加载中'))
  getBalance({}).then(res => {
    hideLoading();
    if (res.success) {
      balance.value = res.data.amount
    } else {
      showMsg(res.message, 'fail')
    }
  }).catch(error => {
    hideLoading();
    showMsg(error.message, 'fail')

  })
}

//理财列表
const products = ref([])
const totalEarnings = ref(0)
const getMealList = () => {
  showLoading($lang('加载中'))
  mealList({}).then(res => {
    hideLoading();
    if (res.success) {
      products.value = res.data.list
      totalEarnings.value = res.data.total_income_amount
    } else {
      showMsg(res.message, 'fail')
    }

  }).catch(error => {
    hideLoading();
    showMsg(error.message, 'fail')
  })
}

const userInfo = ref({
  account: 'user_8821',
  creditScore: 98,
  balance: '12,580.00',
  totalEarnings: '3,240.50',
  todayEarnings: '128.60',
})



function goRecord() {
  navigateTo('/finance/record')
}

function handleBuy(item) {
  navigateTo(`/finance/detail?id=${item.id}`)
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/config' as *;

.finance {
  background: $color-bg-page;
  min-height: 100vh;
  padding-bottom: rem(80);
}

// Hero Banner
.hero-card {
  margin: rem(12) rem(14);
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  border-radius: $radius-xl;
  padding: rem(20) rem(18);
  box-shadow: $shadow-gold;
  position: relative;
  overflow: hidden;
}

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: rem(20);
  position: relative;
  z-index: 3;
}

.user-info {
  display: flex;
  align-items: center;
  gap: rem(12);
}

.user-avatar {
  width: rem(44);
  height: rem(44);
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: rem(22);
    height: rem(22);
  }
}

.user-account {
  font-size: rem(14);
  font-weight: 700;
  color: $color-white;
  margin-bottom: rem(4);
}

.credit-row {
  display: flex;
  align-items: center;
  gap: rem(4);
}

.credit-icon {
  width: rem(12);
  height: rem(12);
}

.credit-label {
  font-size: rem(11);
  color: rgba(255, 255, 255, 0.7);
}

.credit-val {
  font-size: rem(11);
  font-weight: 700;
  color: #FCD34D;
}

.record-btn {
  display: flex;
  align-items: center;
  gap: rem(5);
  padding: rem(7) rem(12);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: $radius-full;
  font-size: rem(11);
  font-weight: 600;
  color: $color-white;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: $transition-fast;

  svg {
    width: rem(14);
    height: rem(14);
  }

  &:active {
    background: rgba(255, 255, 255, 0.25);
  }
}

.wallet-row {
  margin-bottom: rem(16);
  position: relative;
  z-index: 3;
}

.wallet-label {
  font-size: rem(11);
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: rem(4);
}

.wallet-amount {
  display: flex;
  align-items: baseline;
  gap: rem(3);
}

.wallet-unit {
  font-size: rem(18);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.wallet-num {
  font-size: rem(32);
  font-weight: 800;
  color: $color-white;
  letter-spacing: -1px;
  line-height: 1;
}

.earnings-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: $radius-lg;
  padding: rem(12) rem(16);
  gap: rem(0);
  position: relative;
  z-index: 3;
}

.earning-item {
  flex: 1;
  text-align: center;
}

.earning-val {
  font-size: rem(16);
  font-weight: 700;
  color: $color-white;
  margin-bottom: rem(3);

  &--today {
    color: #6EE7B7;
  }
}

.earning-label {
  font-size: rem(10);
  color: rgba(255, 255, 255, 0.6);
}

.earning-divider {
  width: 1px;
  height: rem(32);
  background: rgba(255, 255, 255, 0.2);
}

// 产品列表
.product-section {
  margin: rem(16) rem(16) 0;
  background: $color-white;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  border: 1px solid $color-border;
  padding-bottom: rem(16);
}

.section-header {
  padding: rem(20) rem(16) rem(12);
  display: flex;
  align-items: center;
  justify-content: space-between;

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

.section-title {
  font-size: rem(15);
  font-weight: 700;
  color: $color-text-primary;
}

.section-count {
  font-size: rem(11);
  color: $color-text-muted;
}

.product-list {
  padding: 0 rem(16);
  display: flex;
  flex-direction: column;
  gap: rem(12);
}

.product-card {
  background: linear-gradient(135deg, $color-bg-page 0%, $color-white 100%);
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  cursor: pointer;
  transition: $transition-fast;

  &:active {
    transform: scale(0.98);
    box-shadow: $shadow-md;
    border-color: $color-primary-light;
  }
}

.product-top {
  display: flex;
  gap: rem(12);
  padding: rem(12);
}

.product-img {
  width: rem(80);
  height: rem(60);
  border-radius: $radius-md;
  object-fit: cover;
  flex-shrink: 0;
  background: $color-gray-100;
}

.product-meta {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: rem(13);
  font-weight: 700;
  color: $color-text-primary;
  margin-bottom: rem(5);
}

.product-days {
  display: flex;
  align-items: center;
  gap: rem(4);
  font-size: rem(11);
  color: $color-text-muted;
  margin-bottom: rem(5);

  svg {
    width: rem(12);
    height: rem(12);
    color: $color-text-muted;
  }
}

.product-profit {
  display: flex;
  align-items: center;
  gap: rem(6);
}

.profit-label {
  font-size: rem(10);
  color: $color-text-muted;
}

.profit-val {
  font-size: rem(14);
  font-weight: 800;
  color: $color-success;
}

.product-bottom {
  display: flex;
  align-items: center;
  gap: rem(12);
  padding: rem(10) rem(12);
  border-top: 1px solid $color-border-light;
  background: $color-gray-50;
}

.product-stat {
  display: flex;
  flex-direction: column;
  gap: rem(2);
  flex-shrink: 0;
}

.stat-label {
  font-size: rem(10);
  color: $color-text-muted;
}

.stat-val {
  font-size: rem(13);
  font-weight: 700;
  color: $color-text-primary;
}

.product-progress-wrap {
  flex: 1;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: rem(5);
}

.progress-label {
  font-size: rem(10);
  color: $color-text-muted;
}

.progress-pct {
  font-size: rem(10);
  font-weight: 700;
  color: $color-primary;
}

.progress-bar {
  height: rem(5);
  background: $color-gray-200;
  border-radius: $radius-full;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: $gradient-primary;
  border-radius: $radius-full;
  transition: width 0.4s ease;
}
</style>
