<template>
  <div class="task-page">
    <section class="task-summary" aria-label="Task progress">
      <div class="task-summary-copy">
        <span>{{ $lang('任务中心') }}</span>
        <h1>{{ $lang('今日进度') }}</h1>
        <p>{{ $lang('完成广告任务后，奖励将自动进入账户') }}</p>
      </div>

      <div class="ring-wrap" aria-label="Completion progress">
        <svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="ring-track" cx="50" cy="50" r="40"></circle>
          <circle class="ring-progress" cx="50" cy="50" r="40" :stroke-dasharray="`${progressArc} ${circumference}`"
            stroke-dashoffset="0"></circle>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F04444"></stop>
              <stop offset="100%" stop-color="#CE0000"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div class="ring-center">
          <strong>{{ progressPct }}%</strong>
          <small>{{ $lang('完成') }}</small>
        </div>
      </div>
    </section>

    <section class="task-metrics" aria-label="Task stats">
      <article class="metric-card">
        <span>{{ $lang('进行中') }}</span>
        <strong>{{ todayUndoneCount }}</strong>
      </article>
      <article class="metric-card metric-card--success">
        <span>{{ $lang('已完成') }}</span>
        <strong>{{ todayCompletedCount }}</strong>
      </article>
      <article class="metric-card metric-card--total">
        <span>{{ $lang('全部') }}</span>
        <strong>{{ totalCount }}</strong>
      </article>
    </section>

    <div class="task-panel">
      <div class="tabs" role="tablist" aria-label="Task filters">
        <button v-for="tab in tabs" :key="tab.key" type="button" role="tab" class="tab-btn"
          :class="{ active: activeTab === tab.key }" :aria-selected="activeTab === tab.key" @click="handleTab(tab.key)">
          {{ tab.label }}
        </button>
      </div>

      <div class="task-list">
        <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
          :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
          <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
            :finished-text="list.length > 0 ? $lang('没有更多了') : ''" @load="onLoad">
            <template v-if="list.length > 0">
              <article v-for="task in list" :key="task.id" class="task-card"
                :class="{ 'is-completed': task.status == 1 }" :tabindex="task.status == 1 ? -1 : 0"
                :aria-disabled="task.status == 1" @click="toDetails(task)" @keydown.enter.prevent="toDetails(task)"
                @keydown.space.prevent="toDetails(task)">
                <div class="task-img-box">
                  <img :src="task.image_url" :alt="task.product_name || $lang('任务图片')" class="task-img"
                    loading="lazy">
                </div>
                <div class="task-body">
                  <div class="task-status-pill" :class="task.status == 1 ? 'is-done' : 'is-active'">
                    {{ task.status == 1 ? $lang('已完成') : $lang('进行中') }}
                  </div>
                  <h2 class="task-name">{{ task.product_name }}</h2>
                  <div class="task-bottom">
                    <div class="reward-block">
                      <span>{{ $lang('收益') }}</span>
                      <strong class="reward-amount"
                        :class="task.status == 1 ? 'reward-amount--success' : 'reward-amount--warning'"
                        translate="no">PKR {{ formatAmount(task.income_amount) }}</strong>
                    </div>
                    <button type="button" class="task-btn" :disabled="task.status == 1"
                      :class="task.status == 1 ? 'task-btn--done' : 'task-btn--active'" @click.stop="toDetails(task)">
                      {{ task.status == 1 ? $lang('已完成') : $lang('开始') }}
                    </button>
                  </div>
                </div>
              </article>
            </template>
            <template v-else>
              <div class="task-empty">
                <Empty></Empty>
              </div>
            </template>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { navigateTo } from '#imports'
import { memberProductOrderList } from '~/api/member'
import Empty from '~/components/Empty.vue'
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

const formatAmount = (amount) => {
  const value = Number.parseFloat(amount)
  return Number.isFinite(value) ? value : 0
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
@use '~/assets/scss/config' as *;

.task-page {
  min-height: 100dvh;
  background: #F5F6F8;
  padding: rem(14) rem(14) rem(86);
}

.task-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) rem(94);
  align-items: center;
  gap: rem(14);
  min-height: rem(168);
  padding: rem(24) rem(20);
  border-radius: rem(8);
  background: linear-gradient(180deg, #F7BFC2 0%, #FBE3E4 100%);
  box-shadow: 0 rem(12) rem(28) rgba(113, 32, 32, 0.08);
}

.task-summary-copy {
  span {
    display: inline-flex;
    align-items: center;
    min-height: rem(26);
    padding: 0 rem(10);
    border-radius: rem(4);
    background: rgba(255, 255, 255, 0.76);
    color: $color-primary;
    font-size: rem(12);
    font-weight: 850;
  }

  h1 {
    margin: rem(12) 0 rem(8);
    color: $color-text-primary;
    font-size: rem(28);
    line-height: 1.12;
    font-weight: 900;
  }

  p {
    margin: 0;
    max-width: rem(210);
    color: rgba(49, 55, 65, 0.86);
    font-size: rem(14);
    line-height: 1.55;
  }
}

.ring-wrap {
  position: relative;
  width: rem(94);
  height: rem(94);
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.78);
  stroke-width: 8;
}

.ring-progress {
  fill: none;
  stroke: url(#ringGrad);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.28s ease-out;
}

.ring-center {
  position: absolute;
  inset: rem(14);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.82);

  strong {
    color: $color-text-primary;
    font-size: rem(18);
    line-height: 1;
    font-weight: 900;
  }

  small {
    margin-top: rem(4);
    color: $color-text-muted;
    font-size: rem(10);
    line-height: 1;
  }
}

.task-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: rem(8);
  margin: rem(10) 0 rem(12);
}

.metric-card {
  min-height: rem(74);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: rem(8);
  padding: rem(12);
  border: 1px solid rgba(22, 24, 30, 0.06);
  border-radius: rem(8);
  background: $color-white;

  span {
    color: $color-text-muted;
    font-size: rem(12);
    line-height: 1;
    white-space: nowrap;
  }

  strong {
    color: $color-primary;
    font-size: rem(24);
    line-height: 1;
    font-weight: 900;
  }

  &--success strong {
    color: $color-success;
  }

  &--total strong {
    color: $color-text-primary;
  }
}

.task-panel {
  padding: rem(6) 0 0;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: rem(4);
  min-height: rem(46);
  padding: rem(4);
  margin-bottom: rem(10);
  border: 1px solid rgba(22, 24, 30, 0.06);
  border-radius: rem(8);
  background: $color-white;
}

.tab-btn {
  min-height: rem(38);
  border-radius: rem(5);
  color: $color-text-muted;
  font-size: rem(14);
  font-weight: 800;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease;

  &.active {
    background: #303030;
    color: $color-white;
  }

  &:active {
    transform: scale(0.98);
  }
}

.task-list {
  min-height: rem(320);
}

.task-card {
  display: grid;
  grid-template-columns: rem(126) minmax(0, 1fr);
  gap: rem(12);
  min-height: rem(126);
  padding: rem(10);
  margin-bottom: rem(10);
  border: 1px solid rgba(22, 24, 30, 0.07);
  border-radius: rem(8);
  background: $color-white;
  box-shadow: 0 rem(8) rem(18) rgba(31, 31, 31, 0.045);
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;

  &:active {
    transform: scale(0.99);
    background: #FAFAFA;
  }

  &:focus-visible {
    outline: rem(2) solid rgba(206, 0, 0, 0.36);
    outline-offset: rem(2);
  }

  &.is-completed {
    cursor: default;
  }
}

.task-img-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: rem(6);
  background: $color-gray-100;
}

.task-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.task-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.task-status-pill {
  width: max-content;
  max-width: 100%;
  min-height: rem(24);
  display: inline-flex;
  align-items: center;
  padding: 0 rem(9);
  border-radius: rem(4);
  font-size: rem(11);
  line-height: 1;
  font-weight: 850;

  &.is-active {
    background: $color-primary-bg;
    color: $color-primary;
  }

  &.is-done {
    background: $color-success-bg;
    color: $color-success;
  }
}

.task-name {
  margin: rem(9) 0 auto;
  color: $color-text-primary;
  font-size: rem(15);
  line-height: 1.42;
  font-weight: 850;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: anywhere;
}

.task-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) rem(76);
  align-items: end;
  gap: rem(10);
  margin-top: rem(12);
}

.reward-block {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: rem(4);

  span {
    color: $color-text-muted;
    font-size: rem(11);
    line-height: 1;
  }
}

.reward-amount {
  font-size: rem(17);
  line-height: 1.15;
  font-weight: 900;
  overflow-wrap: anywhere;

  &--success {
    color: $color-success;
  }

  &--warning {
    color: $color-primary;
  }
}

.task-btn {
  min-height: rem(44);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 rem(12);
  border-radius: rem(4);
  font-size: rem(13);
  font-weight: 850;
  white-space: nowrap;
  transition: transform 0.16s ease, background 0.16s ease;

  &--active {
    background: #303030;
    color: $color-white;
  }

  &--done {
    background: $color-text-muted-bg;
    color: $color-text-muted;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  &:not(:disabled):active {
    transform: scale(0.96);
  }

  &:disabled {
    cursor: default;
  }
}

.task-empty {
  padding: rem(36) 0;
  border-radius: rem(8);
  background: $color-white;
}

@media (max-width: 374px) {
  .task-page {
    padding-inline: rem(10);
  }

  .task-summary {
    grid-template-columns: minmax(0, 1fr) rem(82);
    padding: rem(20) rem(16);
  }

  .task-summary-copy h1 {
    font-size: rem(25);
  }

  .ring-wrap {
    width: rem(82);
    height: rem(82);
  }

  .task-card {
    grid-template-columns: rem(108) minmax(0, 1fr);
    gap: rem(10);
  }

  .task-bottom {
    grid-template-columns: minmax(0, 1fr) rem(66);
  }

  .reward-amount {
    font-size: rem(15);
  }
}
</style>
