<template>
  <div class="team">

    <!-- 顶部统计卡片 -->
    <div class="hero-card">
      <div class="hero-title">{{ $lang('我的团队') }}</div>
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-val" translate="no">{{ totalCount }}</div>
          <div class="hero-stat-label">{{ $lang('团队总人数') }}</div>
        </div>
        <div class="hero-divider"></div>
        <div class="hero-stat">
          <div class="hero-stat-val" translate="no">R$ {{ teamData.total_award_amount }}</div>
          <div class="hero-stat-label">{{ $lang('团队收入') }}</div>
        </div>
        <div class="hero-divider"></div>
        <div class="hero-stat">
          <div class="hero-stat-val">{{ scaleStr }}</div>
          <div class="hero-stat-label">{{ $lang('团队规模') }}</div>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-bar">
      <button v-for="tab in tabs" :key="tab.key" class="tab-item" :class="{ 'tab-item--active': activeTab === tab.key }"
        @click="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <!-- 团队分队面板 -->
    <div v-if="activeTab === 'team'" class="panel">
      <div v-for="group in teamGroups" :key="group.name" class="group-card"
        @click="navigateTo({ path: '/team/details', query: { title: group.name, deep: group.deep } })">
        <div class="group-header">
          <span class="group-badge" :style="{ background: group.color }">{{ group.name }}</span>
          <span class="group-members">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" />
            </svg>
            {{ group.number }} {{ $lang('人') }}
          </span>
        </div>
        <div class="group-stats">
          <div class="group-stat">
            <div class="group-stat-val" translate="no">{{ group.registerCount }}</div>
            <div class="group-stat-label">{{ $lang('注册人数') }}</div>
          </div>
          <div class="group-stat">
            <div class="group-stat-val" translate="no">R$ {{ group.taskIncome }}</div>
            <div class="group-stat-label">{{ $lang('任务收入') }}</div>
          </div>
          <div class="group-stat">
            <div class="group-stat-val" translate="no">R$ {{ group.referralIncome }}</div>
            <div class="group-stat-label">{{ $lang('推荐收入') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 邀请面板 -->
    <div v-if="activeTab === 'invite' && showInvite" class="panel">
      <div class="invite-card">
        <div class="qr-wrap">
          <canvas ref="qrCanvas" class="qr-canvas"></canvas>
        </div>
        <div class="invite-title">{{ $lang('扫码邀请好友') }}</div>
        <div class="invite-desc">{{ $lang('邀请好友加入，获得丰厚推荐奖励') }}</div>
      </div>

      <div class="invite-field">
        <div class="invite-field-label">{{ $lang('邀请码') }}</div>
        <div class="invite-field-row">
          <span class="invite-field-val">{{ inviteInfo.code }}</span>
          <button class="copy-btn" @click="copyText(inviteInfo.code, 'code')">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" />
            </svg>
            {{ copied === 'code' ? $lang('已复制') : $lang('复制') }}
          </button>
        </div>
      </div>

      <div class="invite-field">
        <div class="invite-field-label">{{ $lang('邀请链接') }}</div>
        <div class="invite-field-row">
          <span class="invite-field-val invite-field-val--link">{{ inviteInfo.link }}</span>
          <button class="copy-btn" @click="copyText(inviteInfo.link, 'link')">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.8" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" />
            </svg>
            {{ copied === 'link' ? $lang('已复制') : $lang('复制') }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'invite' && !showInvite" class="upgrade-tip">
      {{ $lang('升级即可获得特权和奖励。') }}
    </div>

  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import { showToast } from 'vant'
import { useRoute } from 'vue-router'
import QRCode from 'qrcode'
import config from '~/config'
import { storage } from '../../utils/index';
import { basicData, getBalance } from '~/api/member'
import { navigateTo } from '#imports'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

definePageMeta({ layout: 'default' })

onMounted(() => {
  init();
})

const init = () => {
  if (route.query.tab) {
    activeTab.value = route.query.tab;
  }
  const userData = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : null;
  if (userData) {
    inviteInfo.value.code = userData.invite_code
    inviteInfo.value.link = config.frontUrl + '/login/register?code=' + userData.invite_code
  }

}


const teamData = ref({})
const totalCount = ref(0)
const getBsicData = () => {
  showLoading($lang('加载中'))
  basicData({}).then(res => {
    hideLoading();
    if (res.success) {
      teamData.value = res.data;
      teamGroups.value[0].taskIncome = res.data.one_generation_order_award_amount//一级任务推荐收入
      teamGroups.value[0].referralIncome = res.data.one_generation_meal_award_amount
      teamGroups.value[0].number = res.data.one_sub_count
      teamGroups.value[0].registerCount = res.data.one_sub_count

      teamGroups.value[1].taskIncome = res.data.two_generation_order_award_amount//二级任务推荐收入
      teamGroups.value[1].referralIncome = res.data.two_generation_meal_award_amount
      teamGroups.value[1].number = res.data.two_sub_count
      teamGroups.value[1].registerCount = res.data.two_sub_count

      teamGroups.value[2].taskIncome = res.data.three_generation_order_award_amount//三级任务推荐收入
      teamGroups.value[2].referralIncome = res.data.three_generation_meal_award_amount
      teamGroups.value[2].number = res.data.three_sub_count
      teamGroups.value[2].registerCount = res.data.three_sub_count
      totalCount.value = Number(res.data.three_sub_count) + Number(res.data.two_sub_count) + Number(res.data.one_sub_count)
    } else {
      showMsg(res.message, 'fail')
    }
  }).catch(error => {
    hideLoading();
    showMsg(error.message, 'fail')

  })
}

const scaleStr = computed(() => {
  if (Number(totalCount.value) < 30) {
    return $lang('小型')
  } else if (totalCount.value < 100) {
    return $lang('中型')
  } else {
    return $lang('大型')
  }

})


const route = useRoute()
const activeTab = ref('team')
const tabs = [
  { key: 'team', label: $lang('团队') },
  { key: 'invite', label: $lang('邀请') },
]

const teamGroups = ref([
  {
    name: $lang('A团队'),
    color: 'linear-gradient(135deg, #d97706, #FBBF24)',
    number: 0,
    taskIncome: 0,
    referralIncome: 0,
    deep: 1,
    registerCount: 0,

  },
  {
    name: $lang('B团队'),
    color: 'linear-gradient(135deg, #b45309, #d97706)',
    number: 0,
    taskIncome: 0,
    referralIncome: 0,
    deep: 2,
    registerCount: 0,
  },
  {
    name: $lang('C团队'),
    color: 'linear-gradient(135deg, #059669, #34D399)',
    number: 0,
    taskIncome: 0,
    referralIncome: 0,
    deep: 3,
    registerCount: 0,
  },
])

const inviteInfo = ref({
  code: '',
  link: '',
})

const copied = ref('')
const qrCanvas = ref(null)



const showInvite = ref(false)
watch(activeTab, async (val) => {
  if (val === 'invite') {
    try {
      showLoading($lang('加载中'))
      let res = await getBalance();
      if (res.success) {
        hideLoading();
        if (res.data.can_invite != 0) {
          nextTick(() => generateQR())
          showInvite.value = true
        } else {
          showInvite.value = false
        }
      } else {
        showMsg(res.message, 'fail')
      }
    } catch (error) {
      hideLoading();
      showMsg(error.message, 'fail')
    }
  } else {
    getBsicData();
  }
}, {
  immediate: true
})

function generateQR() {
  if (!qrCanvas.value) return
  QRCode.toCanvas(qrCanvas.value, inviteInfo.value.link, {
    width: 160,
    margin: 1,
    color: { dark: '#d97706', light: '#FFFBEB' },
  })
}

async function copyText(text, type) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = type
    showMsg($lang('复制成功'),'success')
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {
    showMsg($lang('复制失败，请手动复制'), 'fail')
  }
}
</script>

<style scoped lang="scss">
.team {
  padding-bottom: rem(20);
}

.hero-card {
  margin: rem(12) rem(14);
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  border-radius: $radius-xl;
  padding: rem(20) rem(18);
  box-shadow: $shadow-gold;
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
  padding: 0 rem(10);
  box-sizing: border-box;
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
  background: $color-primary-bg;
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
.upgrade-tip {
  padding: rem(24) rem(16);
  height: rem(100);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: $color-text-muted;
  font-size: rem(14);
  background: $color-bg-page;
  border-radius: $radius-lg;
  margin: 0 rem(14);
  border: 1px dashed $color-border;
}

</style>
