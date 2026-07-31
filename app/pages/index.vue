<template>
    <div class="home">
        <header class="home-header">
            <img src="/brand/adsterra-logo.svg" alt="Adsterra" class="home-logo">
            <button type="button" class="home-service-btn" :aria-label="$lang('客服')" @click="navigateTo('/chat')">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 13a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M5 13h2.5v5H6.8A2.8 2.8 0 0 1 4 15.2v-.4A1.8 1.8 0 0 1 5 13ZM19 13h-2.5v5h.7a2.8 2.8 0 0 0 2.8-2.8v-.4A1.8 1.8 0 0 0 19 13Z"
                        stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                    <path d="M16 19c-.75 1.25-2.1 2-4 2" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" />
                </svg>
            </button>
        </header>

        <section class="adsterra-hero">
            <button type="button" class="home-balance-card" :aria-label="$lang('余额')" @click="handleGetBalance">
                <span class="home-balance-copy">
                    <span>{{ $lang('余额') }}</span>
                    <strong translate="no">Rs {{ formatMoney(availableBalance) }}</strong>
                </span>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M20 12a8 8 0 0 1-13.7 5.6M4 12A8 8 0 0 1 17.7 6.4" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" />
                    <path d="M18 3v4h-4M6 21v-4h4" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>

            <div class="ad-network-content">
                <h2>{{ $lang('值得信赖的广告网络') }}</h2>
                <h3>{{ $lang('与可靠的合作伙伴共赢增长，带来看得见的收益') }}</h3>
                <p>{{ $lang('购买全球广告流量，精准触达来自巴基斯坦、印度、印尼、菲律宾、孟加拉国、巴西、墨西哥、美国等248地区的线上目标人群') }}</p>
            </div>

            <div class="home-action-grid">
                <button v-for="item in actionItems" :key="item.label" class="home-action" :class="item.className"
                    @click="navigateTo(item.path)">
                    <svg viewBox="0 0 24 24" fill="none" v-html="item.icon"></svg>
                    <span>{{ item.label }}</span>
                </button>
            </div>
        </section>

        <main class="adsterra-source-sections">
            <section class="source-video">
                <img :src="adsterraAssets.video" alt="">
            </section>

            <section class="source-awards" aria-label="Adsterra awards">
                <div class="source-award-text">Top Ad<br>Network</div>
                <img :src="adsterraAssets.award" alt="Top Traffic Source 2023">
                <div class="source-award-text">Top Traffic<br>Source</div>
            </section>

            <section class="source-benefits">
                <h2>{{ $lang('Adsterra 助力合作伙伴实现长期收益增长') }}</h2>
                <div ref="benefitsTrack" class="source-benefit-track" @scroll="handleBenefitScroll">
                    <article v-for="item in benefitItems" :key="item.title" class="source-benefit-card">
                        <div class="source-benefit-icon">
                            <svg viewBox="0 0 24 24" fill="none" v-html="item.icon"></svg>
                        </div>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.desc }}</p>
                    </article>
                </div>
                <div class="source-dots" aria-label="Benefits carousel pagination">
                    <button v-for="(_, index) in benefitItems" :key="index" type="button"
                        :class="{ 'is-active': activeBenefitIndex === index }"
                        :aria-label="`${$lang('跳转')} ${index + 1}`"
                        @click="scrollBenefitTo(index)"></button>
                </div>
            </section>

            <section class="source-mediakit">
                <img :src="adsterraAssets.mediaKit" alt="" class="source-mediakit-img">
                <h2>{{ $lang('查看资料包，获取更多信息。') }}</h2>
                <div class="source-link-actions">
                    <a @click="navigateTo('./chat')" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 4v10" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" />
                            <path d="m8 10 4 4 4-4" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M5 19h14" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" />
                        </svg>
                        {{ $lang('广告主') }}
                    </a>
                    <a @click="navigateTo('./chat')"target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 4v10" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" />
                            <path d="m8 10 4 4 4-4" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M5 19h14" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" />
                        </svg>
                        {{ $lang('发布商') }}
                    </a>
                </div>
            </section>
        </main>

        <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="handleLangChange" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#imports'
import LangModal from '~/components/LangModal.vue'
import { getBalance } from '~/api/member'
import { storage } from '~/utils'

const currentLang = ref(storage.get('locale') || 'pt')
const showLang = ref(false)
const withdrawalOrderCacheKey = 'withdrawal_orders'
const balance = ref(0)
const cachedWithdrawalOrders = ref([])
const handleLangChange = (lang) => {
    if (currentLang.value == lang) return;
    storage.set('locale', lang)
    currentLang.value = lang
    location.reload()
}

definePageMeta({
    layout: 'default',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

onMounted(() => {
    refreshWithdrawalOrders()
    handleGetBalance()
})

const safeNumber = (value) => {
    const number = Number.parseFloat(value)
    return Number.isFinite(number) ? number : 0
}

const formatMoney = (value) => {
    return safeNumber(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const pendingWithdrawalAmount = computed(() => {
    return cachedWithdrawalOrders.value
        .filter(order => order.status === 'processing')
        .reduce((total, order) => total + safeNumber(order.amount), 0)
})

const availableBalance = computed(() => {
    return Math.max(balance.value - pendingWithdrawalAmount.value, 0)
})

const refreshWithdrawalOrders = () => {
    try {
        const cache = storage.get(withdrawalOrderCacheKey)
        const orders = cache ? JSON.parse(cache) : []
        cachedWithdrawalOrders.value = Array.isArray(orders) ? orders : []
    } catch (_error) {
        cachedWithdrawalOrders.value = []
    }
}

const handleGetBalance = () => {
    refreshWithdrawalOrders()
    getBalance({}).then(res => {
        if (res.success) {
            balance.value = safeNumber(res.data.amount)
        } else {
            showMsg(res.message, 'fail')
        }
    }).catch(error => {
        showMsg(error.message, 'fail')
    })
}

const adsterraAssets = {
    video: '/brand/336081.png',
    videoPoster: '/brand/adsterra-landing-video-poster.webp',
    award: '/brand/adsterra-award-top-traffic.png',
    mediaKit: '/brand/adsterra-mediakit.webp',
}


const actionItems = [
    {
        label: $lang('充值'),
        className: 'home-action--recharge',
        icon: '<path d="M12 3v12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M7.5 8.5 12 3l4.5 5.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15.5v3.2A2.3 2.3 0 0 0 7.3 21h9.4a2.3 2.3 0 0 0 2.3-2.3v-3.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
        path: '/profile/recharge'
    },
    {
        label: $lang('提现'),
        className: 'home-action--withdraw',
        icon: '<path d="M12 21V9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M16.5 15.5 12 21l-4.5-5.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 8.5V5.3A2.3 2.3 0 0 1 7.3 3h9.4A2.3 2.3 0 0 1 19 5.3v3.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
        path: '/profile/withdrawal'
    },
    {
        label: $lang('成为广告主'),
        className: 'home-action--advertiser',
        icon: '<path d="M4 13.5h3l8 4.5V6L7 10.5H4a2 2 0 0 0-2 2v-1a2 2 0 0 0 2 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 13.5 8.5 20h3L10 15.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M19 9.5c1.1.7 1.8 1.6 1.8 2.5S20.1 13.8 19 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
        path: '/chat'
    },
]

const benefitItems = [
    {
        title: $lang('稳定且高质量的流量'),
        desc: $lang('依托全球直接优质媒体，提供规模化、真实有效的高质量流量'),
        icon: '<path d="M4 17 9 12l3 3 8-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 21h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'
    },
    {
        title: $lang('成本优化'),
        desc: $lang('强大的流量筛选工具和智能设置，精准控制广告成本，锁定高效流量'),
        icon: '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/><path d="M12 7v10M9 10.2c.5-.8 1.5-1.2 3-1.2 1.7 0 3 .8 3 2s-1.3 2-3 2-3 .8-3 2 1.3 2 3 2c1.4 0 2.4-.4 3-1.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
    },
    {
        title: $lang('广告与流量安全'),
        desc: $lang('独家三重安全防护系统，有效防御欺诈与恶意软件'),
        icon: '<path d="M12 3 20 6.5v5.8c0 4.6-3.2 7.5-8 8.7-4.8-1.2-8-4.1-8-8.7V6.5L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8.5 12 2.3 2.3 4.8-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    },
    {
        title: $lang('透明且高比例的结算率'),
        desc: $lang('36,000+ 优质发布商持续变现，受益于极具竞争力的 CPM 价格'),
        icon: '<path d="M5 19V5h14v14H5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 15v-4M12 15V8M15.5 15v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    },
    {
        title: $lang('用户友好的广告格式'),
        desc: $lang('针对移动操作系统优化的高性能广告，100%提供相关广告的推送'),
        icon: '<rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" stroke-width="2"/><path d="M10 17h4M10 7h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    },
    {
        title: $lang('尊享支持'),
        desc: $lang('独特的 Partner Care Program (合作伙伴关怀计划) 包含专业的多语言支持。'),
        icon: '<path d="M4 13a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 13h2v5H6a2 2 0 0 1-2-2v-1a2 2 0 0 1 1-2ZM19 13h-2v5h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-1-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 19c-.7 1.2-2 2-4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    },
]

const benefitsTrack = ref(null)
const activeBenefitIndex = ref(0)

const getCarouselIndex = (element) => {
    const firstItem = element?.children?.[0]
    if (!element || !firstItem) return 0
    const secondItem = element.children[1]
    const slideStep = secondItem ? secondItem.offsetLeft - firstItem.offsetLeft : firstItem.offsetWidth
    if (!slideStep) return 0
    return Math.round(element.scrollLeft / slideStep)
}

const handleBenefitScroll = (event) => {
    activeBenefitIndex.value = getCarouselIndex(event.currentTarget)
}

const scrollBenefitTo = (index) => {
    const element = benefitsTrack.value
    const target = element?.children?.[index]
    if (!element || !target) return
    element.scrollTo({
        left: target.offsetLeft - element.offsetLeft,
        behavior: 'smooth'
    })
    activeBenefitIndex.value = index
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/config' as *;

.home {
    background: #F5F6F8;
    min-height: 100dvh;
    padding-bottom: rem(80);
}

.home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: rem(62);
    padding: 0 rem(22);
    background: $color-white;
    border-bottom: 1px solid rgba(22, 24, 30, 0.06);
}

.home-logo {
    width: rem(150);
    height: auto;
}

.home-service-btn {
    width: rem(40);
    height: rem(40);
    border-radius: 50%;
    background: #FFF1F1;
    color: $color-primary;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.18s ease, transform 0.18s ease;

    svg {
        width: rem(22);
        height: rem(22);
    }

    &:active {
        transform: scale(0.96);
        background: #FFE4E4;
    }
}

.adsterra-hero {
    position: relative;
    padding: rem(72) rem(22) rem(32);
    background: linear-gradient(180deg, #F7BFC2 0%, #FBE3E4 100%);
    overflow: hidden;
}

.home-balance-card {
    position: absolute;
    top: rem(14);
    right: rem(16);
    z-index: 2;
    min-width: rem(112);
    min-height: rem(40);
    padding: rem(7) rem(8) rem(7) rem(10);
    border-radius: rem(999);
    background: $color-white;
    border: 1px solid rgba(206, 0, 0, 0.14);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(7);
    color: $color-primary;
    box-shadow: 0 rem(8) rem(18) rgba(113, 32, 32, 0.08);
    cursor: pointer;

    > svg {
        width: rem(14);
        height: rem(14);
        flex: none;
    }
}

.home-balance-copy {
    min-width: 0;
    text-align: left;

    span {
        display: block;
        margin-bottom: rem(2);
        color: $color-text-muted;
        font-size: rem(9);
        line-height: 1;
        font-weight: 750;
    }

    strong {
        display: block;
        color: $color-primary;
        font-size: rem(13);
        line-height: 1.1;
        font-weight: 900;
        white-space: nowrap;
    }
}

.ad-network-content {
    position: relative;
    z-index: 1;
    text-align: center;

    h2 {
        margin: 0 auto rem(12);
        max-width: rem(310);
        color: $color-text-primary;
        font-size: rem(28);
        line-height: 1.18;
        font-weight: 900;
    }

    h3 {
        margin: 0 auto rem(12);
        max-width: rem(300);
        color: $color-text-primary;
        font-size: rem(17);
        line-height: 1.45;
        font-weight: 850;
    }

    p {
        margin: 0 auto;
        max-width: rem(320);
        color: rgba(49, 55, 65, 0.9);
        font-size: rem(14);
        line-height: 1.65;
    }
}

.home-action-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: rem(8);
    margin: rem(20) auto 0;
    max-width: rem(276);
}

.home-action {
    min-height: rem(42);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: rem(8);
    border-radius: rem(4);
    background: $color-white;
    color: $color-primary;
    font-size: rem(14);
    font-weight: 800;
    box-shadow: 0 rem(10) rem(22) rgba(113, 32, 32, 0.08);

    svg {
        width: rem(19);
        height: rem(19);
    }

    &--advertiser {
        background: #2F2F2F;
        color: $color-white;
    }
}

.adsterra-source-sections {
    background: $color-white;
    padding: 0 0 rem(24);
}

.source-video {
    padding: 0 rem(11) rem(92);
    background: linear-gradient(180deg, #F8D6D8 0%, #FFFFFF 46%);

    video {
        width: 100%;
        aspect-ratio: 16 / 9;
        display: block;
        border-radius: rem(6);
        background: $color-black;
        object-fit: cover;
    }
}

.source-awards {
    display: grid;
    grid-template-columns: 1fr rem(72) 1fr;
    align-items: center;
    gap: rem(18);
    margin: 0 rem(25) rem(30);
    text-align: center;
}

.source-awards img {
    width: rem(72);
    height: rem(72);
    object-fit: contain;
}

.source-award-text {
    color: rgba(51, 51, 51, 0.38);
    font-size: rem(15);
    line-height: 1.35;
    font-weight: 600;
}

.source-benefits {
    margin-bottom: rem(36);

    h2 {
        margin: 0 auto rem(14);
        max-width: rem(270);
        text-align: center;
        color: $color-text-primary;
        font-size: rem(23);
        line-height: 1.2;
        font-weight: 900;
    }
}

.source-benefit-track {
    display: flex;
    gap: rem(10);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 0 rem(22) rem(20);
}

.source-benefit-card {
    flex: 0 0 rem(323);
    min-height: rem(204);
    scroll-snap-align: start;
    padding: rem(20) rem(17);
    border-radius: rem(8);
    background: #FAFAFA;

    h3 {
        margin: 0 0 rem(8);
        color: $color-text-primary;
        font-size: rem(18);
        line-height: 1.35;
        font-weight: 900;
    }

    p {
        margin: 0;
        color: $color-text-secondary;
        font-size: rem(15);
        line-height: 1.55;
    }
}

.source-benefit-icon {
    width: rem(38);
    height: rem(38);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: rem(28);
    border-radius: rem(8);
    background: $color-primary;
    color: $color-white;

    svg {
        width: rem(22);
        height: rem(22);
    }
}

.source-mediakit {
    margin: 0 rem(39) rem(42);
    min-height: rem(248);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: rem(24);
    background: $color-primary;
    color: $color-white;
    text-align: center;
}

.source-mediakit-img {
    width: rem(88);
    height: rem(82);
    object-fit: contain;
    margin-bottom: rem(13);
}

.source-mediakit h2 {
    margin: 0;
    font-size: rem(18);
    line-height: 1.35;
    font-weight: 900;
}

.source-link-actions {
    display: flex;
    justify-content: center;
    gap: rem(12);
    margin-top: rem(14);

    a {
        min-width: rem(80);
        min-height: rem(45);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: rem(5);
        padding: 0 rem(12);
        border-radius: rem(4);
        background: #303030;
        color: $color-white;
        font-size: rem(14);
        font-weight: 750;
        white-space: nowrap;

        svg {
            width: rem(14);
            height: rem(14);
        }
    }
}

.source-dots {
    display: flex;
    justify-content: center;
    gap: rem(9);

    button {
        width: rem(9);
        height: rem(9);
        border-radius: 50%;
        background: #D4D4D4;

        &.is-active {
            background: #777777;
        }
    }
}

@media (max-width: 374px) {
    .home-header {
        padding-inline: rem(18);
    }

    .home-logo {
        width: rem(142);
    }

    .adsterra-hero {
        padding-inline: rem(18);
    }

    .ad-network-content h2 {
        font-size: rem(25);
    }

    .source-benefit-card {
        flex-basis: rem(304);
    }

}
</style>
