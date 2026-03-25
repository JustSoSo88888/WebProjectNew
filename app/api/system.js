import api from './api';


/**
 * 系统播报
 * **/
export const awardLog = (params) => {
    return api.post('/system/awardLog ', params);
}

// 修改支付密码
export const updatePayPassword = (params) => {
    return api.post('/member/update_pay_password', params);
}

// 修改密码
export const updatePassword = (params) => {
    return api.post('/system/update_password', params);
}

/**
 * 客服
 * **/
export const getServiceUrl = (params) => {
    return api.post('/system/getServiceUrl', params);
}