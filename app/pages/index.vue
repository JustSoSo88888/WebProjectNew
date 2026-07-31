<template>
    <div class="home">
        <header class="home-header">
            <img src="/brand/adsterra-logo.svg" alt="Adsterra" class="home-logo">
            <ConnectionStatus></ConnectionStatus>
        </header>

        <section class="adsterra-hero">
            <div class="ad-network-content">
                <h2>{{ $lang('值得信赖的广告网络') }}</h2>
                <h3>{{ $lang('与可靠的合作伙伴共赢增长，带来看得见的收益') }}</h3>
                <p>{{ $lang('购买全球广告流量，精准触达来自中国、印度、印尼、菲律宾、孟加拉国、巴西、墨西哥、美国等248地区的线上目标人群') }}</p>
            </div>

            <div class="home-action-grid">
                <button v-for="item in actionItems" :key="item.label" class="home-action" :class="item.className"
                    @click="navigateTo(item.path)">
                    <svg viewBox="0 0 24 24" fill="none" v-html="item.icon"></svg>
                    <span>{{ item.label }}</span>
                </button>
            </div>
        </section>

        <section class="benefits-section">
            <h2>{{ $lang('Adsterra 助力合作伙伴实现长期收益增长') }}</h2>
            <div class="benefits-list">
                <article v-for="item in benefitItems" :key="item.title" class="benefit-card">
                    <div class="benefit-icon">
                        <svg viewBox="0 0 24 24" fill="none" v-html="item.icon"></svg>
                    </div>
                    <div>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.desc }}</p>
                    </div>
                </article>
            </div>
        </section>

        <LangModal v-model="showLang" v-model:currentLang="currentLang" @change="handleLangChange" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { navigateTo } from '#imports'
import LangModal from '~/components/LangModal.vue'
import { storage } from '~/utils'

const currentLang = ref(storage.get('locale') || 'pt')
const showLang = ref(false)
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
        desc: $lang('优质发布商持续变现，受益于极具竞争力的 CPM 价格'),
        icon: '<path d="M5 19V5h14v14H5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 15v-4M12 15V8M15.5 15v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    },
    {
        title: $lang('用户友好的广告格式'),
        desc: $lang('针对移动操作系统优化的高性能广告，持续提供相关广告推送'),
        icon: '<rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" stroke-width="2"/><path d="M10 17h4M10 7h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    },
    {
        title: $lang('尊享支持'),
        desc: $lang('合作伙伴关怀计划包含专业的多语言支持'),
        icon: '<path d="M4 13a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 13h2v5H6a2 2 0 0 1-2-2v-1a2 2 0 0 1 1-2ZM19 13h-2v5h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-1-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 19c-.7 1.2-2 2-4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    },
]

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

.home-menu {
    width: rem(44);
    height: rem(44);
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-primary;

    svg {
        width: rem(28);
        height: rem(28);
    }
}

.adsterra-hero {
    position: relative;
    padding: rem(48) rem(22) rem(32);
    background: linear-gradient(180deg, #F7BFC2 0%, #FBE3E4 100%);
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        right: rem(-72);
        top: rem(22);
        width: rem(210);
        height: rem(210);
        border: 1px solid rgba(206, 0, 0, 0.14);
        border-radius: 50%;
    }

    &::after {
        content: '';
        position: absolute;
        right: rem(42);
        top: rem(118);
        width: rem(8);
        height: rem(8);
        border-radius: 999px;
        background: $color-primary;
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

.benefits-section {
    position: relative;
    margin: rem(18) rem(16) rem(20);

    > h2 {
        margin: 0 0 rem(12);
        color: $color-text-primary;
        font-size: rem(20);
        line-height: 1.35;
        font-weight: 900;
    }
}

.benefits-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: rem(10);
}

.benefit-card {
    display: grid;
    grid-template-columns: rem(44) minmax(0, 1fr);
    gap: rem(12);
    align-items: flex-start;
    padding: rem(14);
    border-radius: rem(8);
    background: $color-white;
    border: 1px solid rgba(22, 24, 30, 0.07);
    box-shadow: 0 rem(10) rem(22) rgba(22, 24, 30, 0.06);
}

.benefit-icon {
    width: rem(44);
    height: rem(44);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: rem(10);
    background: $color-primary;
    color: $color-white;
    box-shadow: 0 rem(8) rem(18) rgba(206, 0, 0, 0.22);

    svg {
        width: rem(24);
        height: rem(24);
    }
}

.benefit-card {
    h3 {
        margin: 0 0 rem(4);
        color: $color-text-primary;
        font-size: rem(14);
        line-height: 1.35;
        font-weight: 800;
    }

    p {
        margin: 0;
        color: $color-text-secondary;
        font-size: rem(12);
        line-height: 1.55;
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
}
</style>
