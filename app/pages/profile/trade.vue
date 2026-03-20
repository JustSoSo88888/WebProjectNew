<template>
    <div class="trade-page">
        <!-- Tab Switch -->
        <div class="tab-container">
            <div class="tab-wrapper">
                <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        class="tab-btn"
                        :class="{ active: activeTab === tab.key }"
                        @click="activeTab = tab.key"
                >
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <!-- List Section -->
        <div class="list-section">
            <div class="list-header">
                <span>金额</span>
                <span>类型</span>
                <span>时间</span>
            </div>
            <div
                    class="list-content"
                    ref="scrollContainer"
                    @touchstart="onTouchStart"
                    @touchmove="onTouchMove"
                    @touchend="onTouchEnd"
                    @scroll="onScroll"
            >
                <!-- 下拉刷新提示 -->
                <div class="refresh-indicator" :style="{ height: refreshHeight + 'px' }">
                    <div class="refresh-content">
                        <svg class="refresh-icon" :class="{ rotating: isRefreshing }" viewBox="0 0 24 24" fill="none">
                            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                        </svg>
                        <span>{{ refreshText }}</span>
                    </div>
                </div>
                <!-- 列表数据 -->
                <div
                        v-for="item in currentList"
                        :key="item.id"
                        class="list-item"
                >
                    <div class="item-main">
                        <span class="col-type">{{ item.typeText }}</span>
                        <span class="col-amount" :class="item.amountClass">
              {{ item.amountSign }}{{ item.amount }}
            </span>
                    </div>
                    <div class="item-footer">
                        <span class="col-id">{{ item.id }}</span>
                        <span class="col-time">{{ item.time }}</span>
                    </div>
                </div>

                <!-- 加载更多提示 -->
                <div class="loading-indicator" v-if="isLoading">
                    <svg class="loading-icon" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-opacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2"
                              stroke-linecap="round"/>
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
    import {ref, computed, watch, onMounted} from 'vue'

    definePageMeta({layout: 'second-page'})

    // Tab State
    const activeTab = ref('all')
    const tabs = [
        {key: 'all', label: '全部'},
        {key: 'income', label: '收入'},
        {key: 'expense', label: '支出'},
        {key: 'transfer', label: '转账'},
        {key: 'refund', label: '退款'},
        {key: 'recharge', label: '充值'},
        {key: 'withdraw', label: '提现'},
    ]

    // Mock API Service (Simulating Backend)
    const api = {
        async getTradeRecords(params) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800))

            const {page = 1, rows = 15, type = 'all'} = params
            const data = []

            const types = {
                income: [
                    {text: '任务奖励', sign: '+', class: 'positive'},
                    {text: '邀请奖励', sign: '+', class: 'positive'},
                    {text: '团队分红', sign: '+', class: 'positive'},
                ],
                expense: [
                    {text: '购买商品', sign: '-', class: 'negative'},
                    {text: '服务费', sign: '-', class: 'negative'},
                    {text: '会员费', sign: '-', class: 'negative'},
                ],
                transfer: [
                    {text: '转出', sign: '-', class: 'negative'},
                    {text: '转入', sign: '+', class: 'positive'},
                ],
                refund: [
                    {text: '退款', sign: '+', class: 'positive'},
                    {text: '退货退款', sign: '+', class: 'positive'},
                ],
                recharge: [
                    {text: '在线充值', sign: '+', class: 'positive'},
                    {text: '活动赠送', sign: '+', class: 'positive'},
                ],
                withdraw: [
                    {text: '提现', sign: '-', class: 'negative'},
                    {text: '手续费返还', sign: '+', class: 'positive'},
                ],
            }

            const startIndex = (page - 1) * rows

            for (let i = 0; i < rows; i++) {
                const index = startIndex + i
                const date = new Date()
                date.setDate(date.getDate() - Math.floor(Math.random() * 30))
                date.setHours(Math.floor(Math.random() * 24))
                date.setMinutes(Math.floor(Math.random() * 60))
                const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
                const timeStr = date.toTimeString().split(' ')[0].substring(0, 5)

                let currentType = type
                if (type === 'all') {
                    const keys = Object.keys(types)
                    currentType = keys[Math.floor(Math.random() * keys.length)]
                }

                const typeOptions = types[currentType] || types.income
                const selectedType = typeOptions[Math.floor(Math.random() * typeOptions.length)]

                const amount = (Math.random() * 1000 + 10).toFixed(2)

                data.push({
                    id: `TRD${dateStr}${String(index + 1).padStart(4, '0')}`,
                    amount: amount,
                    amountSign: selectedType.sign,
                    amountClass: selectedType.class,
                    typeText: selectedType.text,
                    time: `${date.toISOString().split('T')[0]} ${timeStr}`,
                    category: currentType,
                })
            }

            return {
                data,
                total: page * rows + Math.floor(Math.random() * 50),
                hasMore: page < 5 // Simulate end of data after 5 pages
            }
        }
    }

    // List Data
    const allList = ref([])

    // Pagination State
    const page = ref(1)
    const rows = 15
    const isLoading = ref(false)
    const hasMore = ref(true)

    // Refresh State
    const scrollContainer = ref(null)
    const touchStartY = ref(0)
    const refreshHeight = ref(0)
    const isRefreshing = ref(false)
    const refreshText = ref('下拉刷新')

    // Computed List based on active tab
    const currentList = computed(() => {
        if (activeTab.value === 'all') return allList.value
        return allList.value.filter(item => item.category === activeTab.value)
    })

    // Fetch Data via API
    const fetchData = async (isRefresh = false) => {
        if (isLoading.value) return

        isLoading.value = true

        try {
            const response = await api.getTradeRecords({
                page: isRefresh ? 1 : page.value,
                rows,
                type: activeTab.value
            })

            if (isRefresh) {
                allList.value = response.data
                page.value = 1
            } else {
                allList.value = [...allList.value, ...response.data]
            }

            hasMore.value = response.hasMore
            if (!isRefresh) page.value++

        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            isLoading.value = false
        }
    }

    // Watch tab change
    watch(activeTab, () => {
        page.value = 1
        hasMore.value = true
        if (scrollContainer.value) {
            scrollContainer.value.scrollTop = 0
        }
        fetchData(true)
    })

    // Initial fetch
    onMounted(() => {
        fetchData()
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

        const {scrollTop, scrollHeight, clientHeight} = container
        const distanceToBottom = scrollHeight - scrollTop - clientHeight

        if (distanceToBottom < 50) {
            fetchData()
        }
    }
</script>

<style scoped lang="scss">
    .trade-page {
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
        padding: rem(10) 0;
        border-radius: rem(6);
        font-size: rem(13);
        font-weight: 500;
        color: $color-text-secondary;
        cursor: pointer;
        transition: $transition-fast;
        text-align: center;

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
        grid-template-columns: 1fr 1fr 1fr;
        padding: rem(14) rem(16);
        background: $color-bg-page;
        font-size: rem(12);
        color: $color-text-muted;
        font-weight: 500;
    }

    .list-content {
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    // Modal Styles (for consistency if needed later)
    .modal {
        width: 100%;
        background: #fff;
        overflow: hidden;
        max-height: 90vh;
    }

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

    .list-item {
        padding: rem(16);
        border-bottom: rem(1) solid $color-border-light;
        font-size: rem(14);

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
</style>
