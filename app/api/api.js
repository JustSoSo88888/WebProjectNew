import axios from 'axios'
import config from '~/config/index.js'
import { getSign } from '~/api/sign.js'

const requestUrl = config.debug ? config.mockUrl : config.baseUrl

const instance = axios.create({
    baseURL: requestUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
})

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
        console.log('res.data', res.data);
        const data = res.data
        if (data.success) return data;
        if (!data.success) {
            if (!data) return Promise.reject(new Error('Empty response'))
            if (data.code === 401 || data.code === 404 ||
                data.message === 401 || data.message === 404) {
                //   // token 失效，跳转登录
                //   navigateTo('/login/login')
                return
            }
        }11
    },
    (err) => Promise.reject(err)
)

const api = {
    post: (url, params = {}) => instance.post(url, params),
    get: (url, params = {}) => instance.get(url, { params }),
}

export default api
