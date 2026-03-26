import api from './api';


// 红包兑换
export const exchange = (params) => {
    return api.post('/red_envelope_exchange_code/exchange', params);
}

// 红包兑换记录
export const redEnvelopeLogList = (params) => {
    return api.post('/red_envelope_exchange_log/list', params);
}