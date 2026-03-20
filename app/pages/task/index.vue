<template>
  <div class="task-page">

    <!-- Stats Header -->
    <div class="stats-header">
      <div class="ring-wrap">
        <svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="ring-track" cx="50" cy="50" r="40" />
          <circle
            class="ring-progress"
            cx="50" cy="50" r="40"
            :stroke-dasharray="`${progressArc} ${circumference}`"
            stroke-dashoffset="0"
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2563EB" />
              <stop offset="100%" stop-color="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <div class="ring-center">
          <div class="ring-pct">{{ progressPct }}%</div>
          <div class="ring-sub">完成率</div>
        </div>
      </div>

      <div class="stats-info">
        <div class="stat-item">
          <div class="stat-val stat-val--blue">{{ inProgressCount }}</div>
          <div class="stat-label">进行中</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-val stat-val--green">{{ completedCount }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-val">{{ totalCount }}</div>
          <div class="stat-label">全部任务</div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-card"
      >
        <img :src="task.image" :alt="task.name" class="task-img" loading="lazy" />
        <div class="task-body">
          <div class="task-name">{{ task.name }}</div>
          <div class="task-reward">
            <span class="reward-label">收益</span>
            <span class="reward-amount">+R${{ task.reward }}</span>
          </div>
          <div v-if="task.status === 'completed'" class="task-time">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
              <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            {{ task.completedAt }}
          </div>
        </div>
        <button
          class="task-btn"
          :class="task.status === 'completed' ? 'task-btn--done' : 'task-btn--active'"
          :aria-label="task.status === 'completed' ? '任务已完成' : '任务进行中'"
        >
          {{ task.status === 'completed' ? '已完成' : '进行中' }}
        </button>
      </div>

      <div v-if="filteredTasks.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>暂无任务</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import img1 from '@/assets/img/index/1.jpg'
import img2 from '@/assets/img/index/2.jpg'
import img3 from '@/assets/img/index/3.jpg'
import img4 from '@/assets/img/index/4.jpg'

definePageMeta({ layout: 'default' })

const activeTab = ref('inprogress')

const tasks = ref([
  { id: 1, name: '完成品牌推广视频拍摄', reward: '320.00', image: img1, status: 'inprogress', completedAt: null },
  { id: 2, name: '社交媒体内容创作任务', reward: '180.00', image: img2, status: 'inprogress', completedAt: null },
  { id: 3, name: '产品评测文章撰写', reward: '250.00', image: img3, status: 'completed', completedAt: '2026-03-17 14:32' },
  { id: 4, name: '直播带货推广活动', reward: '500.00', image: img4, status: 'completed', completedAt: '2026-03-16 09:15' },
  { id: 5, name: '新品试用体验报告', reward: '150.00', image: img1, status: 'inprogress', completedAt: null },
  { id: 6, name: '用户调研问卷填写', reward: '80.00', image: img2, status: 'completed', completedAt: '2026-03-15 18:44' },
])

const inProgressCount = computed(() => tasks.value.filter(t => t.status === 'inprogress').length)
const completedCount = computed(() => tasks.value.filter(t => t.status === 'completed').length)
const totalCount = computed(() => tasks.value.length)

const circumference = 2 * Math.PI * 40
const progressArc = computed(() =>
  totalCount.value === 0 ? 0 : (completedCount.value / totalCount.value) * circumference
)
const progressPct = computed(() =>
  totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100)
)

const tabs = computed(() => [
  { key: 'inprogress', label: '进行中', count: inProgressCount.value },
  { key: 'all',        label: '全部',   count: totalCount.value },
  { key: 'completed',  label: '完成',   count: completedCount.value },
])

const filteredTasks = computed(() => {
  if (activeTab.value === 'inprogress') return tasks.value.filter(t => t.status === 'inprogress')
  if (activeTab.value === 'completed')  return tasks.value.filter(t => t.status === 'completed')
  return tasks.value
})
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
  background: linear-gradient(135deg, #F0F5FF 0%, #EDE9FE 100%);
  border: 1px solid #DBEAFE;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
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
}

.stat-val {
  font-size: rem(22);
  font-weight: 800;
  color: $color-text-primary;
  line-height: 1;

  &--blue  { color: $color-primary; }
  &--green { color: $color-success; }
}

.stat-label {
  font-size: rem(11);
  color: $color-text-muted;
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: rem(32);
  background: #DBEAFE;
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
  display: flex;
  flex-direction: column;
  gap: rem(10);
  padding: 0 rem(14);
}

.task-card {
  display: flex;
  align-items: center;
  gap: rem(12);
  padding: rem(12);
  background: #FFFFFF;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: $transition-fast;

  &:active {
    background: $color-bg-hover;
  }
}

.task-img {
  flex-shrink: 0;
  width: rem(64);
  height: rem(64);
  border-radius: $radius-md;
  object-fit: cover;
  background: $color-gray-100;
}

.task-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: rem(5);
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
  font-size: rem(14);
  font-weight: 800;
  color: $color-warning;
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
    border: 1.5px solid rgba(37, 99, 235, 0.25);

    &:active { background: #DBEAFE; }
  }

  &--done {
    background: $color-success-bg;
    color: $color-success;
    border: 1.5px solid rgba(5, 150, 105, 0.25);

    &:active { background: #D1FAE5; }
  }
}

// Empty
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: rem(10);
  padding: rem(60) 0;
  color: $color-text-muted;

  svg {
    width: rem(40);
    height: rem(40);
    opacity: 0.4;
  }

  span {
    font-size: rem(13);
  }
}
</style>
