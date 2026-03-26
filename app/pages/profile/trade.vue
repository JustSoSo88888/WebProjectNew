<template>
    <div class="trade-page">
        <!-- Tab Switch -->
        <div class="tab-container">
            <ScrollTab :tabs="tabList" v-model="activeTab" @change="onTabChange"></ScrollTab>
        </div>
        <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
            :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
                :finished-text="list.length > 0 ? $lang('没有更多了') : $lang('暂无数据')" @load="onLoad">
                <template v-if="list.length > 0">
                    <div class="list-item" v-for="(item, index) in list" :key="index">
                        <div class="item-main">
                            <span class="col-type">{{ 123 }}</span>
                            <span class="col-amount" :class="item.change_type == 1 ? 'positive' : 'negative'">
                                {{ item.change_type == 1 ? '+' : '-' }}R${{ item.amount }}
                            </span>
                        </div>
                        <div class="item-footer">
                            <span class="col-id">R${{ parseFloat(item.before_amount) }}→R${{
                                parseFloat(item.after_amount) }}</span>
                            <span class="col-time">{{ item.update_time }}</span>
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
</template>

<script setup>
import { ref, computed} from 'vue';
import { tradingRecord } from '~/api/member';
import Empty from '~/components/Empty.vue';
import ScrollTab from '~/components/ScrollTab.vue';
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
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

const getAcTive = computed(() => {
    const type = tabList.value[activeTab.value].type
    return type
})

const onTabChange = (val) => {
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
        type: getAcTive.value
    }
    showLoading($lang('加载中'))
    tradingRecord(param).then(res => {
        hideLoading();
        refreshing.value = false
        if (res.success) {
            const dataList = res.data.rows || []
            if (page.value <= 1) {
                list.value = dataList
            } else {
                list.value = [...list.value, ...dataList]
            }
            if (dataList.length >= rows.value) {
                page++
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
        loading = false;
        hideLoading();
        showMsg(error.message, 'fail')
    })

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

.list-item {
    padding: rem(16);
    border-bottom: rem(1) solid $color-border-light;
    font-size: rem(14);
    background: #fff;
    border-radius: rem(10);
    margin: 0 rem(10) rem(10);

    &:last-child {
        border-bottom: none;
    }
}

.item-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: rem(4);
}

.item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.col-type {
    color: $color-text-primary;
    font-weight: 500;
}

.col-amount {
    font-weight: 600;

    &.positive {
        color: $color-success;
    }

    &.negative {
        color: $color-danger;
    }
}

.col-id {
    color: $color-text-muted;
    font-size: rem(12);
}

.col-time {
    color: $color-text-muted;
    font-size: rem(12);
}
</style>
