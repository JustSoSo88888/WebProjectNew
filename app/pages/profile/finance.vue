<template>
    <div class="finance-page">
        <!-- Tab Switch -->
        <div class="tab-container">
            <div class="tab-wrapper">
                <button class="tab-btn" :class="{ active: activeTab === 'recharge' }" @click="activeTab = 'recharge'">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    充值
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'withdraw' }" @click="activeTab = 'withdraw'">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 19V5M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    提现
                </button>
            </div>
        </div>



        <!-- List Section -->
        <div class="list-section">
            <div class="list-header">
                <span>单号</span>
                <span>金额</span>
                <span>状态</span>
            </div>
            <div class="list-content" ref="scrollContainer" @touchstart="onTouchStart" @touchmove="onTouchMove"
                @touchend="onTouchEnd" @scroll="onScroll">
                <!-- 下拉刷新提示 -->
                <div class="refresh-indicator" :style="{ height: refreshHeight + 'px' }">
                    <div class="refresh-content">
                        <svg class="refresh-icon" :class="{ rotating: isRefreshing }" viewBox="0 0 24 24" fill="none">
                            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                        <span>{{ refreshText }}</span>
                    </div>
                </div>

                <!-- 列表数据 -->
                <div v-for="item in currentList" :key="item.id" class="list-item">
                    <div class="item-main">
                        <span class="col-id">{{ item.id }}</span>
                        <span class="col-amount" :class="{ positive: item.type === 'recharge' }">
                            {{ item.type === 'recharge' ? '+' : '-' }}R${{ item.amount }}
                        </span>
                        <span class="col-status" :class="item.statusClass">{{ item.statusText }}</span>
                    </div>
                    <div class="item-footer">
                        <span class="col-time">{{ item.time }}</span>
                    </div>
                </div>

                <!-- 加载更多提示 -->
                <div class="loading-indicator" v-if="isLoading">
                    <svg class="loading-icon" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-opacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" />
                    </svg>
                    <span>加载中...</span>
                </div>

                <!-- 无更多数据提示 -->
                <div class="no-more-indicator" v-else-if="!hasMore">
                    <span>没有更多数据了</span>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from '#imports'

definePageMeta({ layout: 'second-page' })

const route = useRoute()

// Tab state — 支持 ?tab=recharge / ?tab=withdraw 初始化
const activeTab = ref(route.query.tab === 'withdraw' ? 'withdraw' : 'recharge')



// Mock data generators
const generateMockData = (type, count, startIndex = 0) => {
    const data = []
    const prefix = type === 'recharge' ? 'RC' : 'WD'
    const statusOptions = [
        { text: '成功', class: 'success' },
        { text: '处理中', class: 'pending' },
        { text: '失败', class: 'error' }
    ]

    for (let i = 0; i < count; i++) {
        const index = startIndex + i
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
        const timeStr = date.toTimeString().split(' ')[0].substring(0, 5)

        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]
        const amount = (Math.random() * 1000 + 50).toFixed(2)

        data.push({
            id: `${prefix}${dateStr}${String(index + 1).padStart(3, '0')}`,
            amount: amount,
            time: `${date.toISOString().split('T')[0]} ${timeStr}`,
            statusText: status.text,
            statusClass: status.class
        })
    }
    return data
}

// Initial data
const rechargeList = ref(generateMockData('recharge', 10))
const withdrawList = ref(generateMockData('withdraw', 10))

// Pagination state
const page = ref(1)
const rows = 10
const isLoading = ref(false)
const hasMore = ref(true)

// Touch/Scroll state for pull-to-refresh
const scrollContainer = ref(null)
const touchStartY = ref(0)
const refreshHeight = ref(0)
const isRefreshing = ref(false)
const refreshText = ref('下拉刷新')

// Computed list based on active tab
const currentList = computed(() => {
    const list = activeTab.value === 'recharge' ? rechargeList.value : withdrawList.value
    return list.map(item => ({
        ...item,
        type: activeTab.value
    }))
})

// Watch tab change to reset pagination
watch(activeTab, () => {
    page.value = 1
    hasMore.value = true
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0
    }
    // Reset data for demo purposes
    if (activeTab.value === 'recharge') {
        rechargeList.value = generateMockData('recharge', 10)
    } else {
        withdrawList.value = generateMockData('withdraw', 10)
    }
})

// Pull to refresh logic
const onTouchStart = (e) => {
    if (isRefreshing.value) return
    touchStartY.value = e.touches[0].clientY
}

const onTouchMove = (e) => {
    if (isRefreshing.value) return
    const scrollTop = scrollContainer.value?.scrollTop || 0
    if (scrollTop > 0) return

    const deltaY = e.touches[0].clientY - touchStartY.value
    if (deltaY > 0) {
        refreshHeight.value = Math.min(deltaY * 0.5, 80)
        refreshText.value = refreshHeight.value > 60 ? '松开刷新' : '下拉刷新'
        e.preventDefault()
    }
}

const onTouchEnd = () => {
    if (refreshHeight.value > 60) {
        startRefresh()
    } else {
        refreshHeight.value = 0
        refreshText.value = '下拉刷新'
    }
}

const startRefresh = async () => {
    isRefreshing.value = true
    refreshText.value = '刷新中...'

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate new data
    const newData = activeTab.value === 'recharge'
        ? generateMockData('recharge', 10, 0)
        : generateMockData('withdraw', 10, 0)

    if (activeTab.value === 'recharge') {
        rechargeList.value = newData
    } else {
        withdrawList.value = newData
    }

    page.value = 1
    hasMore.value = true

    // Reset state
    isRefreshing.value = false
    refreshHeight.value = 0
    refreshText.value = '下拉刷新'
}

// Infinite scroll logic
const onScroll = () => {
    if (isLoading.value || !hasMore.value) return

    const container = scrollContainer.value
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceToBottom = scrollHeight - scrollTop - clientHeight

    // Trigger load when near bottom
    if (distanceToBottom < 50) {
        loadMore()
    }
}

const loadMore = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const newPage = page.value + 1
    const startIndex = (newPage - 1) * rows
    const newData = activeTab.value === 'recharge'
        ? generateMockData('recharge', rows, startIndex)
        : generateMockData('withdraw', rows, startIndex)

    if (activeTab.value === 'recharge') {
        rechargeList.value = [...rechargeList.value, ...newData]
    } else {
        withdrawList.value = [...withdrawList.value, ...newData]
    }

    page.value = newPage

    // Simulate end of data after 5 pages
    if (newPage >= 5) {
        hasMore.value = false
    }

    isLoading.value = false
}
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
