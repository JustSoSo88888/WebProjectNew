<template>
    <div>
        <!-- Android/Chrome 安装横幅 -->
        <transition name="slide-up">
            <div v-if="showInstallBanner" class="pwa-install-banner">
                <img src="/logo.png" class="pwa-icon" alt="icon" />
                <div class="pwa-info">
                    <div class="pwa-name">NovaTravel</div>
                    <div class="pwa-desc">{{ $t('添加到主屏幕，获得更好体验') }}</div>
                </div>
                <div class="pwa-actions">
                    <button class="pwa-btn-install" @click="installPwa">{{ $t('安装') }}</button>
                    <button class="pwa-btn-close" @click="dismissBanner">✕</button>
                </div>
            </div>
        </transition>

        <!-- Android 非Chrome 建议横幅 -->
        <transition name="slide-up">
            <div v-if="showChromeBanner" class="pwa-install-banner pwa-chrome-banner">
                <div class="pwa-chrome-icon">
                    <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="20" fill="#4285F4" />
                        <circle cx="24" cy="24" r="10" fill="white" />
                        <circle cx="24" cy="24" r="7" fill="#4285F4" />
                        <path d="M24 4 A20 20 0 0 1 41.3 14 L31.5 14 A10 10 0 0 0 24 14 Z" fill="#EA4335" />
                        <path d="M41.3 14 A20 20 0 0 1 41.3 34 L34.2 27 A10 10 0 0 0 31.5 14 Z" fill="#FBBC05" />
                        <path d="M41.3 34 A20 20 0 0 1 6.7 34 L13.8 27 A10 10 0 0 0 34.2 27 Z" fill="#34A853" />
                        <path d="M6.7 34 A20 20 0 0 1 6.7 14 L16.5 14 A10 10 0 0 0 13.8 27 Z" fill="#EA4335" />
                    </svg>
                </div>
                <div class="pwa-info">
                    <div class="pwa-name">{{ $t('建议使用Chrome') }}</div>
                    <div class="pwa-desc">{{ $t('使用Chrome浏览器以获得更好体验') }}</div>
                </div>
                <button class="pwa-btn-close" @click="handleChromeClose">✕</button>
            </div>
        </transition>

        <!-- iOS 引导弹窗 -->
        <van-popup v-model:show="showIosGuide" position="bottom" @close="handleIosGuideClose" round>
            <div class="ios-guide-popup">
                <div class="ios-guide-title gradient-title-text size-bold size-16">
                    {{ isIos() ? $t('添加到主屏幕') : $t('安装应用') }}
                </div>
                <div class="ios-guide-steps" v-if="isIos()">
                    <div class="ios-step">
                        <span class="ios-step-num">1</span>
                        <span>{{ $t('点击底部') }} <span class="ios-share-icon">⎙</span> {{ $t('分享按钮') }}</span>
                    </div>
                    <div class="ios-step">
                        <span class="ios-step-num">2</span>
                        <span>{{ $t('选择「添加到主屏幕」') }}</span>
                    </div>
                    <div class="ios-step">
                        <span class="ios-step-num">3</span>
                        <span>{{ $t('点击「添加」确认') }}</span>
                    </div>
                </div>
                <div class="ios-guide-steps" v-else>
                    <div class="ios-step">
                        <span class="ios-step-num">1</span>
                        <span>{{ $t('点击浏览器右上角菜单') }} ⋮</span>
                    </div>
                    <div class="ios-step">
                        <span class="ios-step-num">2</span>
                        <span>{{ $t('选择「添加到主屏幕」或「安装应用」') }}</span>
                    </div>
                    <div class="ios-step">
                        <span class="ios-step-num">3</span>
                        <span>{{ $t('点击「安装」确认') }}</span>
                    </div>
                </div>
                <button class="ios-guide-close" @click="handleIosGuideClose">{{ $t('知道了') }}</button>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const DISMISS_KEY = 'NovaTravel_pwa_dismissed';

const deferredPrompt = ref(null);
const showInstallBanner = ref(false);
const showIosGuide = ref(false);
const showChromeBanner = ref(false);

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
const isAndroid = () => /android/i.test(navigator.userAgent);
const isChrome = () => /chrome|chromium|crios/i.test(navigator.userAgent) && !/edg|opr|samsungbrowser/i.test(navigator.userAgent);
const isPc = () => !isIos() && !isAndroid();
const isInStandaloneMode = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

const onBeforeInstallPrompt = (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallBanner.value = true;
};

const installPwa = async () => {
    if (!deferredPrompt.value) {
        showInstallBanner.value = false;
        showIosGuide.value = true;
        return;
    }
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    deferredPrompt.value = null;
    showInstallBanner.value = false;
};

const dismissBanner = () => {
    showInstallBanner.value = false;
};

const handleChromeClose = () => {
    showChromeBanner.value = false;
};

const handleIosGuideClose = () => {
    showIosGuide.value = false;
};

onMounted(() => {

    if (isInStandaloneMode()) {
        return;
    }
    if (localStorage.getItem(DISMISS_KEY)) {
        return;
    }
    if (isPc()) {
        return;
    }

    if (isIos()) {
        showIosGuide.value = true;
    } else if (isAndroid()) {
        if (isChrome()) {
            window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
            if (!deferredPrompt.value && !showInstallBanner.value) {
                showInstallBanner.value = true;
            }
        } else {
            showChromeBanner.value = true;
        }
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
});
</script>

<style lang="scss" scoped>
.pwa-install-banner {
    position: fixed;
    bottom: rem(80);
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - rem(32));
    max-width: rem(375);
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: rem(16);
    padding: rem(16);
    display: flex;
    align-items: center;
    gap: rem(12);
    z-index: 9996;
    box-shadow: 0 rem(10) rem(15) rgba(0, 0, 0, 0.06), 0 rem(4) rem(6) rgba(0, 0, 0, 0.04);

    .pwa-icon {
        width: rem(48);
        height: rem(48);
        border-radius: rem(10);
        flex-shrink: 0;
    }

    .pwa-info {
        flex: 1;
        min-width: 0;

        .pwa-name {
            font-size: rem(15);
            font-weight: 600;
            color: #0F172A;
        }

        .pwa-desc {
            font-size: rem(12);
            color: #475569;
            margin-top: rem(2);
        }
    }

    .pwa-actions {
        display: flex;
        align-items: center;
        gap: rem(8);
        flex-shrink: 0;
    }

    .pwa-btn-install {
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        color: #FFFFFF;
        border: none;
        border-radius: rem(10);
        padding: rem(8) rem(16);
        font-size: rem(14);
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s ease;

        &:active {
            opacity: 0.9;
        }
    }

    .pwa-btn-close {
        background: transparent;
        border: none;
        color: #94A3B8;
        font-size: rem(20);
        cursor: pointer;
        padding: rem(4);
        line-height: 1;
        transition: color 0.2s ease;

        &:hover {
            color: #475569;
        }
    }
}

.pwa-chrome-banner {
    border-color: #DBEAFE;
    background: #EFF6FF;

    .pwa-chrome-icon {
        flex-shrink: 0;
        width: rem(48);
        height: rem(48);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.ios-guide-popup {
    padding: rem(32) rem(24);
    background: #FFFFFF;

    .ios-guide-title {
        text-align: center;
        margin-bottom: rem(24);
        font-size: rem(18);
        font-weight: 600;
        color: #0F172A;
    }

    .ios-guide-steps {
        display: flex;
        flex-direction: column;
        gap: rem(16);
        margin-bottom: rem(28);
    }

    .ios-step {
        display: flex;
        align-items: center;
        gap: rem(12);
        color: #475569;
        font-size: rem(14);

        .ios-step-num {
            width: rem(28);
            height: rem(28);
            border-radius: 50%;
            background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
            color: #FFFFFF;
            font-weight: 600;
            font-size: rem(14);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .ios-share-icon {
            font-size: rem(18);
            color: #2563EB;
        }
    }

    .ios-guide-close {
        width: 100%;
        padding: rem(14);
        background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
        color: #FFFFFF;
        border: none;
        border-radius: rem(10);
        font-size: rem(15);
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s ease;

        &:active {
            opacity: 0.9;
        }
    }
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateX(-50%) translateY(rem(20));
    opacity: 0;
}
</style>
