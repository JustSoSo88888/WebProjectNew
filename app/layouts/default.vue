<template>
    <div class="main">
        <div class="main__content">
            <NuxtPage />
        </div>
        <BottomNav/>
        <PwaInstallPrompt/>
        <MsgPopup></MsgPopup>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'; 
import { hasSetPayPassword } from '~/api/member';
import MsgPopup from '~/components/MsgPopup.vue';
import { getServiceUrl } from '~/api/system';
const nuxtApp = useNuxtApp()
const appStore = useAppStore()
const $lang = nuxtApp.$lang
const $dialog = nuxtApp.$dialog
onMounted(() =>{
    getHasSetPayPassword();
    handleContactService();
})

const handleContactService = () => {
    getServiceUrl().then(res => {
        if(res.success){
            if(res.data.telegram_url){
                appStore.setShowService(true)
            }else{
                appStore.setShowService(false)
            }
        }   
    }).catch(error => { 

    })
}

const getHasSetPayPassword = () => {
    hasSetPayPassword({}).then(res => {
        if(res.success){
            if(!res.data){
                $dialog.alert({
                        title: $lang('提示'),
                        message: $lang('请设置交易密码'),
                    }).then(() => {
                        navigateTo('/profile/setPassword')
                    })
            }
        }
    }).catch(error => {

    })
}
</script>

<style scoped lang="scss">
    .main {
        width: rem(375);
        margin: 0 auto;
        overflow: hidden;
        height: 100vh;
        position: relative;
        background: #F8FAFC;

        &__content {
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: rem(64);
        }
    }
</style>
