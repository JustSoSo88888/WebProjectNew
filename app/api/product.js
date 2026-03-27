import api from './api';


// 获取任务列表
export const productOrderList = (params) => {
    return api.post('/product_order/list', params);
}


// 领取任务收益
export const getOrderIncome = (params) => {
    return api.post('/product_order/get_order_income', params);
}