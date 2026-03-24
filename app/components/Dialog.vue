<template>
  <Teleport to="body">
      <Transition name="dialog-pop">
      <div v-if="modelValue" class="dialog-overlay" :class="{ 'overlay-clickable': clickCancel }" @click="clickCancel && close()">
        <div class="dialog-box" @click.stop>
          <div class="dialog-header" v-if="title">{{ title }}</div>
          <div class="dialog-body">
            <slot>{{ message }}</slot>
          </div>
          <div class="dialog-footer">
            <button v-if="showCancel" class="dialog-btn dialog-btn--cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button class="dialog-btn dialog-btn--confirm" @click="handleConfirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  clickCancel: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const close = () => {
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.overlay-clickable {
  cursor: pointer;
}

.dialog-box {
  width: 80%;
  max-width: rem(300);
  background: #fff;
  border-radius: rem(12);
  overflow: hidden;
}

.dialog-header {
  padding: rem(16) rem(16) rem(8);
  font-size: rem(16);
  font-weight: 600;
  color: $color-text-primary;
  text-align: center;
}

.dialog-body {
  padding: rem(8) rem(16) rem(16);
  font-size: rem(14);
  color: $color-text-secondary;
  text-align: center;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  border-top: rem(1) solid $color-border-light;
}

.dialog-btn {
  flex: 1;
  padding: rem(12) 0;
  font-size: rem(14);
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;

  &:active {
    background: $color-bg-hover;
  }

  &--cancel {
    color: $color-text-secondary;
    border-right: rem(1) solid $color-border-light;
  }

  &--confirm {
    color: $color-primary;
    font-weight: 600;
  }
}

.dialog-overlay {
  animation: overlay-fade-in 0.2s ease-out;
}

.dialog-box {
  animation: dialog-scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes dialog-scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dialog-pop-leave-active {
  animation: dialog-scale-out 0.2s ease-in;
}

@keyframes dialog-scale-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
