import axios from 'axios'
import config from '~/config/index.js'
import { getSign } from '~/api/sign.js'
import { navigateTo } from '#imports'
import { loginOutDialog, storage } from '~/utils/index'

import { decryptResponse, getClientD, getServerPubKey, getLastClientPubKey, clearPublicKeyCache } from "../utils/EncryptUtils.js";
import { encryptPayloadWithSign, clearPublicKey } from '~/api/sign.js'


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

const handleLogout = () => {
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
}

// 请求拦截
instance.interceptors.request.use(
    async (cfg) => {
        const isUpload = cfg.data instanceof FormData;
        const signed = getSign(cfg.data || {});

        if (isUpload) {
            cfg.headers['Content-Type'] = 'multipart/form-data'
            cfg.data.append('timestamp', signed.timestamp);
            cfg.data.append('sign', signed.sign);
            cfg.data.append('token', signed.token);
        } else {
            try {
                const encrypted = await encryptPayloadWithSign(signed);
                cfg.data = encrypted;
            } catch (e) {
                return Promise.reject(e);
            }
        }

        return cfg
    },
    (err) => Promise.reject(err)
)

// 响应拦截
instance.interceptors.response.use(
    async (res) => {
        let data = res.data;

        // 尝试解密响应
        if (data.encrypted === "1" && data.ciphertext) {
            if (data.rekeyRequired) {
                clearPublicKey();
            }

            const clientD = getClientD();
            const serverKey = getServerPubKey();
            const lastClientPubKey = getLastClientPubKey();

            const maxRetries = 1;
            let retryCount = 0;

            const tryDecrypt = async () => {
                if (!clientD || !serverKey || !lastClientPubKey) {
                    console.log('[API] Missing cache for decrypt, clearing and refetching public key');
                    clearPublicKey();
                    clearPublicKeyCache();
                    const newClientD = getClientD();
                    const newServerKey = getServerPubKey();
                    const newLastClientPubKey = getLastClientPubKey();
                    if (!newClientD || !newServerKey || !newLastClientPubKey) {
                        throw new Error('DECRYPT_NO_CACHE: Still missing cache after clear');
                    }
                    data.clientPubKey = newLastClientPubKey;
                } else {
                    data.clientPubKey = lastClientPubKey;
                }

                try {
                    data = await decryptResponse(data);
                } catch (e) {
                    retryCount++;
                    console.error('[API] Decrypt failed, retry', retryCount, ':', e.message);
                    if (retryCount <= maxRetries) {
                        clearPublicKey();
                        clearPublicKeyCache();
                        throw e;
                    }
                    throw e;
                }
            };

            if (clientD && serverKey && lastClientPubKey) {
                await tryDecrypt();
            } else {
                await tryDecrypt();
            }
        }

        if (data) {
            if (data.success) {
                return data;
            } else {
                if (data.code === 401 || data.code === 404 ||
                    data.message === 401 || data.message === 404) {
                    handleLogout();
                    return;
                }
                return data;
            }
        }
    },
    (err) => Promise.reject(err)
)

const api = {
    post: (url, params = {}) => instance.post(url, params),
    get: (url, params = {}) => instance.get(url, { params }),
}

export default api