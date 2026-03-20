<template>
    <div class="test-page">
        <h1>Test Page</h1>
        <p>Current path: {{ route.path }}</p>
        <p>Page title from meta: {{ route.meta.title }}</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'second-page' })

const route = useRoute()
</script>

<style scoped lang="scss">
.test-page {
    padding: 20px;
    background: white;
    min-height: 100vh;
}
</style>
