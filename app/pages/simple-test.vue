<template>
    <div class="simple-test">
        <h1>Simple Test Page</h1>
        <p>This is a simple test page</p>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'second-page' })
</script>

<style scoped lang="scss">
.simple-test {
    padding: 20px;
    background: white;
    min-height: 100vh;
}
</style>
