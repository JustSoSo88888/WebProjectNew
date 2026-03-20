<template>
    <div class="address-add-page">
        <!-- Form Section -->
        <div class="form-section">
            <div class="form-group">
                <label class="form-label">姓名</label>
                <input
                        v-model="form.name"
                        type="text"
                        class="form-input"
                        placeholder="请输入收货人姓名"
                />
            </div>

            <div class="form-group">
                <label class="form-label">手机号</label>
                <div class="phone-input-wrapper">
                    <span class="country-code">+55</span>
                    <input
                            v-model="form.phone"
                            type="tel"
                            class="form-input"
                            placeholder="11 99999-0000"
                    />
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">详细地址</label>
                <textarea
                        v-model="form.address"
                        class="form-input form-textarea"
                        placeholder="请输入详细地址（街道、门牌号等）"
                        rows="3"
                ></textarea>
            </div>

            <div class="form-group form-group-row">
                <label class="form-label">设为默认地址</label>
                <label class="toggle-wrapper">
                    <input type="checkbox" v-model="form.isDefault" class="toggle-input"/>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>

        <!-- Bottom Button -->
        <div class="bottom-bar">
            <button class="confirm-btn" @click="submitForm">
                {{ isEdit ? '保存修改' : '确认添加' }}
            </button>
        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted} from 'vue'
    import {navigateTo, useRoute} from '#imports'

    definePageMeta({layout: 'second-page'})

    const route = useRoute()
    const isEdit = ref(false)

    // Form data
    const form = ref({
        name: '',
        phone: '',
        address: '',
        isDefault: false,
    })

    // Check if editing existing address
    onMounted(() => {
        if (route.query.id) {
            isEdit.value = true
            form.value = {
                name: route.query.name || '',
                phone: route.query.phone ? route.query.phone.replace('+55 ', '') : '',
                address: route.query.fullAddress || '',
                isDefault: route.query.isDefault === 'true' || route.query.isDefault === true
            }
        }
    })

    // Update page title based on edit mode
    watch(isEdit, (val) => {
        // Note: Title is now managed by the layout, but we keep the logic for reference
    }, {immediate: true})

    const submitForm = () => {
        if (!form.value.name || !form.value.phone || !form.value.address) {
            alert('请填写完整信息')
            return
        }

        // Simulate API call
        console.log('Submitting form:', form.value)

        // Show success message
        alert(isEdit.value ? '地址修改成功' : '地址添加成功')

        // Go back to list
        history.back()
    }
</script>

<style scoped lang="scss">
    .address-add-page {
        min-height: 100vh;
        background: $color-bg-page;
        padding-bottom: rem(100);
    }

    .confirm-btn {
        width: 100%;
        padding: rem(14) 0;
        border-radius: $radius-md;
        background: $gradient-primary;
        color: #fff;
        font-size: rem(15);
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
        margin-top: rem(8);

        &:active {
            opacity: 0.9;
        }
    }

    // Header is now in layout (secondPage.vue)

    // Form Section
    .form-section {
        margin: rem(12) rem(16);
        background: #fff;
        border-radius: $radius-lg;
        box-shadow: $shadow-sm;
        overflow: hidden;
    }

    .form-group {
        padding: rem(16);
        border-bottom: rem(1) solid $color-border-light;

        &:last-child {
            border-bottom: none;
        }

        &-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .form-label {
        display: block;
        font-size: rem(14);
        color: $color-text-secondary;
        margin-bottom: rem(8);

        .form-group-row & {
            margin-bottom: 0;
        }
    }

    .form-input {
        width: 100%;
        padding: rem(12) 0;
        border: none;
        outline: none;
        font-size: rem(15);
        color: $color-text-primary;
        background: transparent;

        &::placeholder {
            color: $color-text-placeholder;
        }
    }

    .form-textarea {
        resize: none;
        line-height: 1.5;
    }

    .phone-input-wrapper {
        display: flex;
        align-items: center;
        border-bottom: rem(1) solid $color-border-light;
        padding-bottom: rem(12);

        .country-code {
            font-size: rem(15);
            color: $color-text-secondary;
            margin-right: rem(12);
            padding-right: rem(12);
            border-right: rem(1) solid $color-border-light;
        }

        .form-input {
            flex: 1;
            padding: 0;
        }
    }

    // Toggle Switch
    .toggle-wrapper {
        position: relative;
        display: inline-block;
        width: rem(50);
        height: rem(28);
    }

    .toggle-input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $color-border;
        transition: 0.3s;
        border-radius: rem(28);

        &::before {
            position: absolute;
            content: "";
            height: rem(22);
            width: rem(22);
            left: rem(3);
            bottom: rem(3);
            background-color: #fff;
            transition: 0.3s;
            border-radius: 50%;
            box-shadow: $shadow-xs;
        }
    }

    .toggle-input:checked + .toggle-slider {
        background-color: $color-primary;
    }

    .toggle-input:checked + .toggle-slider::before {
        transform: translateX(calc(rem(50) - rem(28)));
    }


</style>
