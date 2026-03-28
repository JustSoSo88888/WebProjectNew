import api from './api';


// 理财列表
export const mealList = (params) => {
    return api.post('/meal/list', params);
}

// 理财列表
export const mealDetail = (params) => {
    return api.post('/meal/detail', params);
}

// 购买理财
export const mealBuy = (params) => {
    return api.post('/meal/buy', params);
}

 // 购买理财记录列表
export const mealOrder = (params) => {
    return api.post('/meal/order_list', params);
}