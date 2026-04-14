<template>
    <div class="lucky-page">
        <div class="loading-overlay" v-if="loading">
            <van-loading type="spinner" color="#ffd700" size="40px" />
        </div>
        <template v-else>
            <div class="lucky-header">
                <div class="header-top">
                    <h1 class="page-title">{{ $lang('幸运转盘') }}</h1>
                    <div class="records-entry" @click="navigateTo('/profile/lucky/record')">
                        <van-icon name="orders-o" size="20" />
                        <span>{{ $lang('我的奖励') }}</span>
                    </div>
                </div>
                <div class="chances-wrap">
                    <span class="chances-text">{{ $lang('剩余次数') }}: <strong>{{ chances }}</strong></span>
                </div>
            </div>
            <div class="wheel-container">
                <div class="wheel-wrapper">
                    <div class="pointer"></div>
                    <div class="wheel" :class="{ spinning: isSpinning }"
                        :style="{ transform: `rotate(${currentRotation}deg)` }"
                        ref="wheelEl">
                        <!-- SVG 扇形背景层 -->
                        <svg class="wheel-svg" viewBox="0 0 300 300">
                            <defs>
                                <clipPath v-for="(prize, index) in prizes" :key="'clip-'+index" :id="'sector-clip-'+index">
                                    <path :d="getSectorPath(index, 150)" />
                                </clipPath>
                            </defs>
                            <g v-for="(prize, index) in prizes" :key="'seg-'+index">
                                <image
                                    :clip-path="`url(#sector-clip-${index})`"
                                    :href="segmentImages[index % segmentImages.length]"
                                    x="0" y="0" width="300" height="300"
                                    preserveAspectRatio="xMidYMid slice"
                                />
                                <path :d="getSectorPath(index, 150)" fill="rgba(0,0,0,0.35)" />
                                <line
                                    :x1="150" :y1="150"
                                    :x2="getSectorLineEnd(index).x"
                                    :y2="getSectorLineEnd(index).y"
                                    stroke="rgba(255,255,255,0.15)" stroke-width="1"
                                />
                            </g>
                        </svg>
                        <!-- 文字内容层 -->
                        <div class="prize-list-layer">
                            <div v-for="(prize, index) in prizes" :key="'text-'+index" class="prize-item"
                                :style="getPrizePosition(index)">
                                <div class="prize-text" translate="no">R$ {{ parseFloat(prize.number) }}</div>
                                <img class="prize-icon" src="../../../assets/img/index/coin.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="wheel-center" :class="{ disabled: isSpinning || chances <= 0 }" @click="startDraw">
                        <van-loading v-if="isSpinning" color="#fff" size="24px" />
                        <span v-else>{{ isSpinning ? $lang('抽奖中') : $lang('开始') }}</span>
                    </div>
                </div>
            </div>

            <div class="invite-tip">
                <div class="tip-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div class="tip-content">
                    <div class="tip-title">{{ $lang('别错过这个！') }}</div>
                    <div class="tip-desc">{{ $lang('带上你的VIP朋友，让你离大奖越来越近。你的中奖机会随每一次邀请而成倍增长！') }}</div>
                </div>
            </div>

            <div class="records-section">
                <h2 class="section-title">{{ $lang('中奖记录') }}</h2>
                <div class="records-header">
                    <span>{{ $lang('用户') }}</span>
                    <span>{{ $lang('时间') }}</span>
                    <span>{{ $lang('奖励') }}</span>
                </div>
                <div v-if="recordsLoading" class="loading-records">
                    <van-loading type="spinner" color="#fff" size="24px" />
                </div>
                <div v-else-if="records.length === 0" class="empty-records">
                    <span class="empty-text">{{ $lang('暂无数据') }}</span>
                </div>
                <div v-else :class="records.length > 3 ? 'records-scroll' : 'records-list'">
                    <div :class="records.length > 3 ? 'scroll-inner' : ''"
                        :style="records.length > 3 ? { animationDuration: records.length + 's' } : {}">
                        <div class="record-item" v-for="(record, index) in records" :key="index">
                            <span class="record-name">{{ record.phone }}</span>
                            <span class="record-name">{{ record.create_time }}</span>
                            <span class="record-prize" translate="no">+ R${{ parseFloat(record.number) }}</span>
                        </div>
                        <template v-if="records.length > 3">
                            <div class="record-item" v-for="(record, index) in records" :key="'copy-' + index">
                                <span class="record-name">{{ record.phone }}</span>
                                <span class="record-name">{{ record.create_time }}</span>
                                <span class="record-prize" translate="no">+ R${{ parseFloat(record.number) }}</span>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <van-popup v-model:show="showPrizeModal" position="center" class="prize-modal" round
                :close-on-click-overlay="false">
                <div class="prize-modal-content">
                    <div class="prize-bg">
                        <div class="prize-glow"></div>
                        <div class="modal-prize-icon">🎁</div>
                        <div class="prize-amount-wrapper">
                            <span class="prize-currency">R$</span>
                            <span class="prize-amount" :class="{ 'animate': showPrizeModal }">{{ wonAmount }}</span>
                        </div>
                        <div class="prize-label">{{ $lang('恭喜获得奖励') }}</div>
                    </div>
                    <button class="prize-confirm-btn" @click="handleCollectPrize">{{ $lang('收下奖励') }}</button>
                </div>
            </van-popup>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMemberInfo, turntableConfig, turntableOpen, rewardOrderList } from '~/api/turntable';
import { navigateTo } from '#imports'
definePageMeta({
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

onMounted(() => {
    handleGetMemberInfo()
    handleTurntableConfig()
    fetchRecords();
})
//获取转盘次数
const chances = ref(0)
const handleGetMemberInfo = () => {
    getMemberInfo({}).then(res => {
        chances.value = res.data.spin_chance
    }).catch(error => {

    })
}

//获取转盘配置
const prizes = ref([])//奖品列表
const handleTurntableConfig = () => {
    turntableConfig({}).then(res => {
        loading.value = false
        if (res.success) {
            prizes.value = res.data
        } else {
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

const isSpinning = ref(false)
const showPrizeModal = ref(false)

const handleCollectPrize = () => {
    showPrizeModal.value = false
    currentRotation.value = 0
}
const wheelEl = ref(null)
const currentRotation = ref(0)
const wonAmount = ref(0)
const records = ref([])
const scrollContainer = ref(null)

// 8张风景背景图片
const segmentImages = [
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-04-03/24a760b5810014ce304f52f6c113d1a4',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-04-03/ee06a29693e0cef3d2d38e764ed3d4a4',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-04-03/1a68e9620704171f3251746d8fd6cd2e',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-04-03/9ea5581394d97ca58489b3ffda146688',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-04-03/d20a84497af2c0c7f27842c8d1f1a578',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-04-03/23d7a9cca14b9636ca4a21741c2b1891',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-04-03/9d4cbdc3b5b9ddd54f65c61a2d5a32b0',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-04-01/626fc79743429b52cdce5efba9477d71',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-03-29/01253f4bc1ab9b3eb92abf17aea4bf87',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-03-30/d259033462bd2a09fd9a5f15e20d3898',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-03-29/f0d0b070be593820651230120b0374be',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-03-29/3ca4087e5b9589e21dcaa07653fe9d44',
    'https://transitswap.s3.ap-southeast-1.amazonaws.com/upload/image/2026-03-29/402e7a220c663e14a569ef864df51748',
]

// 生成SVG扇形路径
const getSectorPath = (index, radius) => {
    const count = prizes.value.length || 8
    const angle = 360 / count
    const startAngle = index * angle - 90
    const endAngle = startAngle + angle
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const cx = radius
    const cy = radius
    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)
    const largeArc = angle > 180 ? 1 : 0
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

// 计算奖品文字+图标在扇形中心的位置
const getPrizePosition = (index) => {
    const count = prizes.value.length || 8
    const angle = 360 / count
    const midAngle = index * angle + angle / 2 - 90
    const midRad = (midAngle * Math.PI) / 180
    // 放在半径60%处，避开中心按钮
    const dist = 0.6
    const x = 50 + dist * 50 * Math.cos(midRad)
    const y = 50 + dist * 50 * Math.sin(midRad)
    return {
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${index * angle + angle / 2}deg)`
    }
}

// 计算扇形分割线终点坐标
const getSectorLineEnd = (index) => {
    const count = prizes.value.length || 8
    const angle = 360 / count
    const rad = (index * angle - 90) * Math.PI / 180
    return {
        x: 150 + 150 * Math.cos(rad),
        y: 150 + 150 * Math.sin(rad)
    }
}

const fetchRecords = async () => {
    recordsLoading.value = true
    try {
        const res = await rewardOrderList({ page: 1, rows: 10 })
        if (res.success) {
            records.value = res.data.list || []
        } else {
            showMsg(res.message, 'fail')
        }
    } catch (error) {
        showMsg(error.message, 'fail')
    } finally {
        recordsLoading.value = false
    }
}

const startDraw = async () => {
    if (isSpinning.value || chances.value <= 0 || drawLoading.value) return

    currentRotation.value = 0
    isSpinning.value = true
    drawLoading.value = true

    try {
        const res = await turntableOpen()
        if (res.success) {
            handleGetMemberInfo();
            const star = res.data.star
            wonAmount.value = res.data.number || 0

            const targetIndex = prizes.value.findIndex(p => p.star == star)
            if (targetIndex == -1) {
                isSpinning.value = false
                drawLoading.value = false
                return
            }

            const totalSegments = prizes.value.length
            const anglePerSegment = 360 / totalSegments
            const targetAngle = targetIndex * anglePerSegment + anglePerSegment / 2
            const extraSpins = 5 * 360
            const finalAngle = extraSpins + (360 - targetAngle)

            currentRotation.value = finalAngle

            setTimeout(() => {
                isSpinning.value = false
                drawLoading.value = false
                showPrizeModal.value = true
            }, 4200)
        } else {
            isSpinning.value = false
            drawLoading.value = false
            showMsg(res.message, 'fail')
        }
    } catch (error) {
        isSpinning.value = false
        drawLoading.value = false
        showMsg(error.message, 'fail')
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

.wheel-container {
    display: flex;
    justify-content: center;
    margin: rem(24) 0 rem(30);
}

.invite-tip {
    display: flex;
    align-items: flex-start;
    gap: rem(12);
    padding: rem(16);
    background: linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(180, 83, 9, 0.1) 100%);
    border: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: rem(12);
    margin-bottom: rem(24);
}

.tip-icon {
    flex-shrink: 0;
    width: rem(36);
    height: rem(36);
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    border-radius: 50%;

    svg {
        width: rem(20);
        height: rem(20);
        color: #fff;
    }
}

.tip-content {
    flex: 1;
}

.tip-title {
    font-size: rem(15);
    font-weight: 600;
    color: #fbbf24;
    margin-bottom: rem(4);
}

.tip-desc {
    font-size: rem(13);
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
}

.wheel-wrapper {
    position: relative;
    width: rem(280);
    height: rem(280);
}

.pointer {
    position: absolute;
    top: rem(-10);
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: rem(16) solid transparent;
    border-right: rem(16) solid transparent;
    border-top: rem(28) solid #d97706;
    z-index: 20;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.wheel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 0 rem(8) rgba(255, 255, 255, 0.06), 0 0 rem(24) rgba(0, 0, 0, 0.3);
}

.wheel.spinning {
    transition: transform 4s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.wheel-svg {
    width: 100%;
    height: 100%;
    display: block;
}

.prize-list-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
}

.prize-item {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(2);
    white-space: nowrap;
}

.prize-text {
    font-size: rem(14);
    color: #fff;
    font-weight: 700;
    text-shadow: 0 rem(1) rem(3) rgba(0, 0, 0, 0.8);
    line-height: 1;
    margin-top: rem(-20);
}

.prize-icon {
    width: rem(30);
    height: rem(30);
    margin-top: rem(10);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.wheel-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: rem(80);
    height: rem(80);
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

.records-header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: rem(8);
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    font-size: rem(11);
    margin-bottom: rem(8);
    padding: 0 rem(4);
}

.records-scroll {
    height: rem(144);
    overflow: hidden;
}

.records-list {
    overflow: hidden;
}

.scroll-inner {
    animation: scrollUp 10s linear infinite;
}

@keyframes scrollUp {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-50%);
    }
}

.record-item {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: rem(36);
    align-items: center;
    text-align: center;
}

.loading-records,
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

.modal-prize-icon {
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