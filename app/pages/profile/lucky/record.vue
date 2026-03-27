<template>
    <div>
        <van-pull-refresh :pulling-text="$lang('下拉即可刷新') + '...'" :loosing-text="$lang('释放即可刷新') + '...'"
            :loading-text="$lang('加载中') + '...'" v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" :loading-text="$lang('加载中')"
                :finished-text="list.length > 0 ? $lang('没有更多了') : $lang('暂无数据')" @load="onLoad">
            </van-list>
        </van-pull-refresh>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { orderList } from '~/api/turntable';
import Empty from '~/components/Empty.vue';
definePageMeta({
    layout: 'second-page',
    pageTransition: { name: 'slide-left', mode: 'out-in' },
    layoutTransition: false
})
onMounted(() => {

})


const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const rows = ref(20)
const list = ref([])

const onLoad = () => {
    let param = {
        rows: rows.value,
        page: page.value
    }
    showLoading($lang('加载中'))
    orderList(param).then(res => {
        hideLoading();
        refreshing.value = false
        if (res.success) {
            const dataList = res.data.rows || []
            if (page.value <= 1) {
                list.value = dataList
            } else {
                list.value = [...list.value, ...dataList]
            }
            if (dataList.length >= rows.value) {
                page++
            } else {
                finished.value = true
            }

        } else {
            showMsg(res.message, 'fail')
            finished.value = true
        }
        loading.value = false
    }).catch(error => {
        finished.value = true
        loading = false;
        hideLoading();
        showMsg(error.message, 'fail')
    })
}

const onRefresh = () => {
    finished.value = false;
    page.value = 1;
    loading.value = true;
    onLoad();
}
</script>


<style lang="scss" scoped></style>