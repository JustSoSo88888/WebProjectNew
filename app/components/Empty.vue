<template>
    <div>
        <van-empty class="custom-image" image-size="2rem" :description="$lang('暂无数据')" :image="emptyImg" />
    </div>
</template>

<script setup>
import emptyImg from '@/assets/img/index/empty.png'
const nuxtApp = useNuxtApp()
const $lang = nuxtApp.$lang
</script>


<style lang="scss" scoped>
</style>