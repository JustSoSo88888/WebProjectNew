<template>
    <div class="main">
        <div class="main__content">
            <NuxtPage/>
        </div>
        <BottomNav/>
    </div>
</template>

<script setup>
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

    .slide-left-enter-active,
    .slide-left-leave-active {
        transition: all 0.25s ease-out;
    }

    .slide-left-enter-from {
        opacity: 0;
        transform: translateX(rem(20));
    }

    .slide-left-leave-to {
        opacity: 0;
        transform: translateX(rem(-20));
    }
</style>
