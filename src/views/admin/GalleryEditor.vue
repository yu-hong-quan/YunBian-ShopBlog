<template>
  <div class="gallery-editor">
    <LoadingScreen :is-loading="isLoading" />
    
    <div class="editor-container" :class="{ 'content-loaded': !isLoading }">
      <!-- 顶部操作栏 -->
      <div class="editor-header">
        <div class="header-left">
          <button class="btn btn-icon" @click="$router.back()">
            <svg viewBox="0 0 24 24" class="icon">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h2>{{ isEdit ? '编辑图集' : '新建图集' }}</h2>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" @click="$router.back()">取消</button>
          <button class="btn btn-primary" @click="handleSubmit">
            {{ isSubmitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>

      <!-- 编辑表单 -->
      <div class="editor-form">
        <div class="form-grid">
          <div class="form-group">
            <label>标题</label>
            <input 
              type="text" 
              v-model="formData.title"
              placeholder="请输入图集标题"
            >
          </div>

          <div class="form-group">
            <label>分类</label>
            <div class="category-selector">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="category-item"
                :class="{ 
                  'active': formData.category === category.id,
                  'dark': isDark
                }"
                @click="formData.category = category.id"
              >
                <div class="category-icon">
                  <svg v-if="category.id === 'nature'" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14 6l-3.75 5 2.85 3.8-1.6 1.2L7 10l-6 8h22L14 6z"/>
                  </svg>
                  <svg v-else-if="category.id === 'city'" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21 21H3V3h18v18zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <svg v-else-if="category.id === 'people'" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z"/>
                  </svg>
                </div>
                <span class="category-name">{{ category.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>描述</label>
          <textarea
            v-model="formData.description"
            placeholder="请输入图集描述"
            rows="4"
          ></textarea>
        </div>

        <!-- 图片上传区域 -->
        <div class="image-upload">
          <div class="section-header">
            <label>图片列表</label>
            <span class="image-count">{{ formData.images.length }} 张图片</span>
          </div>
          
          <div class="upload-grid">
            <!-- 上传按钮 -->
            <div class="upload-btn" @click="triggerFileInput">
              <svg viewBox="0 0 24 24" class="upload-icon">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span>添加图片</span>
              <input 
                type="file"
                ref="fileInput"
                class="file-input"
                accept="image/*"
                multiple
                @change="handleFileUpload"
              >
            </div>

            <!-- 上传中的图片项 -->
            <div 
              v-for="(upload, index) in uploadQueue" 
              :key="'upload-' + index"
              class="image-item uploading"
            >
              <div class="upload-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    :style="{ width: upload.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-text">{{ upload.progress }}%</span>
              </div>
            </div>

            <!-- 图片列表 -->
            <div 
              v-for="(image, index) in formData.images" 
              :key="index"
              class="image-item"
            >
              <img :src="image.url" :alt="image.caption">
              <div class="image-overlay">
                <input 
                  type="text"
                  v-model="image.caption"
                  placeholder="添加图片说明"
                >
                <button 
                  class="btn-delete"
                  @click="removeImage(index)"
                >
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'
import LoadingScreen from '@/components/common/LoadingScreen.vue'

const route = useRoute()
const router = useRouter()
const { isDark } = useTheme()
const { showToast } = useToast()

const isLoading = ref(true)
const isEdit = ref(false)

// 表单数据
const formData = ref({
  title: '',
  description: '',
  category: '',
  images: [] as Array<{url: string, caption: string}>
})

// 分类数据
const categories = ref([
  { id: 'nature', name: '自然风光' },
  { id: 'city', name: '城市建筑' },
  { id: 'people', name: '人物写真' },
  { id: 'life', name: '生活随拍' }
])

// 文件上传相关
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

interface UploadItem {
  file: File
  progress: number
}

// 上传队列
const uploadQueue = ref<UploadItem[]>([])

// 模拟文件上传
const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  for (const file of Array.from(files)) {
    const uploadItem: UploadItem = {
      file,
      progress: 0
    }
    uploadQueue.value.push(uploadItem)
    
    try {
      const url = await simulateFileUpload(file, (progress) => {
        const index = uploadQueue.value.findIndex(item => item.file === file)
        if (index !== -1) {
          uploadQueue.value[index].progress = progress
        }
      })

      // 上传完成后添加到图片列表
      formData.value.images.push({
        url,
        caption: ''
      })

      // 从上传队列中移除
      const index = uploadQueue.value.findIndex(item => item.file === file)
      if (index !== -1) {
        uploadQueue.value.splice(index, 1)
      }

    } catch (error) {
      showToast('图片上传失败', 'error')
      const index = uploadQueue.value.findIndex(item => item.file === file)
      if (index !== -1) {
        uploadQueue.value.splice(index, 1)
      }
    }
  }
  
  // 清空文件输入
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 模拟文件上传过程
const simulateFileUpload = (file: File, onProgress: (progress: number) => void): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    let progress = 0
    
    const simulateProgress = setInterval(() => {
      progress += Math.random() * 30
      if (progress > 100) progress = 100
      onProgress(Math.floor(progress))
      
      if (progress === 100) {
        clearInterval(simulateProgress)
      }
    }, 500)

    reader.onload = (e) => {
      // 模拟网络延迟
      setTimeout(() => {
        resolve(e.target?.result as string)
      }, 1000)
    }

    reader.readAsDataURL(file)
  })
}

const removeImage = (index: number) => {
  formData.value.images.splice(index, 1)
}

const editCaption = (index: number) => {
  // 实现编辑说明的逻辑
}

const handleSubmit = async () => {
  try {
    // 这里添加实际的保存逻辑
    await saveGallery(formData.value)
    showToast('保存成功', 'success')
    router.push('/gallery')
  } catch (error) {
    showToast('保存失败', 'error')
  }
}

// 模拟保存图集
const saveGallery = async (data: any) => {
  console.log('保存图集:', data)
  return Promise.resolve()
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    // 加载现有图集数据
    loadGalleryData(id)
  }
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

// 模拟加载图集数据
const loadGalleryData = async (id: string) => {
  // 这里添加实际的数据加载逻辑
}
</script>

<style scoped>
.gallery-editor {
  min-height: 100vh;
  background: var(--color-background);
}

.editor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.editor-container.content-loaded {
  opacity: 1;
  transform: translateY(0);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-icon {
  padding: 0.5rem;
  background: none;
  color: var(--color-text);
}

.btn-icon:hover {
  background: var(--color-surface);
}

.icon {
  width: 24px;
  height: 24px;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
}

.btn-secondary:hover {
  background: var(--color-surface-dark);
}

.actions {
  display: flex;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

input,
textarea,
select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.image-count {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.upload-btn {
  height: 200px;
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--color-surface);
  gap: 0.5rem;
}

.upload-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.upload-icon {
  width: 32px;
  height: 32px;
}

.file-input {
  display: none;
}

.image-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  gap: 0.5rem;
}

.image-overlay input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 0.8rem;
}

.btn-delete {
  background: rgba(220, 53, 69, 0.8);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: rgb(220, 53, 69);
}

.btn-delete svg {
  width: 20px;
  height: 20px;
}

/* 暗色主题适配 */
:root.dark .gallery-editor {
  background: var(--color-background-dark);
}

:root.dark .btn-secondary {
  background: var(--color-surface-dark);
}

:root.dark input,
:root.dark textarea,
:root.dark select {
  background: var(--color-surface-dark);
  border-color: var(--color-border-dark);
}

:root.dark .upload-btn {
  background: var(--color-surface-dark);
  border-color: var(--color-border-dark);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-container {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .upload-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .image-item {
    height: 150px;
  }
}

/* select 组件的主题色适配 */
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1em;
  padding-right: 2.5rem;
  color: var(--color-text);
  background-color: var(--color-surface);
}

/* 下拉框选项样式 */
select option {
  padding: 0.8rem;
  background: var(--color-surface);
  color: var(--color-text);
}

/* 暗色主题适配 */
:root.dark select {
  background-color: var(--color-surface-dark);
  color: var(--color-text-dark);
  border-color: var(--color-border-dark);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
}

/* 确保 option 在暗色主题下的样式 */
:root.dark select option {
  background-color: var(--color-surface-dark);
  color: var(--color-text-dark);
}

/* 选中和悬停状态 */
select option:checked,
select option:hover {
  background: var(--color-primary);
  color: white;
}

/* Firefox 特定样式 */
@-moz-document url-prefix() {
  select {
    color: var(--color-text);
    background-color: var(--color-surface);
  }

  :root.dark select {
    color: var(--color-text-dark);
    background-color: var(--color-surface-dark);
  }

  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 var(--color-text);
  }

  :root.dark select:-moz-focusring {
    text-shadow: 0 0 0 var(--color-text-dark);
  }
}

/* 移除 !important */
select option:hover,
select option:focus,
select option:active,
select option:checked {
  background: var(--color-primary);
  color: white;
}

:root.dark select option:hover,
:root.dark select option:focus,
:root.dark select option:active,
:root.dark select option:checked {
  background: var(--color-primary);
  color: white;
}

/* 上传进度样式 */
.uploading {
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.upload-progress {
  width: 100%;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: var(--color-text);
}

:root.dark .uploading {
  background: var(--color-surface-dark);
}

:root.dark .progress-bar {
  background: var(--color-border-dark);
}

:root.dark .progress-text {
  color: var(--color-text-dark);
}

.category-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.category-item.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.category-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.category-icon svg {
  width: 100%;
  height: 100%;
}

.category-name {
  font-size: 0.9rem;
  text-align: center;
}

/* 暗色主题适配 */
:root.dark .category-item {
  background: var(--color-surface-dark);
  border-color: var(--color-border-dark);
}

:root.dark .category-item:hover {
  border-color: var(--color-primary);
}

:root.dark .category-item.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-selector {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .category-item {
    padding: 0.75rem;
  }

  .category-icon {
    width: 24px;
    height: 24px;
  }

  .category-name {
    font-size: 0.8rem;
  }
}
</style> 