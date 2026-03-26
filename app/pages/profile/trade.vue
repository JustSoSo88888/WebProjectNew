<template>
    <div class="trade-page">
        <!-- Tab Switch -->
        <div class="tab-container">
            <ScrollTab :tabs="tabList" v-model="activeTab" @change="onTabChange"></ScrollTab>
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { tradingRecord } from '~/api/member';
import Empty from '~/components/Empty.vue';
import ScrollTab from '~/components/ScrollTab.vue';

definePageMeta({ layout: 'second-page' });

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const rows = ref(20)
const list = ref([])
const activeTab = ref(0)
const tabList = ref(
    [
        { type: '', label: '全部' },
        { type: 3, label: '系统赠送' },
        { type: 7, label: '注册赠送' },
        { type: 8, label: '充值' },
        { type: 11, label: '提现' },
        { type: 12, label: '提现驳回' },
        { type: 14, label: '下线收益' },
        { type: 18, label: '理财到期退还本金' },
        { type: 19, label: '理财收益结算' },
        { type: 21, label: '购买理财' },
        { type: 26, label: '用户取消提现' },
        { type: 44, label: '每日签到' },
        { type: 45, label: '红包抽奖记录' },
        { type: 46, label: '红包码兑换' },
        { type: 50, label: '任务奖励' },

    ]
)

const onTabChange = (val) => {
    console.log(val);

}

const onRefresh = () => {
    finished.value = false;
    page.value = 1;
    loading.value = true;
    onLoad();
}

const onLoad = () => {
    let param = {
        page:page.value,
        rows:rows.value,
        type:activeTab.value
    }
}

</script>

<style scoped lang="scss">
.tab-container {
    flex-shrink: 0;
    padding: rem(20) rem(10);
    position: sticky;
    top: 0;
    z-index: 100;
}
</style>
