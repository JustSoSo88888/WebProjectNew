<template>
    <div class="lucky-page">
        <div class="loading-overlay" v-if="loading">
            <van-loading type="spinner" color="#ffd700" size="40px" />
        </div>
        <template v-else>
            <div class="lucky-header">
                <div class="header-top">
                    <h1 class="page-title">Lucky Draw</h1>
                    <div class="records-entry">
                        <van-icon name="orders-o" size="20" />
                        <span>记录</span>
                    </div>
                </div>
                <div class="chances-wrap">
                    <span class="chances-text">剩余次数: <strong>{{ chances }}</strong></span>
                </div>
            </div>

            <div class="grid-container">
                <div class="grid-wrapper">
                    <div v-for="(item, index) in gridItemsWithPlaceholder" :key="index" class="grid-item" :class="{
                        active: activeIndex === index,
                        winner: winnerIndex === index,
                        clickable: !isSpinning && chances > 0,
                        'is-center': index === 4
                    }">
                        <template v-if="item && index !== 4">
                            <div class="item-icon">💵</div>
                            <div class="item-name" translate="no">{{ item.title }}</div>
                        </template>
                    </div>

                    <div class="center-btn" :class="{ disabled: isSpinning || chances <= 0 }" @click="startDraw">
                        <van-loading v-if="isSpinning" color="#fff" size="24px" />
                        <span v-else>{{ isSpinning ? '抽奖中...' : '开始' }}</span>
                    </div>
                </div>
            </div>

            <div class="records-section">
                <h2 class="section-title">中奖记录</h2>
                <div class="records-list" ref="scrollContainer">
                    <div v-if="recordsLoading" class="loading-records">
                        <van-loading type="spinner" color="#fff" size="24px" />
                    </div>
                    <div v-else-if="records.length === 0" class="empty-records">
                        <span class="empty-text">暂无记录</span>
                    </div>
                    <div v-else class="record-item" v-for="(record, index) in records" :key="index">
                        <div class="record-left">
                            <span class="record-name">{{ record.name }}</span>
                        </div>
                        <div class="record-right">
                            <span class="record-prize">+{{ record.amount }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <van-popup v-model:show="showPrizeModal" position="center" class="prize-modal" round
                :close-on-click-overlay="false">
                <div class="prize-modal-content">
                    <div class="prize-bg">
                        <div class="prize-glow"></div>
                        <div class="prize-icon">🎁</div>
                        <div class="prize-amount-wrapper">
                            <span class="prize-currency">R$</span>
                            <span class="prize-amount" :class="{ 'animate': showPrizeModal }">{{ wonAmount }}</span>
                        </div>
                        <div class="prize-label">恭喜获得奖励</div>
                    </div>
                    <button class="prize-confirm-btn" @click="showPrizeModal = false">收下奖励</button>
                </div>
            </van-popup>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLuckyConfig, doLuckyDraw, getLuckyRecords } from '~/api/lucky';
import { getMemberInfo ,turntableConfig } from '~/api/turntable';
import { navigateTo } from '#imports'
definePageMeta({
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

onMounted(() => {
    handleGetMemberInfo()
    handleTurntableConfig()
})
//获取转盘次数
const handleGetMemberInfo = () => {
    getMemberInfo({}).then(res => {

    }).catch(error => {

    })
}

//获取转盘配置
const handleTurntableConfig = () => {
    turntableConfig({}).then(res => {
        loading.value = false
        if(res.success){
            prizes.value = res.data
        }else{
            showMsg(res.message, 'fail')
        }

    }).catch(error => {
        loading.value = false
        showMsg(error.message, 'fail')
    })
}

const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
const loading = ref(true)
const drawLoading = ref(false)
const recordsLoading = ref(false)
const prizes = ref([])
const chances = ref(0)
const isSpinning = ref(false)
const activeIndex = ref(-1)
const winnerIndex = ref(-1)
const showPrizeModal = ref(false)
const wonAmount = ref(0)
const records = ref([])
const scrollContainer = ref(null)


const gridItems = computed(() => {
    let items = []
    if (prizes.value.length >= 8) {
        items = prizes.value.slice(0, 8)
    } 
    return items
})

const prizeToGridIndex = [0, 1, 2, 3, 5, 6, 7, 8]

const gridItemsWithPlaceholder = computed(() => {
    const items = [...gridItems.value]
    items.splice(4, 0, null)
    return items
})


const startDraw = async () => {
    if (isSpinning.value || chances.value <= 0 || drawLoading.value) return

    isSpinning.value = true
    drawLoading.value = true

    try {
        const res = await doLuckyDraw()
        if (res.success) {
            const prizeIndex = res.data.prizeIndex
            const gridIndex = prizeToGridIndex[prizeIndex]
            wonAmount.value = res.data.prize?.amount || 0
            chances.value = res.data.remainingChances ?? chances.value - 1

            let current = 0
            const totalSteps = 20 + prizeIndex
            const interval = setInterval(() => {
                current++
                activeIndex.value = prizeToGridIndex[current % 8]

                if (current >= totalSteps) {
                    clearInterval(interval)
                    winnerIndex.value = gridIndex
                    activeIndex.value = -1
                    isSpinning.value = false
                    drawLoading.value = false

                    setTimeout(() => {
                        showPrizeModal.value = true
                        fetchRecords()
                    }, 500)
                }
            }, 80)
        }
    } catch (error) {
        console.error('Draw failed:', error)
        isSpinning.value = false
        drawLoading.value = false
        showToast('抽奖失败，请重试')
    }
}

</script>

<style scoped lang="scss">
.lucky-page {
    min-height: 100%;
    background: #0f0f12;
    padding: rem(16);
    padding-bottom: rem(100);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0f0f12;
    z-index: 999;
}

.lucky-header {
    text-align: center;
    padding-top: rem(20);
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: rem(12);
}

.page-title {
    font-size: rem(24);
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.chances-wrap {
    display: inline-flex;
    align-items: center;
    padding: rem(8) rem(16);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: rem(20);
}

.chances-text {
    font-size: rem(14);
    color: rgba(255, 255, 255, 0.6);

    strong {
        color: #d97706;
        font-weight: 600;
    }
}

.records-entry {
    display: flex;
    align-items: center;
    gap: rem(4);
    padding: rem(6) rem(12);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: rem(16);
    font-size: rem(13);
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.2s ease;

    &:active {
        transform: scale(0.96);
        background: rgba(255, 255, 255, 0.1);
    }
}

.grid-container {
    display: flex;
    justify-content: center;
    margin: rem(24) 0 rem(30);
}

.grid-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: rem(8);
    padding: rem(12);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: rem(16);
    position: relative;
    width: fit-content;
}

.grid-item {
    width: rem(88);
    height: rem(88);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-radius: rem(12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &.is-center {
        visibility: hidden;
    }

    &.active {
        background: linear-gradient(145deg, rgba(217, 119, 6, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%);
        border-color: #d97706;
        box-shadow: 0 0 20px rgba(217, 119, 6, 0.3);
    }

    &.winner {
        border-color: #d97706;
        background: linear-gradient(145deg, rgba(217, 119, 6, 0.3) 0%, rgba(217, 119, 6, 0.15) 100%);
        animation: winnerPulse 0.5s ease;
    }

    &.clickable:active {
        transform: scale(0.96);
    }
}

.item-icon {
    font-size: rem(32);
    margin-bottom: rem(4);
}

.item-name {
    font-size: rem(11);
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
}

.center-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: rem(76);
    height: rem(76);
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: rem(16);
    font-weight: 600;
    color: #fff;
    box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4);
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.15);
    z-index: 10;

    &.disabled {
        background: #3f3f46;
        box-shadow: none;
        cursor: not-allowed;
    }

    &:not(.disabled):active {
        transform: translate(-50%, -50%) scale(0.96);
    }
}

@keyframes winnerPulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.08);
    }

    100% {
        transform: scale(1);
    }
}

.records-section {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: rem(12);
    padding: rem(16);
}

.section-title {
    font-size: rem(16);
    font-weight: 600;
    color: #fff;
    margin: 0 0 rem(12);
}

.records-list {
    max-height: rem(180);
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
    }
}

.loading-records {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(24) 0;
}

.empty-records {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(24) 0;
}

.empty-text {
    font-size: rem(13);
    color: rgba(255, 255, 255, 0.4);
}

.record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(10) 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    &:last-child {
        border-bottom: none;
    }
}

.record-name {
    font-size: rem(13);
    color: rgba(255, 255, 255, 0.7);
}

.record-prize {
    font-size: rem(14);
    font-weight: 600;
    color: #d97706;
}

.prize-modal {
    background: transparent;
}

.prize-modal-content {
    background: #1a1a1e;
    border-radius: rem(20);
    padding: rem(24);
    text-align: center;
    min-width: rem(260);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.prize-bg {
    position: relative;
    padding: rem(16) 0;
}

.prize-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: rem(120);
    height: rem(120);
    background: radial-gradient(circle, rgba(217, 119, 6, 0.25) 0%, transparent 70%);
    animation: glowPulse 1.5s ease-in-out infinite;
}

@keyframes glowPulse {

    0%,
    100% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.15);
    }
}

.prize-icon {
    font-size: rem(48);
    margin-bottom: rem(12);
    animation: bounce 0.6s ease infinite alternate;
}

@keyframes bounce {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(-8px);
    }
}

.prize-amount-wrapper {
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-bottom: rem(6);
}

.prize-currency {
    font-size: rem(18);
    font-weight: 600;
    color: #d97706;
    margin-right: rem(3);
}

.prize-amount {
    font-size: rem(40);
    font-weight: 700;
    color: #d97706;
    text-shadow: 0 0 16px rgba(217, 119, 6, 0.4);

    &.animate {
        animation: countUp 0.5s ease-out;
    }
}

@keyframes countUp {
    from {
        opacity: 0;
        transform: translateY(16px) scale(0.5);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.prize-label {
    font-size: rem(14);
    color: rgba(255, 255, 255, 0.6);
}

.prize-confirm-btn {
    width: 100%;
    padding: rem(14);
    font-size: rem(15);
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border: none;
    border-radius: rem(24);
    cursor: pointer;
    margin-top: rem(16);

    &:active {
        transform: scale(0.98);
    }
}
</style>