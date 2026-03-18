<template>
  <div class="team">

    <!-- 顶部统计卡片 -->
    <div class="hero-card">
      <div class="hero-title">我的团队</div>
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-val">{{ teamInfo.totalMembers }}</div>
          <div class="hero-stat-label">团队总人数</div>
        </div>
        <div class="hero-divider"></div>
        <div class="hero-stat">
          <div class="hero-stat-val">¥{{ teamInfo.totalIncome }}</div>
          <div class="hero-stat-label">团队收入</div>
        </div>
        <div class="hero-divider"></div>
        <div class="hero-stat">
          <div class="hero-stat-val">{{ teamInfo.scale }}</div>
          <div class="hero-stat-label">团队规模</div>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ 'tab-item--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 团队分队面板 -->
    <div v-if="activeTab === 'team'" class="panel">
      <div
        v-for="group in teamGroups"
        :key="group.name"
        class="group-card"
      >
        <div class="group-header">
          <span class="group-badge" :style="{ background: group.color }">{{ group.name }}</span>
          <span class="group-members">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            {{ group.members }} 人
          </span>
        </div>
        <div class="group-stats">
          <div class="group-stat" v-for="stat in group.stats" :key="stat.label">
            <div class="group-stat-val">¥{{ stat.val }}</div>
            <div class="group-stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 邀请面板 -->
    <div v-if="activeTab === 'invite'" class="panel">
      <div class="invite-card">
        <div class="qr-wrap">
          <canvas ref="qrCanvas" class="qr-canvas"></canvas>
        </div>
        <div class="invite-title">扫码邀请好友</div>
        <div class="invite-desc">邀请好友加入，获得丰厚推荐奖励</div>
      </div>

      <div class="invite-field">
        <div class="invite-field-label">邀请码</div>
        <div class="invite-field-row">
          <span class="invite-field-val">{{ inviteInfo.code }}</span>
          <button class="copy-btn" @click="copyText(inviteInfo.code, 'code')">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            {{ copied === 'code' ? '已复制' : '复制' }}
          </button>
        </div>
      </div>

      <div class="invite-field">
        <div class="invite-field-label">邀请链接</div>
        <div class="invite-field-row">
          <span class="invite-field-val invite-field-val--link">{{ inviteInfo.link }}</span>
          <button class="copy-btn" @click="copyText(inviteInfo.link, 'link')">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            {{ copied === 'link' ? '已复制' : '复制' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { showToast } from 'vant'
import QRCode from 'qrcode'

definePageMeta({ layout: 'default' })

const activeTab = ref('team')

const tabs = [
  { key: 'team', label: '团队' },
  { key: 'invite', label: '邀请' },
]

const teamInfo = ref({
  totalMembers: 128,
  totalIncome: '45,680',
  scale: '中型',
})

const teamGroups = ref([
  {
    name: 'A队',
    color: 'linear-gradient(135deg, #2563EB, #3B82F6)',
    members: 52,
    stats: [
      { label: '注册会员', val: '52' },
      { label: '任务收入', val: '18,200' },
      { label: '推荐收入', val: '6,400' },
    ],
  },
  {
    name: 'B队',
    color: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    members: 43,
    stats: [
      { label: '注册会员', val: '43' },
      { label: '任务收入', val: '14,560' },
      { label: '推荐收入', val: '4,800' },
    ],
  },
  {
    name: 'C队',
    color: 'linear-gradient(135deg, #059669, #34D399)',
    members: 33,
    stats: [
      { label: '注册会员', val: '33' },
      { label: '任务收入', val: '9,320' },
      { label: '推荐收入', val: '2,400' },
    ],
  },
])

const inviteInfo = ref({
  code: 'SP88210',
  link: 'https://sp.app/invite/SP88210',
})

const copied = ref('')
const qrCanvas = ref(null)

watch(activeTab, (val) => {
  if (val === 'invite') {
    nextTick(() => generateQR())
  }
})

function generateQR() {
  if (!qrCanvas.value) return
  QRCode.toCanvas(qrCanvas.value, inviteInfo.value.link, {
    width: 160,
    margin: 1,
    color: { dark: '#1D4ED8', light: '#EFF6FF' },
  })
}

async function copyText(text, type) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = type
    showToast('复制成功')
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {
    showToast('复制失败，请手动复制')
  }
}
</script>

<style scoped lang="scss">
.team {
  padding-bottom: rem(20);
}

.hero-card {
  margin: rem(12) rem(14);
  background: linear-gradient(135deg, #1D4ED8 0%, #7C3AED 100%);
  border-radius: $radius-xl;
  padding: rem(20) rem(18);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
}

.hero-title {
  font-size: rem(16);
  font-weight: 700;
  color: #fff;
  margin-bottom: rem(16);
}

.hero-stats {
  display: flex;
  align-items: center;
}

.hero-stat {
  flex: 1;
  text-align: center;
}

.hero-stat-val {
  font-size: rem(18);
  font-weight: 800;
  color: #fff;
  margin-bottom: rem(4);
}

.hero-stat-label {
  font-size: rem(10);
  color: rgba(255, 255, 255, 0.65);
}

.hero-divider {
  width: 1px;
  height: rem(32);
  background: rgba(255, 255, 255, 0.2);
}

// Tab
.tab-bar {
  display: flex;
  margin: rem(12) rem(14) rem(10);
  background: #fff;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  padding: rem(4);
  gap: rem(4);
}

.tab-item {
  flex: 1;
  height: rem(36);
  border-radius: $radius-md;
  font-size: rem(13);
  font-weight: 600;
  color: $color-text-muted;
  cursor: pointer;
  transition: $transition-fast;

  &--active {
    background: $color-primary;
    color: #fff;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }
}

.panel {
  padding: 0 rem(14);
  display: flex;
  flex-direction: column;
  gap: rem(10);
}

// 分队卡片
.group-card {
  background: #fff;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  box-shadow: $shadow-sm;
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: rem(12) rem(14);
  border-bottom: 1px solid $color-border-light;
}

.group-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: rem(40);
  height: rem(24);
  border-radius: $radius-full;
  font-size: rem(12);
  font-weight: 700;
  color: #fff;
}

.group-members {
  display: flex;
  align-items: center;
  gap: rem(4);
  font-size: rem(12);
  color: $color-text-muted;

  svg {
    width: rem(14);
    height: rem(14);
  }
}

.group-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: rem(12) rem(8);
}

.group-stat {
  text-align: center;
}

.group-stat-val {
  font-size: rem(14);
  font-weight: 700;
  color: $color-text-primary;
  margin-bottom: rem(3);
}

.group-stat-label {
  font-size: rem(10);
  color: $color-text-muted;
}

// 邀请卡片
.invite-card {
  background: $color-primary-bg;
  border: 1px solid #BFDBFE;
  border-radius: $radius-lg;
  padding: rem(20);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: rem(6);
}

.qr-wrap {
  background: #EFF6FF;
  border-radius: $radius-lg;
  padding: rem(10);
  box-shadow: $shadow-sm;
  margin-bottom: rem(4);
}

.qr-canvas {
  display: block;
  border-radius: $radius-md;
}

.invite-title {
  font-size: rem(15);
  font-weight: 700;
  color: $color-text-primary;
}

.invite-desc {
  font-size: rem(12);
  color: $color-text-muted;
  text-align: center;
}

.invite-field {
  background: #fff;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: rem(14);
  box-shadow: $shadow-sm;
}

.invite-field-label {
  font-size: rem(11);
  color: $color-text-muted;
  margin-bottom: rem(8);
}

.invite-field-row {
  display: flex;
  align-items: center;
  gap: rem(10);
}

.invite-field-val {
  flex: 1;
  font-size: rem(15);
  font-weight: 700;
  color: $color-text-primary;
  min-width: 0;

  &--link {
    font-size: rem(12);
    font-weight: 500;
    color: $color-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: rem(4);
  padding: rem(7) rem(12);
  background: $color-primary;
  border-radius: $radius-full;
  font-size: rem(12);
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: $transition-fast;

  svg {
    width: rem(13);
    height: rem(13);
  }

  &:active {
    opacity: 0.85;
  }
}
</style>
