<template>
    <div class="task-detail">
        <div class="video-container">
            <video ref="videoRef" class="video-player" :src="videoSrc" muted loop playsinline autoplay
                webkit-playsinline="true" x5-playsinline="true"
                @play="onVideoPlay"></video>

            <div class="claim-btn" :class="{ 'claim-btn--disabled': !finished }" @click="finished && claimReward()">
                <span v-if="!finished" class="btn-text">{{ countdown }}s</span>
                <span v-else>{{ $lang('立即领取') }}</span>
                <div v-if="finished" class="btn-shine"></div>
            </div>

            <div v-if="showSuccess" class="success-modal" @click="closeShow">
                <div class="success-card">
                    <div class="particles">
                        <span v-for="i in 12" :key="i" class="particle" :style="{ '--delay': i * 0.1 + 's' }"></span>
                    </div>
                    <div class="glow-bg"></div>
                    <div class="success-icon">
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path class="check-path" d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div class="success-text">{{ $lang('恭喜获得') }}</div>
                    <div class="success-amount">
                        <span class="currency">R$</span>
                        <span class="value">{{ incomeAmount }}</span>
                    </div>
                    <div class="success-desc">{{ $lang('奖励已发放到您的账户') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { navigateTo } from '#imports'
import { getOrderIncome } from '~/api/product'

definePageMeta({
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})

const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const videoRef = ref(null)
const videoSrc = ref('')
const finished = ref(false)
const countdown = ref()
const orderId = ref(0)
const showSuccess = ref(false)
const appStore = useAppStore()
const incomeAmount = ref(0)
let timer = null

const onVideoPlay = () => {
    if (!finished.value) {
        timer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(timer)
                finished.value = true
            }
        }, 1000)
    }
}

const closeShow = () => {
    showSuccess.value = false
    history.back()
}

const claimReward = () => {

    showLoading($lang('加载中'))
    getOrderIncome({ order_id: orderId.value }).then(res => {
        hideLoading();
        if (res.success) {
            showSuccess.value = true
        } else {
            showMsg(res.message, 'fail')
        }

    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')
    })
}

const tryPlay = () => {
    if (!videoRef.value) return
    videoRef.value.load()
    const attempt = () => {
        videoRef.value?.play().catch(e => {
            console.log('Play failed:', e)
            if (e.name === 'NotAllowedError') {
                // 移动端需要用户交互，添加一次性点击监听
                document.addEventListener('touchstart', () => {
                    videoRef.value?.play()
                }, { once: true })
            }
        })
    }
    if (videoRef.value.readyState >= 2) {
        attempt()
    } else {
        videoRef.value.addEventListener('canplay', attempt, { once: true })
    }
}

onMounted(() => {
    const data = appStore.getTaskData
    if (Object.keys(data).length > 0) {
        console.log(data)
        videoSrc.value = data.video_url
        countdown.value = data.watch_seconds
        orderId.value = data.id
        incomeAmount.value = data.income_amount
        nextTick(() => tryPlay())
    } else {
        history.back()
    }
})
</script>

<style lang="scss" scoped>
.task-detail {
    height: 100%;
}

.video-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.video-player {
    width: 100%;
    object-fit: cover;
}

.claim-btn {
    position: fixed;
    bottom: rem(10);
    left: 50%;
    transform: translateX(-50%);
    padding: rem(14) rem(40);
    border-radius: rem(30);
    font-size: rem(16);
    font-weight: 800;
    color: #fff;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
    min-width: rem(270);
    text-align: center;

    &--disabled {
        background: #94a3b8;
        pointer-events: none;
        box-shadow: none;
        animation: none;
    }

    &:not(&--disabled) {
        background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%);
        box-shadow: 0 4px 20px rgba(251, 191, 36, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        animation: btnPulse 2s ease-in-out infinite;

        &:active {
            transform: translateX(-50%) scale(0.95);
        }
    }
}

.btn-text {
    z-index: 1;
}

.btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shine 2s ease-in-out infinite;
}

@keyframes btnPulse {

    0%,
    100% {
        box-shadow: 0 4px 20px rgba(251, 191, 36, 0.5);
    }

    50% {
        box-shadow: 0 4px 30px rgba(251, 191, 36, 0.8);
    }
}

@keyframes shine {
    0% {
        left: -100%;
    }

    50%,
    100% {
        left: 100%;
    }
}

.success-modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    animation: modalFade 0.4s ease;
}

@keyframes modalFade {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.success-card {
    position: relative;
    width: rem(280);
    padding: rem(40) rem(30);
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    border-radius: rem(24);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(12);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(251, 191, 36, 0.2);
    animation: cardPop 0.5s ease;
    overflow: hidden;
}

@keyframes cardPop {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.glow-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: rem(200);
    height: rem(200);
    background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
    animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {

    0%,
    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.5;
    }

    50% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 1;
    }
}

.particles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
}

.particle {
    position: absolute;
    width: rem(8);
    height: rem(8);
    background: #fbbf24;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    animation: particleOut 1s ease-out forwards;
    animation-delay: var(--delay);

    @for $i from 1 through 12 {
        &:nth-child(#{$i}) {
            --angle: #{$i * 30}deg;
        }
    }
}

@keyframes particleOut {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }

    100% {
        transform: translate(calc(-50% + cos(var(--angle)) * 100px), calc(-50% + sin(var(--angle)) * 100px)) scale(0);
        opacity: 0;
    }
}

.success-icon {
    width: rem(80);
    height: rem(80);
    position: relative;
    z-index: 1;
}

.icon-circle {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
    animation: iconPop 0.5s ease 0.2s both;

    svg {
        width: rem(40);
        height: rem(40);
        color: #fff;
    }
}

.check-path {
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    animation: checkDraw 0.5s ease 0.5s forwards;
}

@keyframes iconPop {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes checkDraw {
    to {
        stroke-dashoffset: 0;
    }
}

.success-text {
    font-size: rem(16);
    color: rgba(255, 255, 255, 0.7);
    position: relative;
    z-index: 1;
}

.success-amount {
    display: flex;
    align-items: baseline;
    gap: rem(4);
    position: relative;
    z-index: 1;

    .currency {
        font-size: rem(20);
        font-weight: 600;
        color: #fbbf24;
    }

    .value {
        font-size: rem(48);
        font-weight: 900;
        color: #fbbf24;
        text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
    }
}

.success-desc {
    font-size: rem(12);
    color: rgba(255, 255, 255, 0.5);
    margin-top: rem(8);
    position: relative;
    z-index: 1;
    text-align: center;
}
</style>