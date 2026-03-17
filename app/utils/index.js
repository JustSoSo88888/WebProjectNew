import config from '~/config/index.js'
import {
  showLoadingToast,
  closeToast,
  showToast as vantShowToast,
  showSuccessToast,
  showFailToast,
} from 'vant'

// 本地存储
export const storage = {
  set: (key, value) => {
    localStorage.setItem(`${config.projectName}_${key}`, value)
  },
  get: (key) => {
    const val = localStorage.getItem(`${config.projectName}_${key}`)
    return val ? val : null
  },
  remove: (key) => {
    localStorage.removeItem(`${config.projectName}_${key}`)
  },
  clear: () => {
    localStorage.clear()
  },
}

// 格式化日期
export const formatDate = (date, fmt = 'YYYY-MM-DD') => {
  const d = new Date(date)
  const map = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  }
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => map[key])
}

// 防抖
export const debounce = (fn, delay = 300) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// 节流
export const throttle = (fn, interval = 300) => {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }
}

// Vant Loading
export const showLoading = (message) => {
  message = message ?? $t('loading')
  showLoadingToast({
    message,
    forbidClick: true,
    duration: 0,
  })
}

export const hideLoading = () => {
  closeToast()
}

// Vant Toast 提示  type: 'text' | 'success' | 'fail'
export const showMsg = (message, type = 'text') => {
  if (type === 'success') {
    showSuccessToast(message)
  } else if (type === 'fail') {
    showFailToast(message)
  } else {
    vantShowToast(message)
  }
}
