import api from './api';


/**
 * 用户登录
 * @param params
 * @returns {Promise<unknown>}
 */
export const emailLogin = (params) => {
    return api.post('/login/login', params);
}

/**
 * 用户注册
 * @param params
 * @returns {Promise<unknown>}
 */
export const emailRegister = (params) => {
    return api.post('/login/register', params);
}