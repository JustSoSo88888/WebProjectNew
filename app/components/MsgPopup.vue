<template>
    <div>
        <van-popup v-model:show="showMessage" class="message-popup" :close-on-click-overlay="false" :overlay="false"
            position="top">
            <div class="content" @click="toUrl">
                <van-icon name="service-o" class="icon" size=".35rem" />
                <div class="item">
                    {{ content }}
                </div>
            </div>
        </van-popup>
    </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const { $bus } = useNuxtApp()
import { navigateTo ,useRouter} from '#imports'
const route = useRoute()
let timer = null
const showMessage = ref(false)
const content = ref('')
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const handleNewMessage = (data) => {
    console.log('useRouter',route.name);
    if(route.name === 'chat') return

    clearTimeout(timer)
    if(data.content.content.includes('clickable-img') && data.content.content.includes('img')){
        content.value = `[ ${$lang('图片')} ]`
    }else{
        content.value = data.content.content
    }
    
    showMessage.value = true;
    timer = setTimeout(() => {
        showMessage.value = false;
    }, 3000)
}

const toUrl = () => {
    clearTimeout(timer)
    showMessage.value = false;
    navigateTo('/chat')
}
onMounted(() => {
    const bus = $bus()
    const handlers = bus.get('new-private-message') || []
    handlers.push(handleNewMessage)
    bus.set('new-private-message', handlers)
})

onUnmounted(() => {
    clearTimeout(timer)
    const bus = $bus()
    const handlers = bus.get('new-private-message') || []
    const index = handlers.indexOf(handleNewMessage)
    if (index > -1) handlers.splice(index, 1)
})
</script>


<style lang="scss" scoped>
.message-popup {
    width: rem(375);
    left: calc(50% - rem(187.5));
    background: transparent;
    padding: rem(10);
    box-sizing: border-box;

    .content {
        background-color: #fff;
        border-radius: rem(5);
        padding: rem(10);
        display: flex;
        border: 1px solid $color-border;
        box-shadow: $shadow-sm;
        cursor: pointer;
        

        .icon {
            color: $color-primary;
            font-weight: bold;
        }

        .item {
            width: 100%;
            overflow: hidden;
            margin-left: rem(5);
        }
    }
}
</style>