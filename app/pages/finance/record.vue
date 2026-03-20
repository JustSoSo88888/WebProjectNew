<template>
    <div class="finance-record-page">
        <!-- Tab Switch -->
        <div class="tab-container">
            <div class="tab-wrapper">
                <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    class="tab-btn"
                    :class="{ active: activeTab === tab.key }"
                    @click="switchTab(tab.key)"
                >
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <!-- List Section -->
        <div class="list-section">
            <div class="list-content"
                 ref="scrollContainer"
                 @touchstart="onTouchStart"
                 @touchmove="onTouchMove"
                 @touchend="onTouchEnd"
                 @scroll="onScroll"
            >
                <!-- Pull to Refresh -->
                <div class="refresh-indicator" :style="{ height: refreshHeight + 'px' }">
                    <div class="refresh-content">
                        <svg class="refresh-icon" :class="{ rotating: isRefreshing }" viewBox="0 0 24 24" fill="none">
                            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ refreshText }}</span>
                    </div>
                </div>

                <!-- List Data -->
                <div v-if="currentList.length > 0" class="record-list">
                    <div v-for="item in currentList" :key="item.id" class="record-item">
                        <div class="record-header">
                            <span class="record-name">{{ item.name }}</span>
                            <span class="record-status" :class="item.statusClass">{{ item.statusText }}</span>
                        </div>
                        <div class="record-info">
                            <div class="info-row">
                                <span class="info-label">金额</span>
                                <span class="info-value">BRL {{ item.amount }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">时间</span>
                                <span class="info-value">{{ item.date }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">总天数</span>
                                <span class="info-value">{{ item.totalDays }} 天</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">剩余天数</span>
                                <span class="info-value highlight">{{ item.remainDays }} 天</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">当前收益</span>
                                <span class="info-value profit">+BRL {{ item.currentProfit }}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">总收益</span>
                                <span class="info-value profit">+BRL {{ item.totalProfit }}</span>
                            </div>
                        </div>
                        <div class="record-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
                            </div>
                            <span class="progress-text">{{ item.progress }}%</span>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="!isLoading" class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                        <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.8"/>
                    </svg>
                    <span>暂无{{ activeTab === 'ongoing' ? '进行中' : '已完成' }}记录</span>
                </div>

                <!-- Loading Indicator -->
                <div class="loading-indicator" v-if="isLoading">
                    <svg class="loading-icon" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-opacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span>加载中...</span>
                </div>

                <!-- No More Data -->
                <div class="no-more-indicator" v-else-if="!hasMore && currentList.length > 0">
                    <span>没有更多数据了</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ layout: 'second-page' })

const tabs = [
    { key: 'ongoing', label: '进行中' },
    { key: 'completed', label: '已完成' },
]

const activeTab = ref('ongoing')

// Mock API
const api = {
    async getRecords(params) {
        await new Promise(resolve => setTimeout(resolve, 800))

        const { status = 'ongoing', page = 1, rows = 10 } = params
        const data = []

        const productNames = [
            '稳健增利宝', '蓝筹精选基金', '科技成长计划', '固收安心理财', 
            '高收益理财包', '精选债券基金', '浮动收益计划', '定期储蓄理财'
        ]

        const startIndex = (page - 1) * rows

        for (let i = 0; i < rows; i++) {
            const index = startIndex + i
            const totalDays = [7, 14, 30, 60, 90, 180][Math.floor(Math.random() * 6)]
            const amount = (Math.random() * 9000 + 1000).toFixed(2)
            const dailyRate = (Math.random() * 0.02 + 0.005).toFixed(4)
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - Math.floor(Math.random() * totalDays))
            
            const isOngoing = status === 'ongoing'
            const daysPassed = isOngoing ? Math.floor(Math.random() * totalDays) : totalDays
            const remainDays = Math.max(0, totalDays - daysPassed)
            const progress = Math.round((daysPassed / totalDays) * 100)
            const currentProfit = (parseFloat(amount) * parseFloat(dailyRate) * daysPassed).toFixed(2)
            const totalProfit = (parseFloat(amount) * parseFloat(dailyRate) * totalDays).toFixed(2)

            data.push({
                id: `FIN${Date.now()}${index}`,
                name: productNames[Math.floor(Math.random() * productNames.length)],
                amount: amount,
                date: startDate.toISOString().split('T')[0],
                totalDays: totalDays,
                remainDays: remainDays,
                currentProfit: currentProfit,
                totalProfit: totalProfit,
                progress: progress,
                dailyRate: dailyRate,
                status: status,
                statusText: isOngoing ? '进行中' : '已完成',
                statusClass: isOngoing ? 'ongoing' : 'completed'
            })
        }

        return {
            data,
            total: 50,
            hasMore: page < 5
        }
    }
}

// List Data
const ongoingList = ref([])
const completedList = ref([])

const currentList = computed(() => {
    return activeTab.value === 'ongoing' ? ongoingList.value : completedList.value
})

// Pagination
const page = ref(1)
const rows = 10
const isLoading = ref(false)
const hasMore = ref(true)

// Refresh State
const scrollContainer = ref(null)
const touchStartY = ref(0)
const refreshHeight = ref(0)
const isRefreshing = ref(false)
const refreshText = ref('下拉刷新')

// Fetch Data
const fetchData = async (isRefresh = false) => {
    if (isLoading.value) return

    isLoading.value = true

    try {
        const response = await api.getRecords({
            status: activeTab.value,
            page: isRefresh ? 1 : page.value,
            rows
        })

        if (activeTab.value === 'ongoing') {
            ongoingList.value = isRefresh ? response.data : [...ongoingList.value, ...response.data]
        } else {
            completedList.value = isRefresh ? response.data : [...completedList.value, ...response.data]
        }

        hasMore.value = response.hasMore
        if (!isRefresh) page.value++
    } catch (error) {
        console.error('Fetch error:', error)
    } finally {
        isLoading.value = false
    }
}

// Switch Tab
const switchTab = (tab) => {
    activeTab.value = tab
    page.value = 1
    hasMore.value = true
    fetchData(true)
}

// Pull to Refresh
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

    await fetchData(true)

    isRefreshing.value = false
    refreshHeight.value = 0
    refreshText.value = '下拉刷新'
}

// Infinite Scroll
const onScroll = () => {
    if (isLoading.value || !hasMore.value) return

    const container = scrollContainer.value
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceToBottom = scrollHeight - scrollTop - clientHeight

    if (distanceToBottom < 50) {
        fetchData()
    }
}

// Initial Fetch
import { onMounted } from 'vue'
onMounted(() => {
    fetchData()
})
</script>

<style scoped lang="scss">
.finance-record-page {
    height: 100vh;
    background: $color-bg-page;
    display: flex;
    flex-direction: column;
}

// ── Tab Switch ────────────────────────────────────────────────
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
    padding: rem(10) 0;
    border-radius: rem(6);
    font-size: rem(14);
    font-weight: 500;
    color: $color-text-secondary;
    cursor: pointer;
    transition: $transition-fast;

    &.active {
        background: #fff;
        color: $color-primary;
        font-weight: 600;
        box-shadow: $shadow-xs;
    }
}

// ── List Section ──────────────────────────────────────────────
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

.list-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

// ── Pull to Refresh ───────────────────────────────────────────
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
        background: #DBEAFE;
        color: #2563EB;
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
        color: #2563EB;
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
    background: linear-gradient(90deg, #2563EB, #7C3AED);
    border-radius: $radius-full;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: rem(11);
    color: $color-text-muted;
    min-width: rem(35);
    text-align: right;
}

// ── Empty State ───────────────────────────────────────────────
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: rem(40) rem(20);
    color: $color-text-muted;

    svg {
        width: rem(48);
        height: rem(48);
        margin-bottom: rem(12);
        opacity: 0.5;
    }

    span {
        font-size: rem(14);
    }
}

// ── Loading & No More ────────────────────────────────────────
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

// ── Animation ────────────────────────────────────────────────
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
