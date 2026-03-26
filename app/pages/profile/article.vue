<template>
    <div>
        <div class="content-box">
            <template v-if="html == ''">
                <Empty></Empty>
            </template>
            <template v-else>
                <div class="content" v-html="html">
                </div>
            </template>

        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCustomContentByKey } from '~/api/system';
import Empty from '~/components/Empty.vue';
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
definePageMeta({
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})
const html = ref('')
onMounted(() => {
    handleGetCustomContentByKey();
})

const handleGetCustomContentByKey = () => {
    showLoading($lang('加载中'))
    getCustomContentByKey({ key: 'profit_explain' }).then(res => {
        hideLoading();
        if (res.success) {
            html.value = res.data
        } else {
            showMsg(res.message, 'fail')
        }

    }).catch(error => {
        hideLoading();
        showMsg(error.message, 'fail')
    })
}
</script>


<style lang="scss" scoped>
.content-box {
    padding: rem(10);
    box-sizing: border-box;

    .content {
        padding: rem(10);
        background: #fff;
        border-radius: rem(10);
        box-shadow: $shadow-md;
    }
}
</style>