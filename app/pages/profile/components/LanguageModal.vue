<template>
    <van-popup v-model:show="visible" position="center"
               :style="{ borderRadius: '16px', width: '90%', maxWidth: '360px' }">
        <div class="modal modal--sm">
            <div class="modal-header">
                <span class="modal-title">选择语言</span>
                <button class="modal-close" @click="close" aria-label="关闭">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <button
                        v-for="lang in languages"
                        :key="lang.code"
                        class="lang-btn"
                        :class="{ active: currentLang === lang.code }"
                        @click="selectLang(lang.code)"
                >
                    <span class="lang-flag">{{ lang.flag }}</span>
                    <span class="lang-name">{{ lang.name }}</span>
                    <svg v-if="currentLang === lang.code" class="lang-check" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#D97706" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
    import {ref, watch} from 'vue'

    const props = defineProps({
        modelValue: {
            type: Boolean,
            default: false
        },
        currentLang: {
            type: String,
            default: 'zh'
        }
    })

    const emit = defineEmits(['update:modelValue', 'update:currentLang', 'change'])

    const visible = ref(props.modelValue)

    const languages = [
        {code: 'zh', name: '中文', flag: '🇨🇳'},
        {code: 'en', name: 'English', flag: '🇺🇸'},
        {code: 'es', name: 'Español', flag: '🇪🇸'},
    ]

    watch(() => props.modelValue, (val) => {
        visible.value = val
    })

    watch(visible, (val) => {
        emit('update:modelValue', val)
    })

    const close = () => {
        visible.value = false
    }

    const selectLang = (code) => {
        emit('update:currentLang', code)
        emit('change', code)
        close()
    }
</script>

<style scoped lang="scss">
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

    .lang-flag {
        font-size: rem(22);
        line-height: 1;
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
