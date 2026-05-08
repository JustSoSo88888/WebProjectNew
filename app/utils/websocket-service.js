import config from "~/config"
import { getSign ,encryptPayloadWithSign} from "~/api/sign"
import { storage } from "./index"
import { decryptWsMessage } from "./EncryptUtils.js"

export default class WebSocketService {
    constructor(user_id = '', options = {}) {
        let token = storage.get('token')
        let obj = {
            "user_id": String(user_id),
            "token": token,
        }
        this._userId = user_id;
        this._token = token;
        this._signedParams = getSign(obj)
        let domain = config.debug ? config.mockSocketUrl : config.socketUrl;
        this._domain = domain;
        this.websocket = null;
        this.reconnectInterval = options.reconnectInterval || 5000;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 3;
        this.heartbeatInterval = options.heartbeatInterval || 60000;
        this.heartbeatTimeout = options.heartbeatTimeout || 30000;
        this.heartbeatTimer = null;
        this.heartbeatTimeoutTimer = null;
        this.shouldReconnect = true;
        this.useEncryption = true;
        this.messageQueue = [];
        this._connecting = false;

        this.events = {
            open: [],
            message: [],
            close: [],
            error: []
        };

        this._initPromise = null;
        this._initEncryption(this._signedParams);
    }

    async _initEncryption(signedParams) {
        if (this._initPromise) return this._initPromise;

        this._initPromise = (async () => {
            const ecdhPayload = await encryptPayloadWithSign(signedParams);
            const str = encodeURIComponent(JSON.stringify(ecdhPayload));
            this.url = this._domain + '?params=' + str;
            this.connect();
        })();

        return this._initPromise;
    }

    connect() {
        if (this._connecting) {
            console.log('WebSocket already connecting, skip');
            return;
        }
        this._connecting = true;

        this.websocket = new WebSocket(this.url);

        this.websocket.onopen = (event) => {
            console.log('open');
            this._connecting = false;
            this.reconnectAttempts = 0;
            while (this.messageQueue.length > 0) {
                const msg = this.messageQueue.shift();
                this.websocket.send(msg);
            }
            this.triggerEvent('open', event);
        };

        this.websocket.onmessage = async (event) => {
            if (this.useEncryption) {
                try {
                    const raw = JSON.parse(event.data);
                    if (raw.encrypted === '1') {
                        const decrypted = await decryptWsMessage(raw);
                        const newEvent = { ...event, data: JSON.stringify(decrypted) };
                        this.triggerEvent('message', newEvent);
                        return;
                    }
                } catch (e) {
                    console.error('Decrypt failed:', e);
                }
            }
            this.triggerEvent('message', event);
        };

        this.websocket.onclose = (event) => {
            this._connecting = false;
            this.triggerEvent('close', event);
            this.stopHeartbeat();
            let token = storage.get('token')
            if (token && this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => this.reconnect(), this.reconnectInterval);
            }
        };

        this.websocket.onerror = (event) => {
            this._connecting = false;
            this.triggerEvent('error', event);
        };
    }

    async reconnect() {
        this.reconnectAttempts++;
        let currentDomain = config.debug ? config.mockSocketUrl : config.socketUrl;
        if (currentDomain !== this._domain) {
            this._domain = currentDomain;
        }

        let token = storage.get('token')
        let obj = {
            "user_id": String(this._userId),
            "token": token,
        };
        let signedParams = getSign(obj);
        this._signedParams = signedParams;

        if (this.useEncryption) {
            const ecdhPayload = await encryptPayloadWithSign(signedParams);
            const str = encodeURIComponent(JSON.stringify(ecdhPayload));
            this.url = this._domain + '?params=' + str;
        }

        this.connect();
    }

    async send(sender = {}, message = '', message_transfer_type = 1, socket_type = 'private_message') {
        let obj = {
            message_transfer_type: message_transfer_type,
            socket_type: socket_type,
            content: message,
            sender: sender,
            "attributes": {}
        };
        let json = JSON.stringify(obj);
        if (this.useEncryption) {
            try {
                const raw = await encryptPayloadWithSign(JSON.parse(json));
                const encrypted = { encrypted: "1", iv: raw.iv, ciphertext: raw.ciphertext };
                json = JSON.stringify(encrypted);
            } catch (e) {
                console.error('Message encryption failed, sending plaintext:', e);
            }
        }
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(json);
        } else if (this._connecting || !this.websocket || this.websocket.readyState === 3) {
            console.log('WS not open, queueing message');
            this.messageQueue.push(json);
            if (!this.websocket) this.connect();
        } else {
            console.error('WebSocket is not open. Ready state is:', this.websocket?.readyState);
            this.reconnect();
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
    }

    startHeartbeat() {
        let _this = this
        if (this.heartbeatInterval > 0) {
            this.heartbeatTimer = setInterval(() => {
                if (_this.websocket.readyState === WebSocket.OPEN) {
                    console.log('this.websocket.readyState', _this.websocket.readyState)
                    console.log('WebSocket.OPEN', WebSocket.OPEN)
                    let message = {
                        socket_type: 'heart_bit',
                        token: storage.get('token')
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