<template>
    <div class="redeem-page">
        <div class="list-section">
            <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
                :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
                <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
                    :finished-text="list.length > 0 ? $lang('没有更多了') : $lang('暂无数据')" @load="onLoad">
                    <template v-if="list.length > 0">
                        <div class="redeem-item" v-for="(item, index) in list" :key="index">
                            <div>
                                <div>{{ $lang('兑换码') }}</div>
                                <div class="mt-10 redeem-code">
                                    {{ item.code }}
                                </div>
                            </div>
                            <div class="redeem-amount-box">
                                <div>{{ $lang('奖励') }}</div>
                                <div class="redeem-amount" translate="no">+R$ {{ parseFloat(item.amount) }}</div>
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
import { ref, onMounted } from 'vue'
import { redEnvelopeLogList } from '~/api/red_envelope';
import Empty from '~/components/Empty.vue';
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const rows = ref(20)
const list = ref([])

definePageMeta({
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

onMounted(() => {
})

const onLoad = () => {
    let param = {
        rows: rows.value,
        page: page.value
    }
    showLoading($lang('加载中'))
    redEnvelopeLogList(param).then(res => {
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

const onRefresh = () => {
    finished.value = false;
    page.value = 1;
    loading.value = true;
    onLoad();
}
</script>

<style scoped lang="scss">
.redeem-page {
    min-height: 100vh;
    background: $color-bg-page;
}

.list-section {
    margin: rem(12) rem(16);
    padding-top: rem(5);
    box-sizing: border-box;
}

.list-content {
    height: calc(100vh - 100px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.refresh-indicator {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: $color-bg-page;
    overflow: hidden;
    transition: height 0.2s ease;
}

.refresh-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(8);
    padding-bottom: rem(12);
    font-size: rem(13);
    color: $color-text-secondary;
}

.refresh-icon {
    width: rem(16);
    height: rem(16);

    &.rotating {
        animation: spin 1s linear infinite;
    }
}

.redeem-item {
    background: #fff;
    border-radius: $radius-lg;
    margin-bottom: rem(10);
    box-shadow: $shadow-sm;
    padding: rem(16);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.redeem-code {
    color: $color-text-primary;
    margin-top: rem(5);
}

.redeem-amount-box {
    text-align: right;

    .redeem-amount {
        color: green;
        margin-top: rem(5);
    }
}


.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(8);
    padding: rem(16);
    font-size: rem(13);
    color: $color-text-secondary;
}

.loading-icon {
    width: rem(16);
    height: rem(16);
    animation: spin 1s linear infinite;
}

.no-more-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(16);
    font-size: rem(12);
    color: $color-text-muted;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
