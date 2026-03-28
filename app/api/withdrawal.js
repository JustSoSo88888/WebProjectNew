import api from './api'

/**
 * 法币提现订单列表
 * @param params
 * @returns {Promise<unknown>}
 */
export const bankCardWithdrawalList = (params) => {
    return api.post('/withdraw/bank_card_without_order_list',params);
}
