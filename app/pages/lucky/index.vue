<template>
    <div class="lucky-page">
        <div class="loading-overlay" v-if="loading">
            <van-loading type="spinner" color="#ffd700" size="40px" />
            <span class="loading-text">Loading...</span>
        </div>

        <template v-else>
            <div class="lucky-header">
                <h1 class="page-title">🎰 Lucky Turntable</h1>
                <p class="page-desc">Spin the wheel to win amazing prizes!</p>
            </div>

            <div class="chances-wrap">
                <span class="chances-icon">⭐</span>
                <span class="chances-text">Available spins: <strong>{{ chances }}</strong></span>
            </div>

            <div class="turntable-wrap">
                <div class="turntable-container">
                    <div class="turntable" :class="{ spinning: isSpinning }" :style="turntableStyle">
                        <svg class="division-lines" viewBox="0 0 290 290">
                            <line v-for="line in divisionLines" :key="line.index"
                                x1="145" y1="145"
                                :x2="line.x2" :y2="line.y2"
                                stroke="rgba(255,255,255,0.6)" stroke-width="2"
                            />
                        </svg>
                        <div class="turntable-inner">
                            <div v-for="(prize, index) in prizes" :key="index" class="prize-segment" :style="getSegmentStyle(index)">
                                <span class="prize-text">{{ prize.name }}</span>
                            </div>
                        </div>
                        <div class="turntable-center">
                            <span class="center-text">GO</span>
                        </div>
                    </div>
                    <div class="pointer">
                        <div class="pointer-triangle"></div>
                    </div>
                </div>

                <button class="spin-btn" :disabled="isSpinning || chances <= 0 || drawLoading" @click="spin">
                    <van-loading v-if="drawLoading" type="spinner" color="#fff" size="20px" />
                    <span v-else>{{ isSpinning ? 'Spinning...' : (chances > 0 ? 'Spin Now!' : 'No spins left') }}</span>
                </button>
            </div>

            <div class="records-section">
                <h2 class="section-title">🏆 Reward Records</h2>
                <div class="records-list" ref="scrollContainer">
                    <div v-if="recordsLoading" class="loading-records">
                        <van-loading type="spinner" color="#fff" size="24px" />
                    </div>
                    <div v-else-if="records.length === 0" class="empty-records">
                        <span class="empty-icon">📋</span>
                        <span class="empty-text">No records yet. Start spinning!</span>
                    </div>
                    <div v-else class="record-item" v-for="(record, index) in records" :key="index">
                        <div class="record-left">
                            <span class="record-user">{{ record.user }}</span>
                            <span class="record-time">{{ record.time }}</span>
                        </div>
                        <div class="record-right">
                            <span class="record-prize">{{ record.prize }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <van-popup v-model:show="showPrizeModal" position="center" class="prize-modal" round :close-on-click-overlay="false">
                <div class="prize-modal-content">
                    <div class="prize-modal-header">
                        <span class="prize-modal-title">🎉 Congratulations!</span>
                    </div>
                    <div class="prize-modal-body">
                        <div class="prize-icon">{{ wonPrize?.icon }}</div>
                        <div class="prize-name">{{ wonPrize?.name }}</div>
                        <p class="prize-desc">{{ wonPrize?.desc }}</p>
                    </div>
                    <div class="prize-modal-footer">
                        <button class="prize-confirm-btn" @click="showPrizeModal = false">Claim Prize</button>
                    </div>
                </div>
            </van-popup>
        </template>
    </div>
</template>

<script setup>
import { showToast } from 'vant'
import { getLuckyConfig, doLuckyDraw, getLuckyRecords } from '~/api/lucky'

definePageMeta({ 
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

const SPIN_DURATION = 4000

const loading = ref(true)
const drawLoading = ref(false)
const recordsLoading = ref(false)
const prizes = ref([])
const chances = ref(0)
const isSpinning = ref(false)
const rotation = ref(0)
const showPrizeModal = ref(false)
const wonPrize = ref(null)
const records = ref([])

const segmentColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#FF69B4',
    '#00CED1', '#FF6347', '#7B68EE', '#3CB371'
]

const prizeCount = computed(() => prizes.value.length || 1)

const divisionLines = computed(() => {
    return prizes.value.map((_, index) => {
        const rad = (index * 360 / prizeCount.value - 90) * Math.PI / 180
        return {
            index,
            x2: 145 + 130 * Math.cos(rad),
            y2: 145 + 130 * Math.sin(rad)
        }
    })
})

const conicGradient = computed(() => {
    const count = prizeCount.value
    const segments = []
    for (let i = 0; i < count; i++) {
        const color = segmentColors[i % segmentColors.length]
        const start = i === 0 ? -90 : -90 + (i * 360 / count)
        const end = -90 + ((i + 1) * 360 / count)
        segments.push(`${color} ${start}deg ${end}deg`)
    }
    return `conic-gradient(${segments.join(', ')})`
})

const turntableStyle = computed(() => {
    return {
        transform: `rotate(${rotation.value}deg)`,
        background: conicGradient.value
    }
})

const getSegmentStyle = (index) => {
    const segmentAngle = 360 / prizeCount.value
    const angle = segmentAngle * index + segmentAngle / 2
    return {
        transform: `rotate(${angle}deg) translateY(-105px)`
    }
}

const calcTargetRotation = (prizeIndex) => {
    const anglePerPrize = 360 / prizeCount.value
    const extraSpins = 5 * 360
    const prizeAngle = 360 - (prizeIndex * anglePerPrize + anglePerPrize / 2)
    return rotation.value + extraSpins + prizeAngle
}

const onSpinComplete = (prize) => {
    rotation.value = rotation.value % 360
    isSpinning.value = false
    drawLoading.value = false
    showPrizeModal.value = true
    fetchRecords()
}

const formatTime = (date) => {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', '')
}

const fetchConfig = async () => {
    try {
        const res = await getLuckyConfig()
        if (res.success) {
            prizes.value = res.data.prizes || []
            chances.value = res.data.chances ?? 0
        }
    } catch (error) {
        console.error('Failed to fetch config:', error)
    } finally {
        loading.value = false
    }
}

const fetchRecords = async () => {
    recordsLoading.value = true
    try {
        const res = await getLuckyRecords()
        if (res.success) {
            records.value = res.data.list || []
        }
    } catch (error) {
        console.error('Failed to fetch records:', error)
    } finally {
        recordsLoading.value = false
    }
}

const spin = async () => {
    if (isSpinning.value || chances.value <= 0 || drawLoading.value) return

    isSpinning.value = true
    drawLoading.value = true

    try {
        const res = await doLuckyDraw()
        if (res.success) {
            const prizeIndex = res.data.prizeIndex
            wonPrize.value = res.data.prize
            chances.value = res.data.remainingChances ?? chances.value - 1
            rotation.value = calcTargetRotation(prizeIndex)

            setTimeout(() => {
                onSpinComplete(wonPrize.value)
            }, SPIN_DURATION)
        }
    } catch (error) {
        console.error('Draw failed:', error)
        isSpinning.value = false
        drawLoading.value = false
        showToast('Spin failed, please try again')
    }
}

onMounted(async () => {
    await Promise.all([fetchConfig(), fetchRecords()])
})
</script>

<style scoped lang="scss">
.lucky-page {
    min-height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    padding: rem(10) rem(16);
    padding-bottom: rem(100);
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: rem(12);
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    z-index: 999;
}

.loading-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: rem(14);
}

.loading-records {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(40) 0;
}

.lucky-header {
    text-align: center;
    padding: rem(30) 0 rem(20);
}

.page-title {
    font-size: rem(36);
    font-weight: 700;
    color: #fff;
    margin: 0 0 rem(10);
    text-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
}

.page-desc {
    font-size: rem(16);
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

.chances-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(8);
    padding: rem(16) rem(24);
    background: rgba(255, 255, 255, 0.1);
    border-radius: $radius-full;
    margin: 0 auto rem(30);
    width: fit-content;
    backdrop-filter: blur(10px);
}

.chances-icon {
    font-size: rem(24);
}

.chances-text {
    font-size: rem(16);
    color: #fff;
    strong {
        color: #ffd700;
        font-weight: 700;
    }
}

.turntable-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: rem(40);
}

.turntable-container {
    position: relative;
    width: rem(290);
    height: rem(290);
}

.turntable {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 0 0 rem(8) #fff, 0 0 0 rem(12) #ffd700, 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    overflow: hidden;
    outline: rem(4) solid rgba(255, 255, 255, 0.3);

    &.spinning {
        box-shadow: 0 0 0 rem(8) #fff, 0 0 0 rem(12) #ffd700, 0 0 40px rgba(255, 215, 0, 0.5);
    }
}

.division-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;

    line {
        stroke-dasharray: 1000;
        stroke-dashoffset: 0;
    }
}

.turntable-inner {
    position: absolute;
    width: 100%;
    height: 100%;
}

.prize-segment {
    position: absolute;
    top: rem(145);
    left: rem(145);
    transform-origin: 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.prize-text {
    font-size: rem(13);
    font-weight: 800;
    color: #fff;
    text-shadow: 
        1px 1px 2px rgba(0, 0, 0, 0.5),
        0 0 10px rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.25);
    padding: rem(3) rem(5);
    border-radius: rem(4);
    white-space: nowrap;
    transform: rotate(-90deg);
}

.turntable-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: rem(60);
    height: rem(60);
    background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.3),
        inset 0 2px 4px rgba(255, 255, 255, 0.5);
    z-index: 10;
    border: rem(4) solid #fff;
}

.center-text {
    font-size: rem(18);
    font-weight: 800;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.pointer {
    position: absolute;
    top: rem(-12);
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
}

.pointer-triangle {
    width: 0;
    height: 0;
    border-left: rem(16) solid transparent;
    border-right: rem(16) solid transparent;
    border-top: rem(35) solid #ffd700;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: rem(-35);
        left: rem(-16);
        width: 0;
        height: 0;
        border-left: rem(18) solid transparent;
        border-right: rem(18) solid transparent;
        border-top: rem(36) solid rgba(255, 255, 255, 0.3);
    }
}

.spin-btn {
    margin-top: rem(30);
    padding: rem(18) rem(60);
    font-size: rem(20);
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    border: none;
    border-radius: $radius-full;
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    cursor: pointer;
    transition: $transition-base;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: rem(200);

    &:disabled {
        background: #666;
        box-shadow: none;
        cursor: not-allowed;
    }

    &:not(:disabled):active {
        transform: scale(0.95);
    }
}

.records-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: $radius-lg;
    padding: rem(20);
    backdrop-filter: blur(10px);
}

.section-title {
    font-size: rem(20);
    font-weight: 700;
    color: #fff;
    margin: 0 0 rem(16);
}

.records-list {
    max-height: rem(300);
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
    }
}

.empty-records {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: rem(40) 0;
}

.empty-icon {
    font-size: rem(48);
    margin-bottom: rem(12);
}

.empty-text {
    font-size: rem(14);
    color: rgba(255, 255, 255, 0.6);
}

.record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(14) 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
        border-bottom: none;
    }
}

.record-left {
    display: flex;
    flex-direction: column;
    gap: rem(4);
}

.record-user {
    font-size: rem(14);
    font-weight: 600;
    color: #fff;
}

.record-time {
    font-size: rem(12);
    color: rgba(255, 255, 255, 0.5);
}

.record-right {
    text-align: right;
}

.record-prize {
    font-size: rem(16);
    font-weight: 700;
    color: #ffd700;
}

.prize-modal {
    background: transparent;
}

.prize-modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: $radius-xl;
    padding: rem(30);
    text-align: center;
    min-width: rem(300);
}

.prize-modal-header {
    margin-bottom: rem(20);
}

.prize-modal-title {
    font-size: rem(24);
    font-weight: 700;
    color: #ffd700;
    text-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
}

.prize-modal-body {
    padding: rem(20) 0;
}

.prize-icon {
    font-size: rem(80);
    margin-bottom: rem(16);
    animation: bounce 0.6s ease infinite alternate;
}

@keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-10px); }
}

.prize-name {
    font-size: rem(28);
    font-weight: 700;
    color: #fff;
    margin-bottom: rem(8);
}

.prize-desc {
    font-size: rem(14);
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
}

.prize-modal-footer {
    margin-top: rem(20);
}

.prize-confirm-btn {
    width: 100%;
    padding: rem(16);
    font-size: rem(18);
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
    border: none;
    border-radius: $radius-full;
    cursor: pointer;
    transition: $transition-base;

    &:active {
        transform: scale(0.98);
    }
}
</style>
