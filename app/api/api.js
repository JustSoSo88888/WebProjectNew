import axios from 'axios'
import config from '~/config/index.js'
import { getSign } from '~/api/sign.js'
import { navigateTo } from '#imports'
import { loginOutDialog } from '~/utils/index'

const requestUrl = config.debug ? config.mockUrl : config.baseUrl

let showLogoutDialog = false

const instance = axios.create({
    baseURL: requestUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
})

const getDialog = () => {
  try {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$dialog
  } catch (e) {
    return null
  }
}

const getLang = () => {
  try {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$lang
  } catch (e) {
    return (key) => key
  }
}

// 请求拦截
instance.interceptors.request.use(
    (cfg) => {
        if (cfg.url === '/upload/upload_image') {
            const signed = getSign(Object.fromEntries(cfg.data))
            cfg.headers['Content-Type'] = 'multipart/form-data'
            cfg.data.append('timestamp', signed.timestamp)
            cfg.data.append('sign', signed.sign)
            cfg.data.append('token', signed.token)
        } else {
            cfg.data = getSign(cfg.data)
        }
        return cfg
    },
    (err) => Promise.reject(err)
)

// 响应拦截
instance.interceptors.response.use(
    (res) => {
        const data = res.data
        if (data.success) return data;
        if (!data.success) {
            if (data.code === 401 || data.code === 404 ||
                data.message === 401 || data.message === 404) {
                const $dialog = getDialog()
                const $lang = getLang()
                if ($dialog && !showLogoutDialog) {
                    showLogoutDialog = true
                    $dialog.alert({
                        title: $lang('提示'),
                        message: $lang('登录超时，请重新登录'),
                    }).then(() => {
                        showLogoutDialog = false
                        loginOutDialog()
                        navigateTo('/login/login')
                    })
                } else {
                    showLogoutDialog = false
                    loginOutDialog()
                    navigateTo('/login/login')
                }
                return
            }
            return data

        }
    },
    (err) => Promise.reject(err)
)

const api = {
    post: (url, params = {}) => instance.post(url, params),
    get: (url, params = {}) => instance.get(url, { params }),
}

export default api
