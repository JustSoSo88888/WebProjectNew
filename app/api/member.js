import api from './api';


// 获取用户余额
export const getBalance = (params) => {
    return api.post('/member/get_balance', params);
}

// 退出登录
export const loginOut = (params) => {
    return api.post('/member/login_out', params);
}

// 获取用户团队信息
export const basicData = (params) => {
    return api.post('/member/basic_data', params);
}