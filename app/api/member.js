import api from './api';


// 获取用户余额
export const getBalance = (params) => {
    return api.post('/member/get_balance', params);
}

// 退出登录
export const loginOut = (params) => {
    return api.post('/member/login_out', params);
}

// 获取用户团队信息
export const basicData = (params) => {
    return api.post('/member/basic_data', params);
}

// 是否绑定交易密码
export const hasSetPayPassword = (params) => {
    return api.post('/member/has_set_pay_password', params);
}

// 设置支付密码
export const setPayPassword = (params) => {
    return api.post('/member/set_pay_password', params);
}

// 交易记录列表
export const tradingRecord = (params) => {
    return api.post('/member/trading_record', params);
}

// 获取充值信息获取
export const getCoinAddress = (params) => {
    return api.post('/member/get_coin_address', params);
}

// 获取用户团队信息
export const teamList = (params) => {
    return api.post('/member/team_list', params);
}


// 获取任务列表
export const memberProductOrderList = (params) => {
    return api.post('/member_product_order/list', params);
}


// 绑定银行卡
export const bindBankCard = (params) => {
    return api.post('/member/bind_bank_card', params);
}

// 获取银行卡列表
export const bankCardList = (params) => {
    return api.post('/member/bank_card_list', params);
}

// 上传图片
export const uploadImage = (params) => {
    return api.post('/upload/upload_image', params);
}


// 优惠卷
export const getCouponList = (params) => {
    return api.post('/member/get_coupon_list', params);
}

// 法币充值
// token_channel_id
// amount
// home_url
export const memberRecharge = (params) => {
    return api.post('/member/recharge', params);
}