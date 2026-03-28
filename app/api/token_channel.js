import api from './api';


/**
 * 获取银行卡账户
 * **/
export const tokenChannelTypeConfigList = (params) => {
    return api.post('/token_channel_type_config/list ', params);
}