<template>
    <van-popup v-model:show="visible" position="center" class="lang-popup">
        <div class="modal modal--sm">
            <div class="modal-header">
                <span class="modal-title">{{ $lang('选择语言') }}</span>
                <button class="modal-close" @click="close" aria-label="关闭">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <button v-for="lang in langList" :key="lang.id" class="lang-btn"
                    :class="{ active: currentLang === lang.id }" @click="selectLang(lang.id)">
                    <img v-if="lang.icon" :src="lang.icon" class="lang-icon" />
                    <span class="lang-name">{{ lang.label }}</span>
                    <svg v-if="currentLang === lang.id" class="lang-check" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#D97706" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAppStore } from '~/stores/app.js'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    currentLang: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

const appStore = useAppStore()
const langList = computed(() => appStore.getLangList)

const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    visible.value = val
})

watch(visible, (val) => {
    emit('update:modelValue', val)
})

const close = () => {
    visible.value = false
}

const selectLang = (id) => {
    emit('change', id)
    close()
}
</script>

<style scoped lang="scss">
.lang-popup {
    border-radius: rem(15);
    width: rem(300);
}

.modal {
    width: 100%;
    background: #fff;
    overflow: hidden;
    max-height: 90vh;
}

.modal--sm {
    border-radius: $radius-xl;
    width: 100%;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(16);
    border-bottom: rem(1) solid $color-border-light;
}

.modal-title {
    font-size: rem(16);
    font-weight: 600;
    color: $color-text-primary;
}

.modal-close {
    width: rem(32);
    height: rem(32);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: $color-bg-page;
    color: $color-text-secondary;
    cursor: pointer;
    border: none;

    svg {
        width: rem(16);
        height: rem(16);
    }
}

.modal-body {
    padding: rem(8);
}

.lang-btn {
    display: flex;
    align-items: center;
    gap: rem(12);
    width: 100%;
    padding: rem(14) rem(16);
    border-bottom: rem(1) solid $color-border-light;
    cursor: pointer;
    transition: background 0.15s;
    border-radius: $radius-sm;
    background: transparent;

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background: $color-bg-hover;
    }

    &.active .lang-name {
        color: $color-primary;
        font-weight: 600;
    }
}

.lang-icon {
    width: rem(22);
    height: rem(22);
    object-fit: contain;
}

.lang-name {
    flex: 1;
    font-size: rem(14);
    color: $color-text-primary;
    text-align: left;
}

.lang-check {
    width: rem(18);
    height: rem(18);
}
</style>
