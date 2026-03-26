import api from './api';


/**
 * 获取客服未读
 * @param params
 * @returns {Promise<unknown>}
 */
export const messageUnreadCount = (params) => {
    return api.post('/chat/message_unread_count', params);
}
