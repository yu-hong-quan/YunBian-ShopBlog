<template>
  <div class="gallery-manager">
    <!-- 移除本地 Toast 组件 -->
    <!-- <Toast :visible="showToast" :message="toastMessage" :type="toastType" /> -->

    <!-- 顶部操作栏 -->
    <div class="top-actions" ref="topActions">
      <h2>{{ isEditing ? '编辑图集' : '图集管理' }}</h2>
      <button 
        v-if="!isEditing"
        class="create-btn"
        @click="showCreateForm = !showCreateForm"
      >
        {{ showCreateForm ? '取消创建' : '新建图集' }}
      </button>
    </div>

    <!-- 编辑表单 -->
    <div 
      v-if="isEditing"
      class="edit-form"
    >
      <div class="form-body">
        <div class="form-group">
          <label>标题</label>
          <input 
            v-model="editingGallery.title" 
            type="text" 
            placeholder="请输入图集标题"
          >
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea 
            v-model="editingGallery.description" 
            placeholder="请输入图集描述"
            rows="3"
          ></textarea>
        </div>
        <div class="form-group">
          <label>封面图片</label>
          <ImageUploader v-model="editingGallery.cover" />
        </div>
        <div class="form-group">
          <label>分类</label>
          <select v-model="editingGallery.category">
            <option value="">请选择分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="form-actions">
          <button 
            class="cancel-btn"
            @click="cancelEdit"
          >
            取消
          </button>
          <button 
            class="submit-btn"
            :disabled="!isEditFormValid"
            @click="saveEdit"
          >
            保存修改
          </button>
        </div>
      </div>
    </div>

    <!-- 新建图集表单 -->
    <div 
      v-if="showCreateForm"
      class="create-form"
    >
      <div class="form-header">
        <h3>新建图集</h3>
      </div>
      <div class="form-body">
        <div class="form-group">
          <label>标题</label>
          <input 
            v-model="newGallery.title" 
            type="text" 
            placeholder="请输入图集标题"
          >
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea 
            v-model="newGallery.description" 
            placeholder="请输入图集描述"
            rows="3"
          ></textarea>
        </div>
        <div class="form-group">
          <label>封面图片</label>
          <ImageUploader v-model="newGallery.cover" :max-images="5" />
        </div>
        <div class="form-group">
          <label>分类</label>
          <select v-model="newGallery.category">
            <option value="">请选择分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="form-actions">
          <button 
            class="submit-btn"
            :disabled="!isFormValid"
            @click="createGallery"
          >
            创建图集
          </button>
        </div>
      </div>
    </div>

    <!-- 图集列表 -->
    <div class="gallery-list">
      <div 
        v-for="gallery in galleries" 
        :key="gallery.id" 
        class="gallery-card"
      >
        <div class="gallery-cover">
          <img :src="gallery.cover" :alt="gallery.title">
        </div>
        <div class="gallery-info">
          <h3>{{ gallery.title }}</h3>
          <p>{{ gallery.description }}</p>
          <div class="gallery-meta">
            <span>{{ gallery.category }}</span>
            <span>{{ gallery.imageCount }}张图片</span>
          </div>
        </div>
        <div class="gallery-actions">
          <button @click="editGallery(gallery)">编辑</button>
          <button @click="deleteGallery(gallery.id)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, nextTick } from 'vue'
import ImageUploader from '@/components/common/ImageUploader.vue'
import { useAuth } from '@/composables/useAuth'
// 移除 Toast 组件导入
// import Toast from '@/components/common/Toast.vue'
import { useToast } from '@/composables/useToast'

const { isAuthenticated } = useAuth()
const { toast } = useToast()

// 控制新建表单的显示
const showCreateForm = ref(false)

// 新建图集的表单数据
const newGallery = reactive({
  title: '',
  description: '',
  cover: [] as string[],
  category: '',
})

// 分类选项
const categories = ref([
  '风景',
  '人像',
  '街拍',
  '建筑',
  '生活',
  '其他'
])

// 表单验证
const isFormValid = computed(() => {
  return newGallery.title.trim() && 
         newGallery.description.trim() && 
         newGallery.cover.length > 0 &&
         newGallery.category
})

// 图集列表数据
const galleries = ref([
  {
    id: 1,
    title: '城市风光',
    description: '记录城市的美丽瞬间，展现都市的繁华与宁静。',
    cover: 'https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: '风景',
    imageCount: 15
  }
])

// 编辑状态控制
const isEditing = ref(false)
const editingGallery = ref<any>(null)

// 编辑表单验证
const isEditFormValid = computed(() => {
  if (!editingGallery.value) return false
  return editingGallery.value.title.trim() && 
         editingGallery.value.description.trim() && 
         editingGallery.value.cover && 
         editingGallery.value.category
})

const topActions = ref<HTMLElement | null>(null)

// 开始编辑
const editGallery = (gallery: any) => {
  isEditing.value = true
  showCreateForm.value = false
  editingGallery.value = { ...gallery }
  
  // 滚动到标题位置
  nextTick(() => {
    if (topActions.value) {
      topActions.value.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  editingGallery.value = null
}

// 保存编辑
const saveEdit = async () => {
  try {
    if (!isEditFormValid.value) return

    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = galleries.value.findIndex(g => g.id === editingGallery.value.id)
    if (index !== -1) {
      galleries.value[index] = { ...editingGallery.value }
    }

    isEditing.value = false
    editingGallery.value = null

    // 使用全局 toast
    toast('图集更新成功！')

  } catch (error) {
    console.error('更新图集失败:', error)
    toast('更新图集失败，请重试', 'error')
  }
}

// 创建图集
const createGallery = async () => {
  try {
    if (!isFormValid.value) return

    const newGalleryData = {
      ...newGallery,
      id: Date.now(),
      imageCount: 0,
      createdAt: new Date().toISOString()
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    
    galleries.value.unshift(newGalleryData)
    resetForm()
    showCreateForm.value = false

    // 使用全局 toast
    toast('图集创建成功！')

  } catch (error) {
    console.error('创建图集失败:', error)
    toast('创建图集失败，请重试', 'error')
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(newGallery, {
    title: '',
    description: '',
    cover: [],
    category: ''
  })
}

// 删除图集
const deleteGallery = async (id: number) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    galleries.value = galleries.value.filter(gallery => gallery.id !== id)
    
    // 使用全局 toast
    toast('图集删除成功！')
    
  } catch (error) {
    console.error('删除图集失败:', error)
    toast('删除图集失败，请重试', 'error')
  }
}

// 获取图集列表
const fetchGalleries = async () => {
  try {
    // 这里添加获取图集列表的 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 使用真实的图片数据
    galleries.value = [
      {
        id: 1,
        title: '城市风光',
        description: '记录城市的美丽瞬间，展现都市的繁华与宁静，捕捉光影交错的瞬间。',
        cover: 'https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: '风景',
        imageCount: 15
      },
      {
        id: 2,
        title: '自然光影',
        description: '大自然的鬼斧神工，阳光穿透云层的瞬间，记录最美的自然景观。',
        cover: 'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: '风景',
        imageCount: 8
      },
      {
        id: 3,
        title: '街头掠影',
        description: '城市街头的人文故事，记录生活中的精彩瞬间，展现都市生活的多样性。',
        cover: 'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: '街拍',
        imageCount: 12
      },
      {
        id: 4,
        title: '建筑之美',
        description: '现代建筑与古典建筑的完美融合，展现建筑艺术的独特魅力。',
        cover: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: '建筑',
        imageCount: 10
      },
      {
        id: 5,
        title: '人像摄影',
        description: '捕捉人物最真实的表情，展现不同人物的独特魅力与故事。',
        cover: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: '人像',
        imageCount: 20
      },
      {
        id: 6,
        title: '生活随拍',
        description: '记录生活中的温馨时刻，分享日常生活中的美好瞬间。',
        cover: 'https://images.pexels.com/photos/1854897/pexels-photo-1854897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        category: '生活',
        imageCount: 16
      }
    ]
  } catch (error) {
    console.error('获取图集列表失败:', error)
  }
}

// 初始化
fetchGalleries()
</script>

<style scoped>
.gallery-manager {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-btn {
  padding: 0.6rem 1.2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-btn:hover {
  background: var(--color-primary-dark);
}

/* 创建表单样式 */
.create-form {
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
  overflow: hidden;
}

.form-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-variant);
}

.form-header h3 {
  margin: 0;
  color: var(--color-text);
}

.form-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
.form-group input,.form-group textarea{
  width:calc(100% - 1.5rem);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn {
  padding: 0.8rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:disabled {
  background: var(--color-border);
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  background: var(--color-primary-dark);
}

/* 图集列表样式 */
.gallery-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.gallery-card {
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.2s ease;
}

.gallery-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-cover {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.gallery-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-info {
  padding: 1rem;
}

.gallery-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
}

.gallery-info p {
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.gallery-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.gallery-actions {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 1rem;
}

.gallery-actions button {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.gallery-actions button:hover {
  background: var(--color-surface-variant);
}

.gallery-actions .delete-btn {
  color: var(--color-error);
  border-color: var(--color-error);
}

.gallery-actions .delete-btn:hover {
  background: rgba(var(--color-error-rgb), 0.1);
}

/* 编辑表单样式 */
.edit-form {
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
  overflow: hidden;
}

.cancel-btn {
  padding: 0.8rem 2rem;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: var(--color-surface-variant);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .gallery-manager {
    padding: 1rem;
  }

  .form-body {
    padding: 1rem;
  }

  .gallery-list {
    grid-template-columns: 1fr;
  }

  .edit-form {
    margin: 1rem 0;
  }

  .cancel-btn,
  .submit-btn {
    padding: 0.6rem 1.5rem;
  }
}
</style> 