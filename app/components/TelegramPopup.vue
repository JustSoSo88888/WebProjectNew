<template>
  <van-popup v-model:show="visible" position="center" round class="telegram-popup">
    <div class="telegram-modal">
      <div class="telegram-title">{{ $lang('Telegram客服') }}</div>
      <div class="telegram-content">
        <div class="telegram-url">{{ telegramUrl }}</div>
      </div>
      <div class="telegram-actions">
        <button class="telegram-btn telegram-btn--cancel" @click="close">{{ $lang('取消') }}</button>
        <button v-if="telegramUrl" class="telegram-btn telegram-btn--confirm" @click="handleConfirm">{{ $lang('跳转') }}</button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, watch } from 'vue'
const nuxtApp = useNuxtApp()
const appStore = useAppStore()
const $lang = nuxtApp.$lang

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  telegramUrl: {
    type: String,
    default: ''
  },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

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

const handleConfirm = () => {
  emit('confirm')
  if (props.telegramUrl) {
    window.open(props.telegramUrl, '_blank')
  }
}
</script>

<style scoped lang="scss">
.telegram-popup {
  border-radius: rem(16);
  width: rem(320);
}

.telegram-modal {
  background: #fff;
  border-radius: rem(16);
  padding: rem(24);
}

.telegram-title {
  font-size: rem(18);
  font-weight: 600;
  color: #1F2937;
  text-align: center;
  margin-bottom: rem(16);
}

.telegram-content {
  margin-bottom: rem(20);
}

.telegram-url {
  padding: rem(12);
  background: #F3F4F6;
  border-radius: rem(8);
  text-align: center;
  word-break: break-all;
  color: $color-primary;
  font-size: rem(14);
}

.telegram-no-url {
  text-align: center;
  color: #9CA3AF;
  font-size: rem(14);
}

.telegram-actions {
  display: flex;
  gap: rem(12);
}

.telegram-btn {
  flex: 1;
  height: rem(44);
  border: none;
  border-radius: rem(10);
  font-size: rem(15);
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.98);
  }

  &--cancel {
    background: #F3F4F6;
    color: #6B7280;
  }

  &--confirm {
    background: $color-primary;
    color: #fff;
  }
}
</style>