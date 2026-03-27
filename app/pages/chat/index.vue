<template>
    <div class="chat-page">
        <div class="chat-list">
            <div v-for="(msg, index) in messagesList" :key="index" class="chat-item"
                :class="{ 'is-self': userData.id == msg.user_id }">
                <img v-if="!userData.id == msg.user_id" src="https://api.dicebear.com/7.x/bottts/svg?seed=service"
                    class="avatar" />
                <img v-if="userData.id == msg.user_id" src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    class="avatar" />
                <div class="bubble">
                    <div class="bubble-content" v-html="msg.content" @click="handleMessageClick"></div>
                </div>

            </div>
        </div>

        <div class="chat-input">
            <div class="input-box">
                <input v-model="inputText" type="text" class="input-field" placeholder="请输入内容..."
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getAgentId, updateMessageIsRead, messageList } from '~/api/chat'
const { $socket, $createSocket, $destroySocket, $bus } = useNuxtApp()
import { useAppStore } from '~/stores/app.js'
import { showImagePreview } from 'vant'

const appStore = useAppStore()

definePageMeta({ layout: 'second-page' })
onMounted(() => {
    handleGetAgentId();
    userData.value = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : {}
    handleUpdateMessageIsRead();
    appStore.setUnReadCount(0)
})
onBeforeUnmount(() => {
    $socket()?.off('message', socketMessageHandler)
    appStore.setUnReadCount(0)
    handleUpdateMessageIsRead()
})
const userData = ref({})
const toUserId = ref(0)
const inputText = ref('')
const messagesList = ref([])
const handleGetAgentId = () => {
    getAgentId({}).then(res => {
        if (res.success) {
            toUserId.value = res.data
            $socket()?.off('message', socketMessageHandler)
            $socket()?.on('message', socketMessageHandler)
        }
    })
}

const handleMessageClick = (event) => {
    if (event.target.classList.contains("clickable-img")) {
        showImagePreview({ images: [event.target.src] })
    }
    
}

const handleUpdateMessageIsRead = () => {
    updateMessageIsRead({ chat_user_id: toUserId.value }).then(res => {

    })
}

const socketMessageHandler = (event) => {
    try {
        const objs = JSON.parse(event.data);
        for (const obj of objs) {
            if (obj.socket_type !== 'private_message' && obj.socket_type !== 'message' && obj.socket_type !== 'join') continue;
            if (
                (Number(obj.sender.receiver_id) === Number(userData.value.id) ||
                    Number(obj.sender.user_id) === Number(userData.value.id)) &&
                (Number(obj.sender.receiver_id) === Number(toUserId.value)
                    || Number(obj.sender.user_id) === Number(toUserId.value))
            ) {
                const messageId = obj.message_id;
                const isExist = messagesList.value.findIndex(item => item.id == messageId);
                console.log(isExist);

                if (isExist === -1) {
                    const messageObj = { ...obj.sender };
                    messageObj.content = obj.content;
                    messageObj.socket_type = obj.socket_type;
                    messageObj.receiver_id = obj.sender.receiver_id;
                    messageObj.id = messageId;
                    messagesList.value.push(messageObj)
                }
            }
        }
    } catch (e) {

    }

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
    const params = {
        user_id: userData.value.id,
        name: userData.value.nickname,
        head_image: userData.value.head_image,
        receiver_id: toUserId.value,
        attributes: {}
    }
    $socket().send(params, inputText.value)
    inputText.value = ''
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
    flex-direction: column;
    gap: rem(16);
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

            .bubble-time {
                color: rgba(255, 255, 255, 0.7);
            }
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
    background: #fff;
    border-radius: rem(12);
    padding: rem(10) rem(12);
    box-shadow: $shadow-sm;
}

.bubble-content {
    font-size: rem(14);
    line-height: 1.5;
    word-break: break-word;
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
