<template>
  <div class="image-uploader">
    <!-- 图片列表 -->
    <div class="image-list" v-if="modelValue && modelValue.length">
      <div 
        v-for="(image, index) in modelValue" 
        :key="index"
        class="image-item"
      >
        <img :src="image" :alt="`图片${index + 1}`">
        <div class="image-actions">
          <button 
            class="remove-btn" 
            @click.stop="removeImage(index)"
          >
            删除
          </button>
          <button 
            v-if="index > 0"
            class="move-btn" 
            @click.stop="moveImage(index, index - 1)"
          >
            ↑
          </button>
          <button 
            v-if="index < modelValue.length - 1"
            class="move-btn" 
            @click.stop="moveImage(index, index + 1)"
          >
            ↓
          </button>
        </div>
      </div>
    </div>

    <!-- 上传区域 -->
    <div 
      class="upload-area"
      :class="{ 'is-uploading': isUploading }"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      v-show="!maxImagesReached"
    >
      <input 
        ref="fileInput"
        type="file" 
        accept="image/*"
        class="file-input"
        @change="handleFileChange"
        multiple
        hidden
      >
      <div class="upload-content">
        <div class="upload-icon">
          <span class="icon">📤</span>
        </div>
        <div class="upload-text">
          <p>点击或拖拽图片到此处上传</p>
          <p class="upload-hint">
            支持 jpg、png、gif 格式，最大 5MB
            <br>
            已上传 {{ modelValue?.length || 0 }}/{{ maxImages }} 张
          </p>
        </div>
      </div>

      <!-- 上传进度条 -->
      <div v-if="isUploading" class="upload-progress">
        <div class="progress-bar">
          <div 
            class="progress-inner"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
        <span class="progress-text">{{ uploadProgress }}%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string[]
  maxImages?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadProgress = ref(0)

// 默认最大上传数量
const maxImages = props.maxImages || 9

// 是否达到最大上传数量
const maxImagesReached = computed(() => {
  return props.modelValue && props.modelValue.length >= maxImages
})

// 处理文件选择
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    const remainingSlots = maxImages - (props.modelValue?.length || 0)
    const filesToUpload = Array.from(input.files).slice(0, remainingSlots)
    filesToUpload.forEach(file => uploadFile(file))
  }
}

// 处理拖放
const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files?.length) {
    const remainingSlots = maxImages - (props.modelValue?.length || 0)
    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    filesToUpload.forEach(file => uploadFile(file))
  }
}

// 上传文件
const uploadFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过 5MB')
    return
  }

  try {
    isUploading.value = true
    uploadProgress.value = 0

    const simulateProgress = () => {
      const interval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += Math.random() * 10
        }
      }, 200)
      return () => clearInterval(interval)
    }

    const stopProgress = simulateProgress()

    const reader = new FileReader()
    reader.onload = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      uploadProgress.value = 100
      stopProgress()

      const newImages = [...(props.modelValue || []), reader.result as string]
      emit('update:modelValue', newImages)
      
      setTimeout(() => {
        isUploading.value = false
        uploadProgress.value = 0
      }, 500)
    }

    reader.readAsDataURL(file)

  } catch (error) {
    console.error('上传失败:', error)
    isUploading.value = false
    uploadProgress.value = 0
    alert('上传失败，请重试')
  }
}

// 移除图片
const removeImage = (index: number) => {
  const newImages = [...props.modelValue]
  newImages.splice(index, 1)
  emit('update:modelValue', newImages)
}

// 移动图片位置
const moveImage = (fromIndex: number, toIndex: number) => {
  const newImages = [...props.modelValue]
  const [movedImage] = newImages.splice(fromIndex, 1)
  newImages.splice(toIndex, 0, movedImage)
  emit('update:modelValue', newImages)
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-area {
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-hover);
}

.upload-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  padding: 2rem;
}

.file-input {
  display: none;
}

.upload-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.upload-text {
  text-align: center;
  color: var(--color-text-secondary);
}

.upload-hint {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

.preview {
  position: relative;
  width: 100%;
  height: 200px;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.preview-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview:hover .preview-mask {
  opacity: 1;
}

.remove-btn {
  padding: 0.5rem 1rem;
  background: var(--color-error);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: var(--color-error-dark);
}

/* 上传进度条样式 */
.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: rgba(var(--color-surface-rgb), 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--color-text);
  min-width: 3em;
  text-align: right;
}

.is-uploading {
  pointer-events: none;
  opacity: 0.8;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .upload-content {
    padding: 1rem;
  }

  .upload-icon {
    font-size: 2rem;
  }

  .upload-text {
    font-size: 0.9rem;
  }
}

/* 图片列表样式 */
.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.move-btn {
  padding: 0.3rem 0.6rem;
  background: var(--color-surface);
  border: none;
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.move-btn:hover {
  background: var(--color-surface-hover);
}
</style> 