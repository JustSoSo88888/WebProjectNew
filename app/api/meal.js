import api from './api';


// 理财列表
export const mealList = (params) => {
    return api.post('/meal/list', params);
}