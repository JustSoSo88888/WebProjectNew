<template>
    <div class="finance-record-page">

        <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
            :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
                :finished-text="list.length > 0 ? $lang('没有更多了') : ''" @load="onLoad">
                <template v-if="list.length > 0">
                    <div class="list-section">
                        <!-- List Data -->
                        <div v-if="list.length > 0" class="record-list">
                            <div v-for="item in list" :key="item.id" class="record-item">
                                <div class="record-header">
                                    <span class="record-name">{{ item.title }}</span>
                                    <span class="record-status" :class="item.status == 0 ? 'ongoing' : 'completed'">{{
                                        item.status
                                            ==
                                        0 ?
                                        $lang('进行中'):$lang('已完成') }}</span>
                                </div>
                                <div class="record-info">
                                    <div class="info-row">
                                        <span class="info-label">{{ $lang('成本') }}</span>
                                        <span class="info-value" translate="no">R$ {{ parseFloat(item.price) }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">{{ $lang('时间') }}</span>
                                        <span class="info-value">{{ item.create_time }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">{{ $lang('总天数') }}</span>
                                        <span class="info-value">{{ item.day_number }} {{ $lang('天') }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">{{ $lang('有效期') }}</span>
                                        <span class="info-value highlight">{{ item.pass_day / item.day_number }}
                                            {{ $lang('有效期') }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">{{ $lang('每日收益率') }}</span>
                                        <span class="info-value profit">{{ parseFloat(item.daily_income_rate) }}%</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">{{ $lang('总收益') }}</span>
                                        <span class="info-value profit">R$ {{ parseFloat(item.income_amount) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <Empty></Empty>
                </template>
            </van-list>
        </van-pull-refresh>
        <!-- List Section -->

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { mealOrder } from '~/api/meal'
import Empty from '~/components/Empty.vue';
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

definePageMeta({ layout: 'second-page' })
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const rows = ref(20)
const list = ref([])

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
    }
    showLoading($lang('加载中'))
    mealOrder(param).then(res => {
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
.finance-record-page {
    background: $color-bg-page;
    display: flex;
    flex-direction: column;
}


// ── List Section ──────────────────────────────────────────────
.list-section {
    flex: 1;
    margin: rem(10) rem(16);
    background: #fff;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
}

.list-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}



// ── Record Item ────────────────────────────────────────────────
.record-list {
    padding: rem(12);
}

.record-item {
    background: $color-bg-page;
    border-radius: $radius-md;
    padding: rem(14);
    margin-bottom: rem(10);

    &:last-child {
        margin-bottom: 0;
    }
}

.record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: rem(12);
}

.record-name {
    font-size: rem(14);
    font-weight: 600;
    color: $color-text-primary;
}

.record-status {
    font-size: rem(11);
    padding: rem(2) rem(8);
    border-radius: $radius-full;
    font-weight: 500;

    &.ongoing {
        background: $color-primary-bg;
        color: #d97706;
    }

    &.completed {
        background: $color-success-bg;
        color: $color-success;
    }
}

.record-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: rem(8);
}

.info-row {
    display: flex;
    flex-direction: column;
    gap: rem(2);
}

.info-label {
    font-size: rem(11);
    color: $color-text-muted;
}

.info-value {
    font-size: rem(13);
    font-weight: 600;
    color: $color-text-primary;

    &.highlight {
        color: #d97706;
    }

    &.profit {
        color: $color-success;
    }
}

.record-progress {
    display: flex;
    align-items: center;
    gap: rem(8);
    margin-top: rem(12);
}

.progress-bar {
    flex: 1;
    height: rem(4);
    background: $color-border;
    border-radius: $radius-full;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: $gradient-primary;
    border-radius: $radius-full;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: rem(11);
    color: $color-text-muted;
    min-width: rem(35);
    text-align: right;
}



// ── Animation ────────────────────────────────────────────────
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
