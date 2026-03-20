<template>
    <div class="coupon-page">
        <!-- List Section -->
        <div class="list-section">
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

                <!-- 卡券列表 -->
                <div
                        v-for="item in couponList"
                        :key="item.id"
                        class="coupon-item"
                        :class="{ expired: item.status === 'expired', used: item.status === 'used' }"
                >
                    <div class="coupon-main">
                        <div class="coupon-info">
                            <div class="coupon-title">{{ item.title }}</div>
                            <div class="coupon-desc">{{ item.description }}</div>
                            <div class="coupon-date">有效期: {{ item.expiryDate }}</div>
                        </div>
                        <div class="coupon-value">
                            <div class="coupon-amount">{{ item.value }}</div>
                            <div class="coupon-unit">{{ item.unit }}</div>
                        </div>
                    </div>
                    <div class="coupon-footer">
                        <div class="coupon-status" :class="item.status">
                            {{ getStatusText(item.status) }}
                        </div>
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
                    <span>没有更多卡券了</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted} from 'vue'

definePageMeta({ layout: 'second-page' })

    // List Data
    const couponList = ref([])

    // Pagination State
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

    // Mock API Service
    const api = {
        async getCoupons(params) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800))

            const {page = 1, rows = 10} = params
            const data = []

            const couponTypes = [
                {title: '满减券', value: 'R$50', unit: '满200可用', description: '全场通用'},
                {title: '新人专享券', value: 'R$100', unit: '满500可用', description: '仅限新用户'},
                {title: '会员专享券', value: 'R$30', unit: '满100可用', description: 'VIP会员专享'},
            ]

            const statuses = ['available', 'used', 'expired']

            const startIndex = (page - 1) * rows

            for (let i = 0; i < rows; i++) {
                const index = startIndex + i
                const date = new Date()
                date.setDate(date.getDate() + Math.floor(Math.random() * 90) - 30)
                const dateStr = date.toISOString().split('T')[0]

                const type = couponTypes[Math.floor(Math.random() * couponTypes.length)]
                const status = statuses[Math.floor(Math.random() * statuses.length)]

                data.push({
                    id: `CPN${Date.now()}${String(index).padStart(4, '0')}`,
                    title: type.title,
                    value: type.value,
                    unit: type.unit,
                    description: type.description,
                    expiryDate: dateStr,
                    status: status,
                })
            }

            return {
                data,
                total: page * rows + Math.floor(Math.random() * 50),
                hasMore: page < 5 // Simulate end of data after 5 pages
            }
        }
    }

    // Fetch Data
    const fetchData = async (isRefresh = false) => {
        if (isLoading.value) return

        isLoading.value = true

        try {
            const response = await api.getCoupons({
                page: isRefresh ? 1 : page.value,
                rows
            })

            if (isRefresh) {
                couponList.value = response.data
                page.value = 1
            } else {
                couponList.value = [...couponList.value, ...response.data]
            }

            hasMore.value = response.hasMore
            if (!isRefresh) page.value++

        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            isLoading.value = false
        }
    }

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

    // Get status text
    const getStatusText = (status) => {
        const statusMap = {
            'available': '可使用',
            'used': '已使用',
            'expired': '已过期'
        }
        return statusMap[status] || status
    }
</script>

<style scoped lang="scss">
.coupon-page {
    min-height: 100vh;
    background: $color-bg-page;
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
}

.coupon-info {
    flex: 1;
    min-width: 0;
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
    margin-left: rem(12);
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
    border-radius: $radius-full;
    font-weight: 500;

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
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
