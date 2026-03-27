<template>
  <div class="task-page">

    <!-- Stats Header -->
    <div class="stats-header">
      <!-- <ConnectionStatus class="ws-ststus"></ConnectionStatus> -->
      <div class="ring-wrap">
        <svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="ring-track" cx="50" cy="50" r="40" />
          <circle class="ring-progress" cx="50" cy="50" r="40" :stroke-dasharray="`${progressArc} ${circumference}`"
            stroke-dashoffset="0" />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
          </defs>
        </svg>
        <div class="ring-center">
          <div class="ring-pct">{{ progressPct }}%</div>
        </div>
      </div>

      <div class="stats-info">
        <div class="stat-item">
          <div class="stat-val stat-val--blue">{{ todayUndoneCount }}</div>
          <div class="stat-label">{{ $lang('进行中') }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-val stat-val--green">{{ todayCompletedCount }}</div>
          <div class="stat-label">{{ $lang('已完成') }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-val">{{ totalCount }}</div>
          <div class="stat-label">{{ $lang('全部') }}</div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.key" class="tab-btn" :class="{ active: activeTab === tab.key }"
        @click="handleTab(tab.key)">
        {{ tab.label }}
      </button>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
        :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
          :finished-text="list.length > 0 ? $lang('没有更多了') : ''" @load="onLoad">
          <template v-if="list.length > 0">
            <div v-for="task in list" :key="task.id" class="task-card" @click="toDetails(task)">
              <div class="task-img-box">
                <img :src="task.image_url" class="task-img" />
              </div>
              <div class="task-body">
                <div class="task-name">{{ task.product_name }}</div>
                <!-- <div class="task-reward">
                  <span class="reward-label">{{ $lang('收益') }}</span>
                  
                </div> -->
                <div class="task-bottom">
                  <div class="reward-amount"
                    :class="task.status == 1 ? 'reward-amount--success' : 'reward-amount--warning'" translate="no">R${{
                      parseFloat(task.income_amount) }}</div>
                  <button class="task-btn" :class="task.status == 1 ? 'task-btn--done' : 'task-btn--active'">
                    {{ task.status == 1 ? $lang('已完成') : $lang('进行中') }}
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <Empty></Empty>
          </template>
        </van-list>
      </van-pull-refresh>


    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#imports'
import { memberProductOrderList } from '~/api/member'
import Empty from '~/components/Empty.vue'
import ConnectionStatus from '~/components/ConnectionStatus.vue'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
definePageMeta({ layout: 'default' })
const appStore = useAppStore()

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const rows = ref(20)
const list = ref([])
const activeTab = ref(0)
const totalCount = ref(0)
const todayUndoneCount = ref(0)
const todayCompletedCount = ref(0)
const tabs = computed(() => [
  { key: 0, label: $lang('进行中') },
  { key: '', label: $lang('全部') },
  { key: 1, label: $lang('完成') },
])

const toDetails = (task) => {
  if (task.status == 1) return
  appStore.setTaskData(task)
  navigateTo('/task/details')
}

const circumference = 2 * Math.PI * 40
const progressArc = computed(() =>
  totalCount.value === 0 ? 0 : (todayCompletedCount.value / totalCount.value) * circumference
)
const progressPct = computed(() =>
  totalCount.value === 0 ? 0 : Math.round((todayCompletedCount.value / totalCount.value) * 100)
)

const handleTab = (key) => {
  activeTab.value = key
  onRefresh()
}

const onRefresh = () => {
  finished.value = false;
  page.value = 1;
  loading.value = true;
  onLoad();
}

const onLoad = () => {
  let param = {
    page: page.value,
    rows: rows.value,
    status: activeTab.value
  }
  showLoading($lang('加载中'))
  memberProductOrderList(param).then(res => {
    hideLoading();
    refreshing.value = false
    if (res.success) {

      todayUndoneCount.value = res.data.today_undone_count || 0
      todayCompletedCount.value = res.data.today_completed_count || 0
      totalCount.value = res.data.today_undone_count + res.data.today_completed_count
      const dataList = res.data.rows || []
      if (page.value <= 1) {
        list.value = dataList
      } else {
        list.value = [...list.value, ...dataList]
      }
      if (dataList.length >= rows.value) {
        page.value++
      } else {
        finished.value = true
      }

    } else {
      showMsg(res.message, 'fail')
      finished.value = true
    }
    loading.value = false
  }).catch(error => {
    finished.value = true
    loading.value = false;
    hideLoading();
    showMsg(error.message, 'fail')
  })
}





</script>

<style scoped lang="scss">
.task-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: rem(24);
}

// ── Stats Header ──────────────────────────────────────────
.stats-header {
  display: flex;
  align-items: center;
  gap: rem(20);
  margin: rem(14);
  padding: rem(20) rem(18);
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
  border: 1px solid #FDE68A;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  position: relative;

  .ws-ststus{
    position: absolute;
    right: rem(10);
    top: rem(10);
  }
}

// Ring
.ring-wrap {
  position: relative;
  flex-shrink: 0;
  width: rem(100);
  height: rem(100);
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track {
  fill: none;
  stroke: #E2E8F0;
  stroke-width: 8;
}

.ring-progress {
  fill: none;
  stroke: url(#ringGrad);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-pct {
  font-size: rem(18);
  font-weight: 800;
  color: $color-text-primary;
  line-height: 1;
}

.ring-sub {
  font-size: rem(10);
  color: $color-text-muted;
  margin-top: rem(3);
}

// Stats
.stats-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: rem(4);
  flex: 1;
}

.stat-val {
  font-size: rem(22);
  font-weight: 800;
  color: $color-text-primary;
  line-height: 1;

  &--blue {
    color: $color-primary;
  }

  &--green {
    color: $color-success;
  }
}

.stat-label {
  font-size: rem(11);
  color: $color-text-muted;
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: rem(32);
  background: #FDE68A;
}

// ── Tabs ──────────────────────────────────────────────────
.tabs {
  display: flex;
  margin: 0 rem(14) rem(10);
  background: #FFFFFF;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: rem(4);
  gap: rem(4);
  box-shadow: $shadow-xs;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: rem(5);
  height: rem(38);
  border-radius: $radius-md;
  font-size: rem(13);
  font-weight: 600;
  color: $color-text-muted;
  cursor: pointer;
  transition: $transition-fast;

  &.active {
    background: $gradient-primary;
    color: #fff;
    box-shadow: $shadow-blue;
  }

  &:not(.active):active {
    background: $color-bg-hover;
  }
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: rem(18);
  height: rem(18);
  padding: 0 rem(5);
  border-radius: $radius-full;
  font-size: rem(10);
  font-weight: 700;
  background: rgba(255, 255, 255, 0.25);
  color: inherit;

  .tab-btn:not(.active) & {
    background: $color-primary-bg;
    color: $color-primary;
  }
}

// ── Task List ─────────────────────────────────────────────
.task-list {
  padding: 0 rem(14);
}

.task-card {
  display: flex;
  align-items: stretch;
  padding: rem(12);
  background: #FFFFFF;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  margin-bottom: rem(10);
  cursor: pointer;
  transition: $transition-fast;
  box-sizing: border-box;

  &:active {
    background: $color-bg-hover;
  }
}

.task-img-box {
  flex-shrink: 0;
  height: rem(100);
  aspect-ratio: 16/9;
  overflow: hidden;
  display: flex;
  border-radius: rem(10);
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  .task-img {
    width: 100%;
    height: auto;
  }
}


.task-body {
  width: rem(133);
  display: flex;
  margin-left: rem(10);
  box-sizing: border-box;
  justify-content: space-between;
  flex-direction: column;

  .task-bottom {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

}

.task-name {
  font-size: rem(13);
  font-weight: 600;
  color: $color-text-primary;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  box-sizing: border-box;
}

.task-reward {
  display: flex;
  align-items: center;
  gap: rem(5);
}

.reward-label {
  font-size: rem(10);
  color: $color-text-muted;
  background: $color-warning-bg;
  border: 1px solid #FDE68A;
  border-radius: $radius-full;
  padding: rem(1) rem(6);
}

.reward-amount {
  font-size: rem(16);
  font-weight: 800;

  margin-bottom: rem(5);

  &--success {
    color: $color-success;
  }

  &--warning {
    color: $color-warning;
  }
}

.task-time {
  display: flex;
  align-items: center;
  gap: rem(4);
  font-size: rem(10);
  color: $color-text-muted;

  svg {
    width: rem(12);
    height: rem(12);
    flex-shrink: 0;
  }
}

// Buttons
.task-btn {
  flex-shrink: 0;
  height: rem(34);
  width: 100%;
  padding: 0 rem(14);
  border-radius: $radius-full;
  font-size: rem(12);
  font-weight: 700;
  cursor: pointer;
  transition: $transition-fast;
  white-space: nowrap;

  &--active {
    background: $color-primary-bg;
    color: $color-primary;
    border: 1.5px solid rgba(217, 119, 6, 0.25);

    &:active {
      background: #FDE68A;
    }
  }

  &--done {
    background: $color-success-bg;
    color: $color-success;
    border: 1.5px solid rgba(5, 150, 105, 0.25);

    &:active {
      background: #D1FAE5;
    }
  }
}
</style>
