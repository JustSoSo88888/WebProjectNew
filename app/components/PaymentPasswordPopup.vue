<template>
  <van-popup v-model:show="popupShow" overlay-class="popup-bottom" class="popup-bottom" @closed="resetForm" position="bottom">
    <div class="payment-password-popup">
      <div class="popup-header">
        <div class="popup-title">{{ $lang('交易密码') }}</div>
      </div>

      <!-- Password Input -->
      <div class="password-group">
        <div class="password-inputs">
          <input v-for="(_, index) in 6" :key="index" :ref="el => setPasswordRef(el, index)" type="tel" maxlength="1"
            inputmode="numeric" pattern="[0-9]*" class="password-digit"
            :class="{ active: password[index], filled: password[index] }" @input="onPasswordInput(index)"
            @keydown="onPasswordKeydown($event, index)" @focus="onPasswordFocus(index)" />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="popup-footer">
        <button class="submit-btn" :disabled="!canSubmit" @click="handleSubmit">
          {{ $lang('确认') }}
        </button>
        <button class="cancel-btn" @click="handleCancel">
          {{ $lang('取消') }}
        </button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { useNuxtApp } from '#imports'

const { $lang } = useNuxtApp()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// Internal state
const popupShow = ref(false)

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  popupShow.value = newVal
})

watch(() => popupShow.value, (newVal) => {
  console.log('123213213');

})

// Password fields
const password = ref(['', '', '', '', '', ''])
let passwordInputs = []

// Computed properties
const passwordStr = computed(() => password.value.join(''))
const canSubmit = computed(() => {
  return passwordStr.value.length === 6
})

// Reference setters
const setPasswordRef = (el, index) => {
  if (el) passwordInputs[index] = el
}

// Input handlers
const onPasswordInput = (index) => {
  const input = passwordInputs[index]
  const value = input.value.replace(/\D/g, '')
  input.value = value

  if (value) {
    password.value[index] = value
    if (index < 5) {
      passwordInputs[index + 1].focus()
    }
  }
}

const onPasswordKeydown = (event, index) => {
  if (event.key === 'Backspace') {
    if (!password.value[index] && index > 0) {
      passwordInputs[index - 1].focus()
    }
    password.value[index] = ''
  }
}

const onPasswordFocus = (index) => {
  for (let i = 0; i < index; i++) {
    if (!password.value[i]) {
      passwordInputs[i].focus()
      return
    }
  }
}

// Event handlers
const handleSubmit = () => {
  if (!canSubmit.value) {
    showToast($lang('请输入6位支付密码'))
    return
  }

  // Emit the password value
  emit('confirm', passwordStr.value)

  // Reset form
  resetForm()
}

const handleCancel = () => {
  emit('cancel')
  resetForm()
}

const resetForm = () => {
  password.value = ['', '', '', '', '', '']
  // Clear input fields
  passwordInputs.forEach(input => {
    if (input) input.value = ''
  })
  // Hide popup
  popupShow.value = false
}
</script>

<style lang="scss" scoped>
.popup-bottom {
  width: rem(375);
  left: calc(50% - rem(187.5));
}

.payment-password-popup {
  border-top-left-radius: $radius-lg;
  border-top-right-radius: $radius-lg;
  background: #fff;
  padding: rem(24) rem(16);
}

.popup-header {
  text-align: center;
  margin-bottom: rem(24);
}

.popup-title {
  font-size: rem(18);
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: rem(6);
}

.popup-desc {
  font-size: rem(13);
  color: $color-text-muted;
}

.password-group {
  margin-bottom: rem(20);
}

.password-label {
  font-size: rem(13);
  font-weight: 500;
  color: $color-text-secondary;
  margin-bottom: rem(10);
}

.password-inputs {
  display: flex;
  gap: rem(8);
  justify-content: center;
}

.password-digit {
  width: rem(42);
  height: rem(48);
  border: 1px solid $color-border;
  border-radius: $radius-md;
  font-size: rem(18);
  font-weight: 600;
  text-align: center;
  color: $color-text-primary;
  background: $color-bg-page;
  transition: all 0.2s;

  &.active {
    border-color: $color-primary;
    background: #fff;
  }

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.1);
  }
}

.popup-footer {
  display: flex;
  gap: rem(12);
  margin-top: rem(16);
}

.submit-btn,
.cancel-btn {
  flex: 1;
  padding: rem(14) 0;
  border-radius: $radius-md;
  font-size: rem(15);
  font-weight: 600;
  transition: opacity 0.2s;
}

.submit-btn {
  background: $color-primary;
  color: #fff;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.cancel-btn {
  color: $color-text-secondary;
  background: $color-bg-page;
  border: 1px solid $color-border;

  &:active {
    opacity: 0.8;
  }
}
</style>