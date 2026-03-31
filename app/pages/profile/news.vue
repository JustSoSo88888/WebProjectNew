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
    import {ref, onMounted} from 'vue';
    import {getCustomContentByKey} from '~/api/system';
    import Empty from '~/components/Empty.vue';

    const nuxtApp = useNuxtApp()
    const $lang = nuxtApp.$lang
    definePageMeta({
        layout: 'second-page',
        pageTransition: {name: 'slide-left', mode: 'out-in'},
        layoutTransition: false
    })
    const html = ref('')
    onMounted(() => {
        handleGetCustomContentByKey();
    })

    const handleGetCustomContentByKey = () => {
        showLoading($lang('加载中'))
        getCustomContentByKey({key: 'news'}).then(res => {
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
            max-width: 100%;
            overflow-x: hidden;

            :deep(*) {
                max-width: 100%;
                white-space: normal !important;
                word-break: break-word;
                overflow-wrap: anywhere;
                box-sizing: border-box;
            }

            :deep(img),
            :deep(video),
            :deep(iframe),
            :deep(table) {
                max-width: 100% !important;
                height: auto;
            }
        }
    }
</style>