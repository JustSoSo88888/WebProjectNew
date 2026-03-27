import { storage } from '~/utils/index'
import WebSocketService from '~/utils/websocket-service'
import { useAppStore } from '~/stores/app.js'

let socketInstance = null
const EXCLUDED_ROUTES = ['login-login', 'login-register']
const bus = new Map()


export default defineNuxtPlugin(() => {
    const appStore = useAppStore()
    const router = useRouter()

    const getBus = () => bus

    const globalMessageHandler = (event) => {
        const userId = storage.get('user_id')
        if (!userId) return
        let objs
        try {
            objs = JSON.parse(event.data)
        } catch {
            return
        }
        for (const obj of objs) {
            if (obj.socket_type == 'private_message') {
                const currentRoute = router.currentRoute.value
                const inChatPage = currentRoute.name === 'message-chat'
                if (Number(obj.sender.receiver_id) !== Number(userId) && Number(obj.sender.user_id) !== Number(userId)) continue
                if (Number(obj.sender.user_id) === Number(userId)) continue
                if (inChatPage) continue
                appStore.setUnReadCount(appStore.getUnReadCount + 1)
                const eventBus = getBus()
                const handlers = eventBus.get('new-private-message') || []
                handlers.forEach(handler => handler({ content: obj }))
            }
        }
    }

    const attachStatusHandlers = () => {
        if (!socketInstance) return
        socketInstance.on('open', () => appStore.setSocketStatus('connected'))
        socketInstance.on('close', () => appStore.setSocketStatus('disconnected'))
        socketInstance.on('error', () => appStore.setSocketStatus('disconnected'))
    }

    const attachHandler = () => {
        if (socketInstance) {
            socketInstance.off('message', globalMessageHandler)
            socketInstance.on('message', globalMessageHandler)
        }
    }

    const createSocket = (userId) => {
        if (socketInstance) socketInstance.close()
        appStore.setSocketStatus('connecting')
        socketInstance = new WebSocketService(userId)
        attachHandler()
        attachStatusHandlers()
        return socketInstance
    }

    const getSocket = () => socketInstance

    const destroySocket = () => {
        if (socketInstance) {
            socketInstance.off('message', globalMessageHandler)
            socketInstance.close()
            socketInstance = null
        }
        appStore.setSocketStatus('disconnected')
    }

    const reconnect = () => {
        const token = storage.get('token')
        const userId = storage.get('user_id')
        if (!token || !userId) return
        createSocket(userId)
    }

    router.afterEach((to) => {
        if (EXCLUDED_ROUTES.includes(to.name)) {
            destroySocket()
            return
        }
        const token = storage.get('token')
        const userId = storage.get('user_id')
        if (!token || !userId) return
        if (!socketInstance) {
            appStore.setSocketStatus('connecting')
            socketInstance = new WebSocketService(userId)
            attachHandler()
            attachStatusHandlers()
        }
    })

    return {
        provide: {
            createSocket,
            socket: getSocket,
            destroySocket,
            reconnect,
            bus: getBus
        }
    }
})
