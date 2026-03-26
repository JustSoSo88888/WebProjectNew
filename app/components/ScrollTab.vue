<template>
    <div class="scroll-tab" ref="tabBar" :class="{ 'scroll-tab--fit': isFit }">
        <button
            v-for="(tab, index) in tabs"
            :key="index"
            class="scroll-tab__item"
            :class="{ 'scroll-tab__item--active': modelValue === index }"
            @click="onTabClick(index)"
        >
            {{ tab.label }}
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

defineOptions({ name: 'ScrollTab' })

const props = defineProps({
    tabs: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: Number,
        default: 0,
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

const tabBar = ref(null)
const isFit = ref(false)
let _resizeObserver = null

const checkFit = () => {
    const bar = tabBar.value
    if (!bar) return
    isFit.value = false
    nextTick(() => {
        isFit.value = bar.scrollWidth <= bar.clientWidth
    })
}

const onTabClick = (index) => {
    if (props.modelValue === index) return
    emit('update:modelValue', index)
    emit('change', index)
    nextTick(() => scrollTabIntoView(index))
}

const scrollTabIntoView = (index) => {
    const bar = tabBar.value
    const items = bar?.querySelectorAll('.scroll-tab__item')
    const el = items?.[index]
    if (!bar || !el) return
    const offset = bar.scrollLeft + (el.getBoundingClientRect().left - bar.getBoundingClientRect().left) - 16
    bar.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' })
}

const initDragScroll = () => {
    const bar = tabBar.value
    if (!bar) return
    let isDown = false
    let startX = 0
    let scrollLeft = 0
    let hasDragged = false

    const onMouseDown = (e) => {
        isDown = true
        hasDragged = false
        startX = e.pageX - bar.offsetLeft
        scrollLeft = bar.scrollLeft
    }
    const onMouseLeave = () => { isDown = false }
    const onMouseUp = () => { isDown = false }
    const onMouseMove = (e) => {
        if (!isDown) return
        const x = e.pageX - bar.offsetLeft
        if (Math.abs(x - startX) > 5) {
            hasDragged = true
            e.preventDefault()
            bar.scrollLeft = scrollLeft - (x - startX)
        }
    }
    const onClick = (e) => {
        if (hasDragged) {
            e.stopPropagation()
            hasDragged = false
        }
    }

    bar.addEventListener('mousedown', onMouseDown)
    bar.addEventListener('mouseleave', onMouseLeave)
    bar.addEventListener('mouseup', onMouseUp)
    bar.addEventListener('mousemove', onMouseMove)
    bar.addEventListener('click', onClick, true)

    return () => {
        bar.removeEventListener('mousedown', onMouseDown)
        bar.removeEventListener('mouseleave', onMouseLeave)
        bar.removeEventListener('mouseup', onMouseUp)
        bar.removeEventListener('mousemove', onMouseMove)
        bar.removeEventListener('click', onClick, true)
    }
}

let cleanupDrag = null

onMounted(() => {
    checkFit()
    cleanupDrag = initDragScroll()
    _resizeObserver = new ResizeObserver(() => checkFit())
    _resizeObserver.observe(tabBar.value)
})

onBeforeUnmount(() => {
    if (_resizeObserver) _resizeObserver.disconnect()
    if (cleanupDrag) cleanupDrag()
})
</script>

<style lang="scss" scoped>
.scroll-tab {
    display: flex;
    background: #FFFFFF;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    padding: rem(4);
    gap: rem(4);
    box-shadow: $shadow-xs;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    user-select: none;

    &::-webkit-scrollbar {
        display: none;
    }

    &--fit {
        .scroll-tab__item {
            flex: 1;
        }
    }

    &__item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: rem(38);
        border: none;
        border-radius: $radius-md;
        background: transparent;
        font-size: rem(13);
        font-weight: 600;
        color: $color-text-muted;
        cursor: pointer;
        transition: $transition-fast;
        white-space: nowrap;
        padding: 0 rem(20);
        box-sizing: border-box;

        &:active {
            background: $color-bg-hover;
        }

        &--active {
            background: $gradient-primary;
            color: #fff;
            box-shadow: $shadow-blue;

            &:active {
                background: $gradient-primary;
            }
        }
    }
}
</style>
