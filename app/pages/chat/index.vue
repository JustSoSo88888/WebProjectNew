<template>
    <div class="chat-page">
        <div class="chat-list">
            <div v-for="(msg, index) in messagesList" :key="index" class="chat-item" :class="{ 'is-self': userData.id == item.user_id }">
                <img v-if="!userData.id == item.user_id" src="https://api.dicebear.com/7.x/bottts/svg?seed=service" class="avatar" />
                <img v-if="userData.id == item.user_id" src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" class="avatar" />
                <div class="bubble">
                    <div class="bubble-content" v-html="item.content"></div>
                </div>

            </div>
        </div>

        <div class="chat-input">
            <button class="input-btn">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor"
                        stroke-width="1.8" stroke-linejoin="round" />
                </svg>
            </button>
            <input v-model="inputText" type="text" class="input-field" placeholder="请输入内容..."
                @keyup.enter="sendMessage" />
            <button class="send-btn" @click="sendMessage">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAgentId, updateMessageIsRead, messageList } from '~/api/chat'
const { $socket, $createSocket, $destroySocket, $bus } = useNuxtApp()

definePageMeta({ layout: 'second-page' })
onMounted(() => {
    handleGetAgentId();
    userData.value = storage.get('user_data') ? JSON.parse(storage.get('user_data')) : {}
})
const userData = ref({})
const toUserId = ref(0)
const inputText = ref('')
const messagesList = ref([])
const handleGetAgentId = () => {
    getAgentId({}).then(res => {
        if (res.sccess) {
            toUserId.value = res.data
        }
    })
}

const socketMessageHandler = (event) => {
    try {
        const objs = JSON.parse(event.data);
        for (const obj of objs) {
            if (obj.socket_type !== 'private_message' && obj.socket_type !== 'message' && obj.socket_type !== 'join') continue;
            if (
                (Number(obj.sender.receiver_id) === Number(this.user_id) ||
                    Number(obj.sender.user_id) === Number(this.user_id)) &&
                (Number(obj.sender.receiver_id) === Number(this.to_user_id)
                    || Number(obj.sender.user_id) === Number(this.to_user_id))
            ) {
                const messageId = obj.message_id;
                const isExist = messagesList.value.findIndex(item => item.id == messageId);
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
    $socket()?.on('message', socketMessageHandler());
}



const sendMessage = () => {
    let params = {
        user_id: userData.value.id,
        name: userData.value.nickname,
        head_image: userData.value.head_image,
        receiver_id: toUserId.value,
        attributes: {}
    }
    console.log(params);

    $socket().send(params, '123123213')
    inputText.value = ''
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
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: rem(10);
    padding: rem(12) rem(16);
    padding-bottom: calc(rem(12) + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid $color-border;
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

.input-field {
    flex: 1;
    height: rem(36);
    padding: 0 rem(12);
    background: $color-bg-page;
    border: none;
    border-radius: $radius-lg;
    font-size: rem(14);
    outline: none;

    &::placeholder {
        color: $color-text-muted;
    }
}

.send-btn {
    width: rem(36);
    height: rem(36);
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-primary;
    border-radius: $radius-md;
    color: #fff;
    flex-shrink: 0;

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
