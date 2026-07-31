<template>
    <div class="task-detail">
        <div class="video-container">

            <div style="position: relative;">
                <div v-if="videoLoading" class="video-loading">
                    <div class="loading-spinner"></div>
                    <p>{{ $lang('加载中') }}...</p>
                </div>
                <video ref="videoRef" class="video-player" muted loop playsinline autoplay
                    webkit-playsinline="true" x5-playsinline="true" @play="onVideoPlay"
                    @canplay="videoLoading = false">
                    <source :src="videoSrc" type="video/mp4">
                </video>
            </div>


            <div class="claim-btn" :class="{ 'claim-btn--disabled': !finished }" @click="finished && claimReward()">
                <span v-if="!finished" class="btn-text">{{ countdown }}s</span>
                <span v-else>{{ $lang('立即领取') }}</span>
                <div v-if="finished" class="btn-shine"></div>
            </div>

            <div v-if="showSuccess" class="success-modal" @click="closeShow">
                <div class="success-card" role="dialog" aria-modal="true" @click.stop>
                    <div class="success-card-brand"></div>
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
                        <span class="currency">Rs</span>
                        <span class="value">{{ incomeAmount }}</span>
                    </div>
                    <div class="success-desc">{{ $lang('奖励已发放到您的账户') }}</div>
                    <button type="button" class="success-close-hint" @click="closeShow">{{ $lang('我知道了') }}</button>
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
const videoLoading = ref(true)
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
    const video = videoRef.value
    if (!video) return

    // 确保 muted 属性生效（部分浏览器需要通过 JS 设置）
    video.muted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')

    const attempt = () => {
        video.play().catch(e => {
            console.log('Play failed:', e)
            // 自动播放被阻止，监听用户交互后再播放
            const playOnInteraction = () => {
                video.play().catch(() => {})
                // 如果视频仍未播放，启动倒计时兜底
                startCountdownFallback()
            }
            document.addEventListener('touchstart', playOnInteraction, { once: true })
            document.addEventListener('click', playOnInteraction, { once: true })
        })
    }

    if (video.readyState >= 2) {
        attempt()
    } else {
        video.addEventListener('canplay', attempt, { once: true })
        // 超时兜底：5秒后如果还没 canplay，强制尝试播放
        setTimeout(() => {
            if (video.readyState < 2) attempt()
        }, 5000)
    }
}

// 兜底倒计时：如果 play 事件始终未触发，确保用户不会卡住
const startCountdownFallback = () => {
    if (timer) return // 已经在倒计时了
    setTimeout(() => {
        if (!timer && !finished.value) {
            onVideoPlay()
        }
    }, 3000)
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

.video-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #000;
    z-index: 10;
    color: #fff;
    font-size: rem(14);

    p {
        margin-top: rem(12);
        opacity: 0.7;
    }
}

.loading-spinner {
    width: rem(36);
    height: rem(36);
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
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
        background: #F01414;
        box-shadow: 0 rem(10) rem(24) rgba(240, 20, 20, 0.22);
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
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: rem(24);
    background: rgba(22, 24, 30, 0.56);
    backdrop-filter: blur(8px);
    z-index: 50;
    animation: modalFade 0.22s ease-out;
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
    width: min(100%, rem(318));
    min-height: rem(348);
    padding: rem(34) rem(24) rem(22);
    background: #FFFFFF;
    border: 1px solid rgba(206, 0, 0, 0.08);
    border-radius: rem(12);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 rem(22) rem(56) rgba(0, 0, 0, 0.22);
    animation: cardPop 0.26s ease-out;
    overflow: hidden;
}

.success-card-brand {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: rem(7);
    background: linear-gradient(90deg, #CE0000 0%, #F04444 52%, #303030 100%);
}

@keyframes cardPop {
    0% {
        transform: translateY(rem(18)) scale(0.96);
        opacity: 0;
    }

    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.glow-bg {
    position: absolute;
    top: rem(46);
    left: 50%;
    transform: translate(-50%, -50%);
    width: rem(178);
    height: rem(178);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(206, 0, 0, 0.12) 0%, rgba(206, 0, 0, 0) 70%);
    pointer-events: none;
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
    height: rem(150);
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
}

.particle {
    position: absolute;
    width: rem(5);
    height: rem(5);
    background: rgba(206, 0, 0, 0.28);
    border-radius: 50%;
    top: rem(78);
    left: 50%;
    animation: particleOut 0.82s ease-out forwards;
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
    width: rem(82);
    height: rem(82);
    margin-top: rem(8);
    margin-bottom: rem(18);
    position: relative;
    z-index: 1;
}

.icon-circle {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #CE0000 0%, #F04444 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 rem(14) rem(28) rgba(206, 0, 0, 0.24);
    animation: iconPop 0.32s ease-out 0.08s both;

    svg {
        width: rem(42);
        height: rem(42);
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
    position: relative;
    z-index: 1;
    color: #333333;
    font-size: rem(17);
    line-height: 1.3;
    font-weight: 900;
}

.success-amount {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: rem(6);
    width: 100%;
    margin-top: rem(12);
    padding: rem(14) rem(12);
    border-radius: rem(8);
    background: #FFF1F1;
    border: 1px solid rgba(206, 0, 0, 0.08);
    position: relative;
    z-index: 1;

    .currency {
        color: #CE0000;
        font-size: rem(17);
        line-height: 1;
        font-weight: 850;
    }

    .value {
        color: #CE0000;
        font-size: rem(42);
        line-height: 0.95;
        font-weight: 900;
        overflow-wrap: anywhere;
    }
}

.success-desc {
    position: relative;
    z-index: 1;
    margin-top: rem(14);
    max-width: rem(230);
    text-align: center;
    color: #4A4A4A;
    font-size: rem(13);
    line-height: 1.55;
}

.success-close-hint {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: rem(45);
    margin-top: rem(22);
    border-radius: rem(4);
    background: #303030;
    color: #FFFFFF;
    font-size: rem(14);
    font-weight: 850;
    cursor: pointer;
    transition: transform 0.16s ease, background 0.16s ease;

    &:active {
        transform: scale(0.98);
        background: #1F1F1F;
    }
}

@media (max-width: 374px) {
    .success-modal {
        padding: rem(18);
    }

    .success-card {
        padding-inline: rem(20);
    }

    .success-amount .value {
        font-size: rem(36);
    }
}
</style>
