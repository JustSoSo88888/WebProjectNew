<template>
    <div class="notice-section" v-if="list.length">
        <div class="notice-icon">
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
        <div class="notice-marquee">
            <div class="notice-track" :style="{ animationDuration: (list.length / 2 * 10) + 's' }">
                <template v-for="(item, index) in list" :key="index">
                    <span class="notice-item">
                        {{ replaceMap($lang('****9000邀请3级新用户佣金：100 ABCD'), {
                            "****9000": String(item.phone).slice(0, 2) + '***' + String(item.phone).slice(-2),
                            "3": item.level,
                            "100": item.amount
                        }) }}
                    </span>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const replaceMap = (str, map) => {
    Object.keys(map).forEach(key => {
        str = str.replaceAll(key, map[key])
    })
    return str
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/config' as *;

.notice-section {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.75);
    border-radius: $radius-lg;
    padding: rem(5) rem(10);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    overflow: hidden;
    backdrop-filter: blur(12px);
}

.notice-icon {
    flex-shrink: 0;
    width: rem(18);
    height: rem(18);
    color: #000;
    margin-right: rem(10);
    z-index: 1;

    svg {
        width: 100%;
        height: 100%;
    }
}

.notice-marquee {
    flex: 1;
    overflow: hidden;
    position: relative;
}

.notice-track {
    display: flex;
    width: max-content;
    animation: marquee 20s linear infinite;
}

.notice-item {
    display: flex;
    align-items: center;
    padding: rem(4) rem(20) rem(4) 0;
    font-size: rem(12);
    white-space: nowrap;
}

.notice-phone {
    font-weight: 600;
    margin-right: rem(5);
}

.notice-text {
    color: #374151;
}

.notice-amount {
    font-weight: 700;
}

@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}
</style>
