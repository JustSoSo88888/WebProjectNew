import api from './api'

/**
 * 法币提现订单列表
 * @param params
 * @returns {Promise<unknown>}
 */
export const bankCardWithdrawalList = (params) => {
    return api.post('/withdraw/bank_card_without_order_list',params);
}


/**
 * 获取银行卡提现
 * @param params
 * @returns {Promise<unknown>}
 */
export const bankCardWithdrawalRate = (params) => {
    return api.post('/withdraw/band_card_withdraw_rate',params);
}

/**
 * 获取银行卡提现
 * @param params
 * @returns {Promise<unknown>}
 */
export const bankCardWithdrawal = (params) => {
    return api.post('/withdraw/bank_card_do_without',params);
}