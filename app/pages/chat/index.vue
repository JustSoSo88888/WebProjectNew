<template>
    <div class="chat-page">
        <div ref="chatListRef" class="chat-list" @scroll="handleScroll">
            <div class="chat-list-inner">
                <van-loading v-if="loading" class="loading-tip" size="20" />
                <div v-for="(msg, index) in messagesList" :key="msg.id || index" class="chat-item"
                    :class="{ 'is-self': userData.id == msg.user_id }">
                    <img v-if="userData.id != msg.user_id" src="../../assets/img/index/service.png"
                        class="avatar" />
                    <img v-if="userData.id == msg.user_id" src="../../assets/img/index/avatar.png"
                        class="avatar" />
                    <div class="bubble" v-html="msg.content" @click="handleMessageClick"></div>
                </div>
            </div>
        </div>

        <div v-if="unreadCount > 0" class="unread-tip" @click="goToBottom">
            <van-icon name="arrow-down" />
            <span>{{ unreadCount }}{{ $lang('条新消息') }}</span>
        </div>

        <div class="chat-input">
            <div class="input-box">
                <input v-model="inputText" type="text" class="input-field" :placeholder="$lang('请输入消息内容')"
                    @keyup.enter="sendMessage" />
                <button class="send-btn" @click="sendMessage">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <van-icon name="photo-o" class="img-icon" size="0.7rem" @click="openFileInput" />
        </div>
        <input ref="file" style="display: none" type="file" accept=".png,.jpg,.jpeg,.gif" @change="handleFileChange">

        <ImageUploadPreview v-model="isShowImagePopup" :file="uploadFile" @success="onUploadSuccess"
            @cancel="onUploadCancel" />
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { getAgentId, updateMessageIsRead, messageList } from '~/api/chat'
const { $socket, $createSocket, $destroySocket, $bus } = useNuxtApp()
import { useAppStore } from '~/stores/app.js'
import { showImagePreview } from 'vant'

const appStore = useAppStore()
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

definePageMeta({ layout: 'second-page' })

const chatListRef = ref(null)
const userData = ref({})
const toUserId = ref(0)
const inputText = ref('')
const messagesList = ref([])
const loading = ref(false)
const page = ref(1)
const rows = 20
const finished = ref(false)
const isAtBottom = ref(true)
const unreadCount = ref(0)
const canSend = ref(true)

onMounted(() => {
    handleGetAgentId()
    userData.value = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : {}
    handleUpdateMessageIsRead()
    appStore.setUnReadCount(0)
})

onBeforeUnmount(() => {
    $socket()?.off('message', socketMessageHandler)
    appStore.setUnReadCount(0)
    handleUpdateMessageIsRead()
})

const handleGetAgentId = () => {
    getAgentId({}).then(res => {
        if (res.success) {
            toUserId.value = res.data
            loadMessages(true)
            $socket()?.off('message', socketMessageHandler)
            $socket()?.on('message', socketMessageHandler)
        }
    })
}

const loadMessages = async (isInit = false) => {
    if (loading.value || finished.value) return
    loading.value = true
    try {
        const res = await messageList({ page: page.value, rows })
        if (res.success) {
            const data = res.data.rows || []
            if (data.length < rows) finished.value = true
            const list = data.map(item => ({
                id: item.id,
                user_id: item.sender_id,
                name: item.sender_nickname,
                head_image: item.sender_head_image,
                receiver_id: item.receiver_id,
                content: item.content,
                create_time: item.create_time,
                socket_type: item.socket_type
            }))
            if (isInit) {
                messagesList.value = list.reverse()
            } else {
                const oldScrollTop = chatListRef.value?.scrollTop || 0
                messagesList.value = [...list.reverse(), ...messagesList.value]
                await nextTick()
                // column-reverse 下保持滚动位置
                if (chatListRef.value) chatListRef.value.scrollTop = oldScrollTop
            }
            page.value++
        }
    } finally {
        loading.value = false
    }
}

const handleScroll = () => {
    if (!chatListRef.value) return
    const { scrollTop, scrollHeight, clientHeight } = chatListRef.value
    isAtBottom.value = Math.abs(scrollTop) < 50
    if (isAtBottom.value) unreadCount.value = 0
    const maxScroll = scrollHeight - clientHeight
    if (Math.abs(scrollTop) >= maxScroll - 50 && !loading.value && !finished.value) {
        loadMessages()
    }
}

const scrollToBottom = () => {
    if (chatListRef.value) chatListRef.value.scrollTop = 0
}

const goToBottom = () => {
    scrollToBottom()
    unreadCount.value = 0
}

const handleMessageClick = (event) => {
    if (event.target.classList.contains("clickable-img")) {
        showImagePreview({ images: [event.target.src] ,closeable:true})
    }

}

const handleUpdateMessageIsRead = () => {
    updateMessageIsRead({ chat_user_id: toUserId.value }).then(res => {

    })
}

const socketMessageHandler = async (event) => {
    try {
        const objs = JSON.parse(event.data)
        for (const obj of objs) {
            if (obj.socket_type !== 'private_message' && obj.socket_type !== 'message' && obj.socket_type !== 'join') continue
            if (
                (Number(obj.sender.receiver_id) === Number(userData.value.id) ||
                    Number(obj.sender.user_id) === Number(userData.value.id)) &&
                (Number(obj.sender.receiver_id) === Number(toUserId.value)
                    || Number(obj.sender.user_id) === Number(toUserId.value))
            ) {
                const messageId = obj.message_id
                const isExist = messagesList.value.findIndex(item => item.id == messageId)
                if (isExist === -1) {
                    const messageObj = { ...obj.sender }
                    messageObj.content = obj.content
                    messageObj.socket_type = obj.socket_type
                    messageObj.receiver_id = obj.sender.receiver_id
                    messageObj.id = messageId
                    messagesList.value.push(messageObj)
                    if (isAtBottom.value) {
                        await nextTick()
                        scrollToBottom()
                    } else {
                        unreadCount.value++
                    }
                }
            }
        }
    } catch (e) { }

}


const file = ref(null)
const uploadFile = ref(null)
const isShowImagePopup = ref(false)
const openFileInput = () => {
    file.value.click()

}

const handleFileChange = (event) => {
    const fileList = event.target.files
    if (fileList.length > 0) {
        const f = fileList[0]
        if (!f.type.match(/^image\/(png|jpe?g|gif)$/)) {
            showMsg($lang("请上传 .png, .jpg, .jpeg 或 .gif 格式的图片"), 'fail')
            return
        }
        uploadFile.value = f
        isShowImagePopup.value = true
    }
}

const sendMessage = () => {
    if (!inputText.value.trim()) return
    if (!canSend.value) {
        showMsg($lang('您的发言频率过快'), 'fail')
        return
    }
    const params = {
        user_id: userData.value.id,
        name: userData.value.nickname,
        head_image: userData.value.head_image,
        receiver_id: toUserId.value,
        attributes: {}
    }
    $socket().send(params, inputText.value)
    inputText.value = ''
    canSend.value = false
    setTimeout(() => canSend.value = true, 1000)
}

const onUploadSuccess = (imageUrl) => {
    const params = {
        user_id: userData.value.id,
        name: userData.value.nickname,
        head_image: userData.value.head_image,
        receiver_id: toUserId.value,
        attributes: {}
    }
    $socket().send(params, `<div><img class="p-5 clickable-img" style='max-width: 180px' src='${imageUrl}'>`)
    resetFileInput()
}

const onUploadCancel = () => {
    resetFileInput()
}

const resetFileInput = () => {
    uploadFile.value = null
    if (file.value) file.value.value = ''
}
</script>

<style lang="scss" scoped>
.chat-page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - rem(56));
    background: $color-bg-page;
}

.chat-list {
    flex: 1;
    overflow-y: auto;
    padding: rem(16);
    padding-bottom: rem(80);
    box-sizing: border-box;
    display: flex;
    flex-direction: column-reverse;
}

.chat-list-inner {
    display: flex;
    flex-direction: column;
    gap: rem(16);
}

.loading-tip {
    align-self: center;
    padding: rem(10) 0;
}

.chat-item {
    display: flex;
    gap: rem(10);
    max-width: 80%;

    &.is-self {
        align-self: flex-end;
        flex-direction: row-reverse;

        .bubble {
            background: $color-primary;
            color: #fff;
            border: none;
        }
    }
}

.avatar {
    width: rem(36);
    height: rem(36);
    border-radius: 50%;
    flex-shrink: 0;
    background: #fff;
}

.bubble {
    background: #f5f5f5;
    border-radius: rem(12);
    padding: rem(10) rem(12);
    border: 1px solid #e0e0e0;
    font-size: rem(14);
    line-height: 1.5;
    word-break: break-word;
}

.unread-tip {
    position: fixed;
    bottom: rem(80);
    right: rem(20);
    background: $color-primary;
    color: #fff;
    padding: rem(8) rem(12);
    border-radius: rem(20);
    display: flex;
    align-items: center;
    gap: rem(4);
    font-size: rem(12);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    box-sizing: border-box;
}

.bubble-time {
    font-size: rem(10);
    color: $color-text-muted;
    margin-top: rem(4);
    text-align: right;
}

.chat-input {
    position: fixed;
    bottom: 0;
    left: calc(50% - rem(187.5));
    right: 0;
    display: flex;
    width: rem(375);
    align-items: center;
    gap: rem(10);
    padding: rem(12) rem(16);
    padding-bottom: calc(rem(12) + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid $color-border;

    .img-icon {
        color: $color-primary;
        cursor: pointer;
    }
}

.input-btn {
    width: rem(36);
    height: rem(36);
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-bg-page;
    border-radius: $radius-md;
    color: $color-text-secondary;
    flex-shrink: 0;

    svg {
        width: rem(20);
        height: rem(20);
    }

    &:active {
        background: $color-bg-hover;
    }
}

.input-box {
    position: relative;
    width: 100%;

    .input-field {
        flex: 1;
        height: rem(36);
        padding: 0 rem(12);
        background: $color-bg-page;
        border: none;
        border-radius: $radius-lg;
        font-size: rem(14);
        outline: none;
        width: 100%;

        &::placeholder {
            color: $color-text-muted;
        }
    }
}


.send-btn {
    width: rem(50);
    height: rem(36);
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-primary;
    border-radius: $radius-md;
    color: #fff;
    flex-shrink: 0;
    position: absolute;
    right: 0;
    top: 0;

    svg {
        width: rem(18);
        height: rem(18);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:not(:disabled):active {
        opacity: 0.8;
    }
}
</style>
