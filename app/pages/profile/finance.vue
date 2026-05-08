<template>
    <div class="finance-page">
        <!-- Tab Switch -->
        <div class="tab-container">
            <div class="tab-wrapper">
                <button class="tab-btn" :class="{ active: activeTab == 0 }" @click="onTabChange(0)">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                    {{ $lang('充值') }}
                </button>
                <button class="tab-btn" :class="{ active: activeTab == 1 }" @click="onTabChange(1)">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 19V5M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                    {{ $lang('提现') }}
                </button>
            </div>
        </div>


        <!-- List Section -->
        <div class="list-section">
            <div class="list-header">
                <span>{{ $lang('单号') }}</span>
                <span>{{ $lang('金额') }}</span>
                <span>{{ $lang('状态') }}</span>
            </div>
            <div class="list-content">
                <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'"
                                  :loosing-text="$lang('释放即可刷新') + '...'"
                                  :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
                    <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
                              :finished-text="list.length > 0 ? $lang('没有更多了') : ''" @load="onLoad">
                        <template v-if="list.length > 0">
                            <template v-if="activeTab == 0">
                                <div v-for="item in list" :key="item.id" class="list-item">
                                    <div class="item-main">
                                        <span class="col-id">{{ item.order_no }}</span>
                                        <span class="col-amount positive" translate="no">
                                            +R${{ parseFloat(item.amount) }}
                                        </span>
                                        <span class="col-status" :class="getType(item.status).class">{{
                                                getType(item.status).text
                                            }}</span>
                                    </div>
                                    <div class="item-footer">
                                        <span class="col-time">{{ item.create_time }}</span>
                                    </div>
                                </div>
                            </template>
                            <template v-if="activeTab == 1">
                                <div v-for="item in list" :key="item.id" class="list-item">
                                    <div class="item-main">
                                        <span class="col-id">{{ item.order_no }}</span>
                                        <span class="col-amount" translate="no">
                                            -R${{ parseFloat(item.amount) }}
                                        </span>
                                        <span class="col-status" :class="getWithdrawType(item.status).class">{{
                                                getWithdrawType(item.status).text
                                            }}</span>
                                    </div>
                                    <div class="item-footer">
                                        <span class="col-time">{{ item.create_time }}</span>
                                    </div>
                                </div>
                            </template>
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


    </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import {useRoute} from '#imports'
import {memberRechargeOrder} from '~/api/member'
import {bankCardList} from '~/api/member'
import {bankCardWithdrawalList} from '~/api/withdrawal'

definePageMeta({layout: 'second-page'})

const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const rows = ref(20)
const list = ref([])
const activeTab = ref(0)

const getWithdrawType = (status) => {
    if (Number(status) == 1) {
        return {text: $lang('已到达'), class: 'success'}
    } else if (Number(status) == 2) {
        return {text: $lang('不通过'), class: 'error'}
    } else if (Number(status) == 3) {
        return {text: $lang('线上打款中'), class: 'pending'}
    } else if (Number(status) == 4) {
        return {text: $lang('用户取消'), class: 'success'}
    } else {
        return {text: $lang('未审核'), class: 'pending'}
    }
}

const getType = (status) => {
    if (Number(status) == 0) {
        return {text: $lang('待支付'), class: 'pending'}
    } else if (Number(status) == 1) {
        return {text: $lang('已支付'), class: 'success'}
    } else if (Number(status) == 2) {
        return {text: $lang('已取消'), class: 'error'}
    } else if (Number(status) == 3) {
        return {text: $lang('交易失败'), class: 'error'}
    } else {
        return {text: $lang('待支付'), class: 'pending'}
    }
}
const onTabChange = (val) => {
    page.value = 1
    list.value = []
    activeTab.value = val
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
    }
    showLoading($lang('加载中'))
    let apiFn = activeTab.value == 0 ? memberRechargeOrder : bankCardWithdrawalList
    apiFn(param).then(res => {
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

const route = useRoute()

</script>

<style scoped lang="scss">
.finance-page {
    height: 100vh;
    background: $color-bg-page;
    display: flex;
    flex-direction: column;
}

// Tab Switch - Fixed at top
.tab-container {
    flex-shrink: 0;
    padding: rem(12) rem(16);
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}

.tab-wrapper {
    display: flex;
    background: $color-bg-page;
    border-radius: $radius-md;
    padding: rem(4);
}

.tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(6);
    padding: rem(10) 0;
    border-radius: rem(6);
    font-size: rem(14);
    font-weight: 500;
    color: $color-text-secondary;
    cursor: pointer;
    transition: $transition-fast;

    svg {
        width: rem(16);
        height: rem(16);
    }

    &.active {
        background: #fff;
        color: $color-primary;
        font-weight: 600;
        box-shadow: $shadow-xs;
    }
}

// List Section - Flex grow
.list-section {
    flex: 1;
    margin: rem(12) rem(16);
    background: #fff;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.list-header {
    flex-shrink: 0;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    padding: rem(14) rem(14);
    background: $color-bg-page;
    font-size: rem(12);
    color: $color-text-muted;
    font-weight: 500;
    gap: rem(8);
}

.list-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

// Bottom Bar


// Refresh Indicator
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

// Loading Indicator
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

.list-item {
    padding: rem(16) rem(14);
    border-bottom: rem(1) solid $color-border-light;
    font-size: rem(13);
    position: relative;

    &:last-child {
        border-bottom: none;
    }
}

.item-main {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: rem(8);
    align-items: center;
}

.item-footer {
    margin-top: rem(8);
    text-align: right;
}

.col-id {
    color: $color-text-primary;
    font-weight: 500;
    word-break: break-all;
    line-height: 1.4;
}

.col-amount {
    font-weight: 600;
    color: $color-danger;
    line-height: 1.4;

    &.positive {
        color: $color-success;
    }
}

.col-time {
    color: $color-text-muted;
    font-size: rem(11);
    line-height: 1.4;
}

.col-status {
    font-weight: 500;
    text-align: right;
    line-height: 1.4;

    &.success {
        color: $color-success;
    }

    &.pending {
        color: $color-warning;
    }

    &.error {
        color: $color-danger;
    }
}
</style>
