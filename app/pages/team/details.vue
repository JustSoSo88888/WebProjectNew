<template>
  <div class="team-details">

    <!-- 成员列表 -->
    <div class="member-list">
      <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
        :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
          :finished-text="members.length > 0 ? $lang('没有更多了') : ''" @load="onLoad">
          <template v-if="members.length > 0">
            <div v-for="(item, index) in members" :key="index" class="member-card">
              <div class="member-row">
                <span class="member-label">ID</span>
                <span class="member-value">{{ item.user_id }}</span>
              </div>
              <div class="member-row">
                <span class="member-label">{{ $lang('手机号') }}</span>
                <span class="member-value">{{ item.phone }}</span>
              </div>
              <div class="member-row">
                <span class="member-label">{{ $lang('总充值') }}</span>
                <span class="member-value money" translate="no">R$ {{ parseFloat(item.total_deposit_amount )}}</span>
              </div>
              <div class="member-row">
                <span class="member-label">{{ $lang('总提现') }}</span>
                <span class="member-value money" translate="no">R$ {{ parseFloat(item.total_without_amount) }}</span>
              </div>
              <div class="member-row">
                <span class="member-label">{{ $lang('注册时间') }}</span>
                <span class="member-value">{{ item.register_time }}</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div>
              <Empty></Empty>
            </div>
          </template>
        </van-list>
      </van-pull-refresh>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { teamList } from '~/api/member';
import Empty from '~/components/Empty.vue';
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const rows = ref(20)
const route = useRoute()

definePageMeta({
  layout: 'second-page',
  pageTransition: { name: 'slide-left', mode: 'out-in' },
  layoutTransition: false
})
const members = ref([])

const onLoad = () => {
  let param = {
    rows: rows.value,
    page: page.value,
    deep: route.query.deep ? route.query.deep : 1
  }
  showLoading($lang('加载中'))
  teamList(param).then(res => {
    hideLoading();
    refreshing.value = false
    if (res.success) {
      const dataList = res.data.list || []
      if (page.value <= 1) {
        members.value = dataList
      } else {
        members.value = [...members.value, ...dataList]
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

const onRefresh = () => {
  finished.value = false;
  page.value = 1;
  loading.value = true;
  onLoad();
}
</script>

<style lang="scss" scoped>
.team-details {
  padding: rem(12) rem(14);
}

.stats-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  border-radius: $radius-xl;
  padding: rem(16) rem(12);
  box-shadow: $shadow-gold;
  margin-bottom: rem(12);
}

.stats-item {
  flex: 1;
  text-align: center;
}

.stats-val {
  font-size: rem(16);
  font-weight: 800;
  color: #fff;
  margin-bottom: rem(2);
}

.stats-label {
  font-size: rem(10);
  color: rgba(255, 255, 255, 0.65);
}

.stats-divider {
  width: 1px;
  height: rem(28);
  background: rgba(255, 255, 255, 0.2);
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: rem(10);
}

.member-card {
  background: #fff;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  box-shadow: $shadow-sm;
  padding: rem(12) rem(14);
  display: flex;
  flex-direction: column;
  gap: rem(8);
  margin-bottom: rem(10);
}

.member-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.member-label {
  font-size: rem(12);
  color: $color-text-muted;
}

.member-value {
  font-size: rem(13);
  font-weight: 600;
  color: $color-text-primary;

  &.money {
    color: #d97706;
  }
}
</style>