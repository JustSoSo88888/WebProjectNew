<template>
  <van-popup v-model:show="visible" position="center" :style="{ borderRadius: '16px', width: '90%', maxWidth: '320px' }">
    <div class="modal modal--sm">
      <div class="modal-body modal-body--center">
        <div class="logout-icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="logout-title">确认退出登录？</div>
        <div class="logout-desc">退出后需要重新登录才能使用</div>
        <div class="logout-actions">
          <button class="logout-cancel" @click="close">取消</button>
          <button class="logout-confirm" @click="confirm">退出</button>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
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

const confirm = () => {
  emit('confirm')
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

.modal-body--center {
  text-align: center;
  padding: rem(24) rem(16);
}

.logout-icon {
  width: rem(56);
  height: rem(56);
  border-radius: 50%;
  background: $color-danger-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto rem(12);

  svg { width: rem(26); height: rem(26); }
}

.logout-title {
  font-size: rem(16);
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: rem(6);
}

.logout-desc {
  font-size: rem(13);
  color: $color-text-muted;
  margin-bottom: rem(20);
}

.logout-actions {
  display: flex;
  gap: rem(10);
}

.logout-cancel,
.logout-confirm {
  flex: 1;
  padding: rem(12) 0;
  border-radius: $radius-md;
  font-size: rem(14);
  font-weight: 500;
  cursor: pointer;
  transition: $transition-fast;
}

.logout-cancel {
  background: $color-bg-page;
  color: $color-text-secondary;
  border: rem(1) solid $color-border;
}

.logout-confirm {
  background: $color-danger;
  color: #fff;
}
</style>
