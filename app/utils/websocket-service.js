import config from "~/config"
import { genSignParams,getLocalToken } from "~/api/sign"
import { encrypt } from "~/api/AES"
import { storage } from "./index"

export default class WebSocketService {
    constructor(user_id = '',options = {}) {
        let str = ''
        let token = storage.get('token')
        let obj = {
            "user_id":String(user_id),
            "token":token,
        }
        let params = this.getSign(obj)
        let aes = encrypt(JSON.stringify(params),config.apiKey)
        str = encodeURIComponent(aes)
        let domain = config.debug ? config.mockSocketUrl : config.socketUrl;
        this.url = domain + '?params=' + str;
        this.websocket = null;
        this.reconnectInterval = options.reconnectInterval || 5000; // 5 seconds
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 3;
        this.heartbeatInterval = options.heartbeatInterval || 60000; // 60 seconds
        this.heartbeatTimeout = options.heartbeatTimeout || 30000; // 30 seconds
        this.heartbeatTimer = null;
        this.heartbeatTimeoutTimer = null;
        this.shouldReconnect = true;

        this.events = {
            open: [],
            message: [],
            close: [],
            error: []
        };

        this.connect();
    }

    getSign(params){
        //获取配置文件中的加密Key
        let apiKey = config.apiKey
        //获取配置文件中的二次加密Key
        let secondApikey = config.secondApikey
        let timestamp = new Date().getTime();
        //params对象添加请求时间戳
        params.timestamp = timestamp
        //params对象添加token参数
        params.token = getLocalToken()
        //params对象添加sign参数
        params.sign = ""
        // 将params 升序加密
        params.sign = genSignParams(timestamp, apiKey, params, true)
        //再把有sign参数的 params 进行降序二次加密
        params.sign = genSignParams(timestamp, secondApikey, params, false)
        //params添加时间戳参数
        params.timestamp = timestamp
        return params
    }

    connect() {
        this.websocket = new WebSocket(this.url);

        this.websocket.onopen = (event) => {
            console.log('open')
            this.reconnectAttempts = 0;
            this.triggerEvent('open', event);
            // this.startHeartbeat();
        };

        this.websocket.onmessage = (event) => {
            this.triggerEvent('message', event);
            // this.resetHeartbeatTimeout();
        };

        this.websocket.onclose = (event) => {
            this.triggerEvent('close', event);
            this.stopHeartbeat();
            let token = getStorage('token')
            if (token && this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => this.reconnect(), this.reconnectInterval);
            }
        };

        this.websocket.onerror = (event) => {
            this.triggerEvent('error', event);
        };
    }

    reconnect() {
        this.reconnectAttempts++;
        this.connect();
    }

    send(sender = {},message='',message_transfer_type = 1,socket_type = 'private_message') {
        if (this.websocket.readyState === WebSocket.OPEN) {
            let obj = {
                message_transfer_type: message_transfer_type, // 消息传输类型 1:文本; 2:字节
                socket_type:socket_type,// 消息类型  message: 聊天; heart_bit: 心跳包
                content: message,  // 聊天内容
                sender: sender,
                "attributes": {}
            };
            let json = JSON.stringify(obj);
            this.websocket.send(json);
        } else {
            this.reconnect()
            console.error('WebSocket is not open. Ready state is:', this.websocket.readyState);
        }
    }

    on(eventType, callback) {
        if (this.events[eventType]) {
            this.events[eventType].push(callback);
        } else {
            console.error(`Unsupported event type: ${eventType}`);
        }
    }

    off(eventType, callback) {
        if (this.events[eventType]) {
            this.events[eventType] = this.events[eventType].filter(cb => cb !== callback);
        } else {
            console.error(`Unsupported event type: ${eventType}`);
        }
    }

    triggerEvent(eventType, event) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(callback => callback(event));
        }
    }

    close() {
        console.log('websocket close')
        this.shouldReconnect = false;
        this.websocket.close();
        // this.stopHeartbeat();
    }

    startHeartbeat() {
        let _this = this
        if (this.heartbeatInterval > 0) {
            this.heartbeatTimer = setInterval(() => {
                if (_this.websocket.readyState === WebSocket.OPEN) {
                    console.log('this.websocket.readyState',_this.websocket.readyState)
                    console.log('WebSocket.OPEN',WebSocket.OPEN)
                    let message = {
                        socket_type:'heart_bit',// 消息类型  message: 聊天; heart_bit: 心跳包
                        token:getStorage('token')
                    };
                    let json = JSON.stringify(message);
                    _this.websocket.send(json);
                    _this.heartbeatTimeoutTimer = setTimeout(() => {
                        console.warn('Heartbeat timeout, closing WebSocket connection');
                        _this.websocket.close();
                    }, _this.heartbeatTimeout);
                }
            }, _this.heartbeatInterval);
        }
    }

    resetHeartbeatTimeout() {
        clearTimeout(this.heartbeatTimeoutTimer);
    }

    stopHeartbeat() {
        clearInterval(this.heartbeatTimer);
        clearTimeout(this.heartbeatTimeoutTimer);
    }
}
