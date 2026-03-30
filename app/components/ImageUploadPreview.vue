<template>
    <van-popup v-model:show="visible" position="center" round :close-on-click-overlay="false">
        <div class="image-preview-popup">
            <van-image :src="previewUrl" fit="contain" class="preview-image" @click="handlePreview" />
            <div class="btn-group">
                <van-button type="default" @click="handleCancel">{{ $lang('取消') }}</van-button>
                <van-button type="primary" :loading="uploading" @click="handleSend">{{ $lang('发送') }}</van-button>
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, watch } from 'vue'
import { showImagePreview } from 'vant'
import imageCompression from 'browser-image-compression'
import { uploadImage } from '~/api/member'

const props = defineProps({
    modelValue: Boolean,
    file: File
})

const emit = defineEmits(['update:modelValue', 'success', 'cancel'])

const visible = ref(false)
const previewUrl = ref('')
const uploading = ref(false)

watch(() => props.modelValue, (val) => {
    visible.value = val
    if (val && props.file) {
        previewUrl.value = URL.createObjectURL(props.file)
    }
})

watch(visible, (val) => {
    emit('update:modelValue', val)
})

const handlePreview = () => {
    showImagePreview({ images: [previewUrl.value] ,closeable:true})
}

const handleCancel = () => {
    visible.value = false
    previewUrl.value = ''
    emit('cancel')
}

const handleSend = async () => {
    if (!props.file) return
    uploading.value = true
    try {
        let fileToUpload = props.file
        // 大于1M则压缩
        if (props.file.size > 1024 * 1024) {
            const compressedBlob = await imageCompression(props.file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920
            })
            // Blob 转 File，保留原文件名
            fileToUpload = new File([compressedBlob], props.file.name, { type: compressedBlob.type })
        }
        const formData = new FormData()
        formData.append('file', fileToUpload)
        const res = await uploadImage(formData)
        if (res.success) {
            emit('success', res.data)
        } else {
            visible.value = false
            previewUrl.value = ''
            emit('cancel')
        }
    } finally {
        uploading.value = false
        visible.value = false
        previewUrl.value = ''
    }
}
</script>

<style lang="scss" scoped>
.image-preview-popup {
    padding: rem(20);
    width: rem(300);
}

.preview-image {
    width: 100%;
    height: rem(200);
    border-radius: rem(8);
    overflow: hidden;
}

.btn-group {
    display: flex;
    gap: rem(12);
    margin-top: rem(16);

    :deep(.van-button) {
        flex: 1;
    }
}
</style>
