import api from './api';


// 会员列表
export const levelConfigList = (params) => {
    return api.post('/level/level_config_list', params);
}

// 升级会员
export const updateLevel = (params) => {
    return api.post('/level/update_level', params);
}