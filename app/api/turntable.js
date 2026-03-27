import api from './api';


/**
 * 
 * **/
export const getMemberInfo = (params) => {
    return api.post('/turntable/get_member_info', params);
}

/**
 * 转盘信息
 * **/
export const turntableConfig = (params) => {
    return api.post('/turntable/config', params);
}


/**
 * 开启转盘
 * **/
export const turntableOpen = (params) => {
    return api.post('/turntable/open', params);
}


/**
 * 转盘记录
 * **/
export const orderList = (params) => {
    return api.post('/api/turntable/order_list', params);
}


/**
 *近10天转盘中奖记录
 * **/
export const rewardOrderList = (params) => {
    return api.post('/turntable/reward_order_list ', params);
}