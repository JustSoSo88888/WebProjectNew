<template>
    <div class="coupon-page">
        <!-- 卡券列表 -->
        <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
            :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
                :finished-text="list.length > 0 ? $lang('没有更多了') : ''" @load="onLoad">
                <template v-if="list.length > 0">
                    <div v-for="item in list" :key="item.id" class="coupon-item">
                        <div class="coupon-main">
                            <div class="coupon-value">
                                <div class="coupon-amount" translate="n
                                ">R$ {{ parseFloat(item.limit_deductible_amount) }}</div>
                            </div>
                            <div class="coupon-info">
                                <div class="coupon-title">{{ item.title }}</div>
                            </div>
                            
                        </div>
                        <div class="coupon-footer">
                            <div class="coupon-status">
                                {{ item.create_time }} - {{ item.end_time }}
                            </div>
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
import { ref, onMounted } from 'vue'
import { getCouponList } from '~/api/member'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
import Empty from '~/components/Empty.vue';

definePageMeta({ layout: 'second-page' })
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const rows = ref(20)
const list = ref([])

onMounted(() => {
})

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
        status: 0,
    }
    showLoading($lang('加载中'))
    getCouponList(param).then(res => {
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

// Get status text
const getStatusText = (status) => {
    const statusMap = {
        '0': {
            text: $lang('可使用'),
            color: "available"
        },
    }
    return statusMap[status] || status
}
</script>

<style scoped lang="scss">
.coupon-page {
    min-height: 100vh;
    background: $color-bg-page;
    padding: rem(10);
}

// ── List Section ──────────────────────────────────────────────
.list-section {
    margin: rem(12) rem(16);
}

.list-content {
    height: calc(100vh - 100px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

// ── Refresh Indicator ───────────────────────────────────────────
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

// ── Coupon Item ────────────────────────────────────────────────
.coupon-item {
    background: #fff;
    border-radius: $radius-lg;
    margin-bottom: rem(10);
    box-shadow: $shadow-sm;
    overflow: hidden;
    transition: transform 0.2s;

    &:active {
        transform: scale(0.98);
    }

    &.expired,
    &.used {
        opacity: 0.6;

        .coupon-value {
            background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
        }
    }
}

.coupon-main {
    display: flex;
    padding: rem(16);
    align-items: stretch;
}

.coupon-info {
    flex: 1;
    min-width: 0;
    display: flex;
    margin-left: rem(12);
}

.coupon-title {
    font-size: rem(16);
    font-weight: 600;
    color: $color-text-primary;
    margin-bottom: rem(4);
}

.coupon-desc {
    font-size: rem(13);
    color: $color-text-secondary;
    margin-bottom: rem(6);
}

.coupon-date {
    font-size: rem(12);
    color: $color-text-muted;
}

.coupon-value {
    flex-shrink: 0;
    width: rem(80);
    height: rem(80);
    background: linear-gradient(135deg, $color-primary, #4f46e5);
    border-radius: $radius-md;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    
}

.coupon-amount {
    font-size: rem(18);
    font-weight: 700;
}

.coupon-unit {
    font-size: rem(10);
    opacity: 0.9;
}

.coupon-footer {
    padding: 0 rem(16) rem(12);
    display: flex;
    justify-content: flex-end;
}

.coupon-status {
    font-size: rem(11);
    padding: rem(2) rem(8);
    font-weight: 500;
    color: $color-text-muted;

    &.available {
        background: $color-success-bg;
        color: $color-success;
    }

    &.used {
        background: $color-text-muted-bg;
        color: $color-text-muted;
    }

    &.expired {
        background: $color-danger-bg;
        color: $color-danger;
    }
}

// ── Loading & No More ──────────────────────────────────────────
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

// ── Animations ─────────────────────────────────────────────────
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
