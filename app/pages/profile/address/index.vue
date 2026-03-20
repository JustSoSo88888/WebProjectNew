<template>
    <div class="address-page">
        <!-- List Section -->
        <div class="list-section">
            <div
                    v-for="item in addressList"
                    :key="item.id"
                    class="address-item"
                    @click="editAddress(item)"
            >
                <div class="item-info">
                    <div class="info-row">
                        <span class="name">{{ item.name }}</span>
                        <span class="phone">{{ item.phone }}</span>
                        <span v-if="item.isDefault" class="default-tag">默认</span>
                    </div>
                    <div class="info-address">{{ item.fullAddress }}</div>
                </div>
                <div class="item-action">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="bottom-bar">
            <button class="add-btn" @click="addAddress">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </svg>
                添加新地址
            </button>
        </div>
    </div>
</template>

<script setup>
    import {ref} from 'vue'
    import {navigateTo} from '#imports'

    definePageMeta({ layout: 'second-page' })

    // Mock data for address list
    const addressList = ref([
        {
            id: 1,
            name: 'John Doe',
            phone: '+55 11 99999-0001',
            fullAddress: 'Rua das Flores, 123, São Paulo, SP, Brazil',
            isDefault: true,
        },
        {
            id: 2,
            name: 'Jane Smith',
            phone: '+55 21 88888-0002',
            fullAddress: 'Avenida Paulista, 1000, São Paulo, SP, Brazil',
            isDefault: false,
        },
        {
            id: 3,
            name: 'Carlos Silva',
            phone: '+55 31 77777-0003',
            fullAddress: 'Rua do Ouvidor, 50, Rio de Janeiro, RJ, Brazil',
            isDefault: false,
        },
    ])

    // Navigate to addressAdd.vue for editing
    const editAddress = (item) => {
        navigateTo({ path: '/profile/address/addressAdd', query: { id: item.id, ...item } })
    }

    // Navigate to addressAdd.vue for adding
    const addAddress = () => {
        navigateTo('/profile/address/addressAdd')
    }
</script>

<style scoped lang="scss">
    .address-page {
        min-height: 100vh;
        background: $color-bg-page;
        padding-bottom: rem(120);
    }

    // Header is now in layout (secondPage.vue)

    // List Section
    .list-section {
        margin: rem(12) rem(16);
    }

    .address-item {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: $radius-lg;
        padding: rem(16);
        margin-bottom: rem(10);
        box-shadow: $shadow-sm;
        cursor: pointer;
        transition: transform 0.2s;

        &:active {
            transform: scale(0.98);
        }
    }

    .item-info {
        flex: 1;
        min-width: 0;
    }

    .info-row {
        display: flex;
        align-items: center;
        gap: rem(8);
        margin-bottom: rem(6);
    }

    .name {
        font-size: rem(15);
        font-weight: 600;
        color: $color-text-primary;
    }

    .phone {
        font-size: rem(14);
        color: $color-text-secondary;
    }

    .default-tag {
        font-size: rem(10);
        padding: rem(2) rem(6);
        background: $color-primary-bg;
        color: $color-primary;
        border-radius: $radius-full;
        font-weight: 500;
    }

    .info-address {
        font-size: rem(13);
        color: $color-text-muted;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .item-action {
        padding: rem(8);
        color: $color-text-muted;

        svg {
            width: rem(20);
            height: rem(20);
        }
    }


</style>
