import api from './api';


/**
 * 获取客服未读
 * @param params
 * @returns {Promise<unknown>}
 */
export const messageUnreadCount = (params) => {
    return api.post('/chat/message_unread_count', params);
}


/**
 * 获取代理ID
 * @param params
 * @returns {Promise<unknown>}
 */
export const getAgentId = (params) => {
    return api.post('/chat/get_chatting_partner_user_id', params);
}

/**
 * 聊天列表
 * @param params
 * @returns {Promise<unknown>}
 */
export const messageList = (params) => {
    return api.post('/chat/message_list', params);
}

/**
 * 设置已读
 * @param params
 * @returns {Promise<unknown>}
 */
export const updateMessageIsRead = (params) => {
    return api.post('/member/update_message_is_read', params);
}
