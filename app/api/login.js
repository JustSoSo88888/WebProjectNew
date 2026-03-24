import api from './api';


/**
 * 用户登录
 * @param params
 * @returns {Promise<unknown>}
 */
export const register = (params) => {
    return api.post('/login/register', params);
}

/**
 * 用户注册
 * @param params
 * @returns {Promise<unknown>}
 */
export const login = (params) => {
    return api.post('/login/login', params);
}