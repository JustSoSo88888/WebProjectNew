<template>
    <div class="trade-page">
        <!-- Tab Switch -->
        <div class="tab-container">
            <ScrollTab :tabs="tabList" v-model="activeTab" @change="onTabChange"></ScrollTab>
        </div>
        <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
            :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
                :finished-text="list.length > 0 ? $lang('没有更多了') : ''" @load="onLoad">
                <template v-if="list.length > 0">
                    <div class="list-item" v-for="(item, index) in list" :key="index">
                        <div class="item-main">
                            <span class="col-type">{{ getType(item.type) }}</span>
                            <span class="col-amount" :class="item.change_type == 1 ? 'positive' : 'negative'">
                                {{ item.change_type == 1 ? '+' : '-' }}R${{ parseFloat(item.amount) }}
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
import { ref, computed } from 'vue';
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
        { type: 8, label: $lang('充值') },
        { type: 7, label: $lang('注册赠送') },
        { type: 11, label: $lang('提现') },
        { type: 12, label: $lang('提现驳回') },
        { type: 13, label: $lang('提现失败') },
        { type: 14, label: $lang('团队收益') },
        { type: 17, label: $lang('理财收益') },
        { type: 18, label: $lang('理财到期') },
        { type: 19, label: $lang('理财收益结算') },
        { type: 20, label: $lang('升级') },
        { type: 21, label: $lang('购买理财') },
        { type: 36, label: $lang('任务收益') },
        { type: 40, label: $lang('转盘收益') },
        { type: 46, label: $lang('现金礼物') },

    ]
)

const getAcTive = computed(() => {
    const type = tabList.value[activeTab.value].type
    return type
})

const onTabChange = (val) => {
    onRefresh()

}

const getType = (type) => {
    let num = Number(type)
    switch (num) {
        case 3:
            return $lang('充值');
        case 7:
            return $lang('注册赠送');
        case 8:
            return $lang('充值');
        case 11:
            return $lang('提现');
        case 12:
            return $lang('提现驳回');
            case 13:
            return $lang('提现失败') ;
        case 14:
            return $lang('团队收益');
            case 17:
            return $lang('理财收益');
        case 18:
            return $lang('理财到期');
        case 19:
            return $lang('理财收益结算');
        case 20:
            return $lang('升级') ;
        case 21:
            return $lang('购买理财');
        case 36:
            return $lang('任务收益') ;
        case 40:
            return $lang('转盘收益') ;
        case 46:
            return $lang('现金礼物');

        default:
            return ''
    }

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
