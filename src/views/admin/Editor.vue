<template>
  <div class="article-editor">
    <div class="editor-header">
      <h2>{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
      <div class="header-actions">
        <button class="preview-btn" @click="togglePreview">
          {{ isPreview ? '编辑' : '预览' }}
        </button>
        <button 
          class="publish-btn" 
          @click="handlePublish"
          :disabled="publishing"
        >
          {{ publishing ? '发布中...' : '发布' }}
        </button>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </div>

    <div class="editor-content">
      <template v-if="!isPreview">
        <div class="form-group">
          <input 
            type="text" 
            v-model="article.title"
            placeholder="文章标题"
          >
        </div>
        
        <div class="form-group">
          <div class="tags-input">
            <input 
              type="text" 
              v-model="tagInput"
              @keydown.enter="addTag"
              placeholder="添加标签（回车确认）"
            >
            <div class="tags-list">
              <span 
                v-for="tag in article.tags" 
                :key="tag"
                class="tag"
              >
                {{ tag }}
                <button @click="removeTag(tag)">×</button>
              </span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <select v-model="article.category">
            <option value="">选择分类</option>
            <option 
              v-for="category in categories" 
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <div class="form-group editor-container">
          <mavon-editor
            v-model="article.content"
            :toolbars="toolbars"
            :boxShadow="false"
            placeholder="开始写作..."
            :style="{ height: '640px' }"
            @change="handleEditorChange"
          />
        </div>
      </template>

      <div v-else class="preview-content">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <div class="tags-list preview-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
          <span class="category" v-if="article.category">{{ article.category }}</span>
        </div>
        <div class="markdown-content" v-html="compiledMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { checkAuth, logout } = useAuth()

// 初始化文章数据
const article = ref({
  title: '',
  content: '# 开始写作\n\n在这里输入文章内容...',
  tags: [] as string[],
  category: ''
})

const isEdit = ref(false)
const isPreview = ref(false)
const publishing = ref(false)
const tagInput = ref('')

// mavon-editor 工具栏配置
const toolbars = {
  bold: true, // 粗体
  italic: true, // 斜体
  header: true, // 标题
  underline: true, // 下划线
  strikethrough: true, // 中划线
  mark: true, // 标记
  superscript: true, // 上角标
  subscript: true, // 下角标
  quote: true, // 引用
  ol: true, // 有序列表
  ul: true, // 无序列表
  link: true, // 链接
  imagelink: true, // 图片链接
  code: true, // code
  table: true, // 表格
  fullscreen: true, // 全��编辑
  readmodel: true, // 沉浸式阅读
  htmlcode: true, // 展示html源码
  help: true, // 帮助
  /* 1.4.2 新增 */
  undo: true, // 上一步
  redo: true, // 下一步
  trash: true, // 清空
  save: true, // 保存（触发events中的save事件）
  /* 1.4.4 新增 */
  navigation: true, // 导航目录
  /* 2.1.8 新增 */
  alignleft: true, // 左对齐
  aligncenter: true, // 居中
  alignright: true, // 右对齐
  /* 2.2.1 新增 */
  subfield: true, // 单双栏模式
  preview: true, // 预览
}

const categories = [
  '技术',
  '生活',
  '随笔',
  '前端',
  '后端',
  '设计'
]

// 编译后的 Markdown 内容
const compiledMarkdown = computed(() => {
  return article.value.content
})

// 检查权限
onMounted(async () => {
  if (!checkAuth()) {
    router.push('/admin/login')
    return
  }

  // 如果有 id 参数，加载文章数据
  const articleId = route.query.id
  if (articleId) {
    isEdit.value = true
    try {
      // 这里调用获取文章详情的 API
      // const response = await fetchArticle(articleId)
      // article.value = response.data
      console.log('加载文章:', articleId)
    } catch (error) {
      alert('加载文章失败')
      router.push('/articles')
    }
  }
})

const togglePreview = () => {
  isPreview.value = !isPreview.value
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !article.value.tags.includes(tag)) {
    article.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  article.value.tags = article.value.tags.filter(t => t !== tag)
}

const handlePublish = async () => {
  if (!article.value.title || !article.value.content) {
    alert('请填写文章标题和内容')
    return
  }

  publishing.value = true
  try {
    // 根据是否是编辑模式调用不同的 API
    if (isEdit.value) {
      // await updateArticle(route.query.id, article.value)
      console.log('更新文章:', article.value)
    } else {
      // await createArticle(article.value)
      console.log('发布文章:', article.value)
    }
    alert(isEdit.value ? '更新成功！' : '发布成功！')
    router.push('/articles')
  } catch (error) {
    alert(isEdit.value ? '更新失败，请重试' : '发布失败，请重试')
  } finally {
    publishing.value = false
  }
}

const handleLogout = () => {
  logout()
}

const handleEditorChange = (value: string, render: string) => {
  article.value.content = value
}
</script>

<style scoped>
.article-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.editor-content {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

/* 统一输入控件基础样式 */
input,
textarea,
select {
  width: calc(100% - 2.1rem);
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.3s ease;
}
select{
  width: calc(100%);
}

/* 输入框和文本域焦点状态 */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
}

/* 输入框和文本域悬停状态 */
input:hover,
textarea:hover,
select:hover {
  border-color: var(--color-primary);
}

/* 文本域特殊样式 */
textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
}

/* 选择器特殊样式 */
select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

/* 选择器选项样式 */
select option {
  padding: 0.8rem;
  background: var(--color-background);
  color: var(--color-text);
}

/* 禁用状态样式 */
input:disabled,
textarea:disabled,
select:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: rgba(var(--color-border-rgb), 0.1);
}

/* 占位符文本样式 */
input::placeholder,
textarea::placeholder {
  color: rgba(var(--color-text-rgb), 0.5);
}

/* 标签输入框特殊样式 */
.tags-input input {
  margin-bottom: 0.5rem;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(var(--color-text-rgb), 0.4);
  }

  input:disabled,
  textarea:disabled,
  select:disabled {
    background: rgba(var(--color-surface-rgb), 0.2);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  input,
  textarea,
  select {
    font-size: 16px; /* 防止 iOS 缩放 */
    padding: 0.7rem 0.9rem;
  }

  select {
    padding-right: 2.2rem;
  }
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  border-radius: 15px;
  font-size: 0.9rem;
}

.tag button {
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1.1rem;
}

button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-btn {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.publish-btn {
  background: var(--color-primary);
  color: white;
}

.logout-btn {
  background: #dc3545;
  color: white;
}

.preview-content {
  padding: 2rem;
}

.preview-content h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: var(--color-text);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.preview-content .tag {
  display: inline-flex;
  padding: 0.3rem 0.8rem;
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  border-radius: 15px;
  font-size: 0.9rem;
  margin-right: 0;
}

.preview-content .category {
  display: inline-flex;
  padding: 0.3rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 15px;
  font-size: 0.9rem;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .article-editor {
    padding: 1rem;
  }

  .editor-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .editor-content {
    padding: 1rem;
  }

  .preview-content {
    padding: 1rem;
  }

  .preview-content h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .article-meta {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
}

/* 预览模式的标签样式 */
.preview-tags {
  margin: 0;
}

.editor-container {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
}

.editor-container :deep(.v-note-wrapper) {
  z-index: 1;
  background-color: var(--color-background) !important;
}

.editor-container :deep(.v-note-panel .v-note-show) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-panel .v-note-edit) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-panel .v-note-show .v-show-content) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-panel .v-note-show .v-show-content h1),
.editor-container :deep(.v-note-panel .v-note-show .v-show-content h2),
.editor-container :deep(.v-note-panel .v-note-show .v-show-content h3),
.editor-container :deep(.v-note-panel .v-note-show .v-show-content h4),
.editor-container :deep(.v-note-panel .v-note-show .v-show-content h5),
.editor-container :deep(.v-note-panel .v-note-show .v-show-content h6),
.editor-container :deep(.v-note-panel .v-note-show .v-show-content p),
.editor-container :deep(.v-note-panel .v-note-show .v-show-content li) {
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-panel .v-note-show .v-show-content code) {
  background-color: var(--color-surface) !important;
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-panel .v-note-show .v-show-content pre) {
  background-color: var(--color-surface) !important;
}

.editor-container :deep(.v-note-panel .v-note-show .v-show-content blockquote) {
  border-left: 4px solid var(--color-border) !important;
  color: rgba(var(--color-text-rgb), 0.8) !important;
  background-color: var(--color-surface) !important;
}

/* 适配暗色模式 */
@media (prefers-color-scheme: dark) {
  .editor-container :deep(.v-note-wrapper) {
    background: var(--color-background);
  }

  .editor-container :deep(.v-note-panel) {
    background: var(--color-background);
  }

  .editor-container :deep(.v-note-wrapper.theme-dark) {
    background: var(--color-background);
  }

  .markdown-content :deep(h1),
  .markdown-content :deep(h2),
  .markdown-content :deep(h3),
  .markdown-content :deep(h4),
  .markdown-content :deep(h5),
  .markdown-content :deep(h6) {
    color: var(--color-text);
  }

  .markdown-content :deep(p) {
    color: var(--color-text);
  }

  .markdown-content :deep(code) {
    background: var(--color-surface);
  }

  .markdown-content :deep(pre) {
    background: var(--color-surface);
  }

  .markdown-content :deep(a) {
    color: var(--color-primary);
  }

  .markdown-content :deep(a:hover) {
    text-decoration: underline;
  }

  .markdown-content :deep(img) {
    border-radius: 8px;
  }

  .markdown-content :deep(blockquote) {
    border-left: 4px solid var(--color-border);
    color: rgba(var(--color-text-rgb), 0.8);
  }

  .markdown-content :deep(table) {
    border: 1px solid var(--color-border);
  }

  .markdown-content :deep(th),
  .markdown-content :deep(td) {
    border: 1px solid var(--color-border);
  }

  .markdown-content :deep(th) {
    background: var(--color-surface);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .editor-container :deep(.v-note-wrapper) {
    height: 480px;
  }
}

/* 编辑器主题适配 */
.editor-container :deep(.v-note-wrapper) {
  z-index: 1;
  background-color: var(--color-background) !important;
}

/* 工具栏适配 */
.editor-container :deep(.v-note-op) {
  background-color: var(--color-surface) !important;
  border-bottom: 1px solid var(--color-border) !important;
}

.editor-container :deep(.v-note-op .op-icon) {
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-op .op-icon:hover) {
  color: var(--color-primary) !important;
}

/* 左侧编辑区域适配 */
.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper) {
  background-color: var(--color-background) !important;
}

.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper textarea) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

/* 分割线适配 */
.editor-container :deep(.v-note-panel .v-note-navigation-wrapper) {
  border-left: 1px solid var(--color-border) !important;
}

/* 右侧预览区域适配 */
.editor-container :deep(.v-note-panel .v-note-show) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

/* 底部状态栏适配 */
.editor-container :deep(.v-note-wrap .v-note-panel .v-note-edit .auto-textarea-wrapper .auto-textarea-block) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

/* 代码块适配 */
.editor-container :deep(.v-note-panel pre) {
  background-color: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
}

.editor-container :deep(.v-note-panel code) {
  color: var(--color-text) !important;
}

/* 导航目录适配 */
.editor-container :deep(.v-note-navigation-wrapper) {
  background-color: var(--color-surface) !important;
  border-left: 1px solid var(--color-border) !important;
}

.editor-container :deep(.v-note-navigation-wrapper .v-note-navigation-title) {
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-navigation-wrapper .v-note-navigation-content) {
  color: var(--color-text) !important;
}

/* 全屏模式适配 */
.editor-container :deep(.v-note-wrapper.fullscreen) {
  position: fixed;
  z-index: 1500 !important; /* 确保在顶部菜单之上 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh !important;
  background-color: var(--color-background) !important;
}

/* 全屏模式下的工具栏适配 */
.editor-container :deep(.v-note-wrapper.fullscreen .v-note-op) {
  position: sticky;
  top: 0;
  z-index: 1501 !important;
}

/* 全屏模式下的编辑区域适配 */
.editor-container :deep(.v-note-wrapper.fullscreen .v-note-panel) {
  height: calc(100vh - 40px) !important; /* 减去工具栏高度 */
}

/* 帮助面板适配 */
.editor-container :deep(.v-note-help-wrapper) {
  background-color: var(--color-surface) !important;
  color: var(--color-text) !important;
  border: 1px solid var(--color-border) !important;
}

/* 工具栏下拉菜单适配 */
.editor-container :deep(.op-image-wrapper),
.editor-container :deep(.op-header-wrapper) {
  background-color: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
}

.editor-container :deep(.op-image-wrapper .op-item),
.editor-container :deep(.op-header-wrapper .op-item) {
  color: var(--color-text) !important;
}

.editor-container :deep(.op-image-wrapper .op-item:hover),
.editor-container :deep(.op-header-wrapper .op-item:hover) {
  background-color: var(--color-primary) !important;
  color: white !important;
}

/* 编辑器输入区域适配 */
.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .v-note-edit-content) {
  background-color: var(--color-background) !important;
}

.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .auto-textarea-wrapper .auto-textarea-input) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

/* 编辑器输入区域的滚动条适配 */
.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .auto-textarea-wrapper .auto-textarea-input::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .auto-textarea-wrapper .auto-textarea-input::-webkit-scrollbar-thumb) {
  background: var(--color-border);
  border-radius: 3px;
}

.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .auto-textarea-wrapper .auto-textarea-input::-webkit-scrollbar-track) {
  background: var(--color-surface);
}

/* 编辑器输入区域的光标颜色适配 */
.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .auto-textarea-wrapper .auto-textarea-input) {
  caret-color: var(--color-text) !important;
}

/* 编辑器输入区域容器适配 */
.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .content-input-wrapper) {
  background-color: var(--color-background) !important;
}

.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .content-input-wrapper textarea) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

/* 编辑器输��区域的滚动条适配 */
.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .content-input-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .content-input-wrapper::-webkit-scrollbar-thumb) {
  background: var(--color-border);
  border-radius: 3px;
}

.editor-container :deep(.v-note-panel .v-note-edit.divarea-wrapper .content-input-wrapper::-webkit-scrollbar-track) {
  background: var(--color-surface);
}

/* 阅读模式适配 */
.editor-container :deep(.v-note-read-model) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-read-model .v-note-read-content) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

/* HTML文本查看模式适配 */
.editor-container :deep(.v-note-html-code) {
  background-color: var(--color-background) !important;
}

.editor-container :deep(.v-note-html-code textarea) {
  background-color: var(--color-surface) !important;
  color: var(--color-text) !important;
  border: 1px solid var(--color-border) !important;
}

/* 关闭按钮适配 */
.editor-container :deep(.v-note-read-model .v-note-read-model-close) {
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-read-model .v-note-read-model-close:hover) {
  color: var(--color-primary) !important;
}

/* 阅读模式工具栏适配 */
.editor-container :deep(.v-note-read-model .v-note-read-model-toolbar) {
  background-color: var(--color-surface) !important;
  border-bottom: 1px solid var(--color-border) !important;
}

.editor-container :deep(.v-note-read-model .v-note-read-model-toolbar .op-icon) {
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-read-model .v-note-read-model-toolbar .op-icon:hover) {
  color: var(--color-primary) !important;
}

/* HTML文本查看模式完整适配 */
.editor-container :deep(.v-note-html-code) {
  background-color: var(--color-background) !important;
}

.editor-container :deep(.v-note-html-code .v-show-html-textarea) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
  border: 1px solid var(--color-border) !important;
}

.editor-container :deep(.v-note-html-code .v-show-html-wrapper) {
  background-color: var(--color-background) !important;
}

.editor-container :deep(.v-note-html-code .v-show-html) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

/* HTML代码编辑器滚动条适配 */
.editor-container :deep(.v-note-html-code .v-show-html-textarea::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

.editor-container :deep(.v-note-html-code .v-show-html-textarea::-webkit-scrollbar-thumb) {
  background: var(--color-border);
  border-radius: 3px;
}

.editor-container :deep(.v-note-html-code .v-show-html-textarea::-webkit-scrollbar-track) {
  background: var(--color-surface);
}

/* HTML内容显示区域适配 */
.editor-container :deep(.v-show-content-html) {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

.editor-container :deep(.v-show-content-html pre) {
  background-color: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
}

.editor-container :deep(.v-show-content-html code) {
  background-color: var(--color-surface) !important;
  color: var(--color-text) !important;
}

.editor-container :deep(.v-show-content-html blockquote) {
  background-color: var(--color-surface) !important;
  border-left: 4px solid var(--color-border) !important;
  color: var(--color-text) !important;
}

.editor-container :deep(.v-show-content-html table) {
  border-color: var(--color-border) !important;
}

.editor-container :deep(.v-show-content-html th),
.editor-container :deep(.v-show-content-html td) {
  border-color: var(--color-border) !important;
}

.editor-container :deep(.v-show-content-html a) {
  color: var(--color-primary) !important;
}

/* mark语法帮助弹窗适配 */
.editor-container :deep(.v-note-mark-help-wrapper) {
  background-color: var(--color-surface) !important;
  color: var(--color-text) !important;
  border: 1px solid var(--color-border) !important;
}

.editor-container :deep(.v-note-mark-help-wrapper .v-note-mark-help-title) {
  color: var(--color-text) !important;
  border-bottom: 1px solid var(--color-border) !important;
}

.editor-container :deep(.v-note-mark-help-wrapper .v-note-mark-help-content) {
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-mark-help-wrapper .v-note-mark-help-close) {
  color: var(--color-text) !important;
}

.editor-container :deep(.v-note-mark-help-wrapper .v-note-mark-help-close:hover) {
  color: var(--color-primary) !important;
}

/* mark语法示例适配 */
.editor-container :deep(.v-note-mark-help-wrapper pre) {
  background-color: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
  color: var(--color-text) !important;
}
</style> 