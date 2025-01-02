<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>管理控制台</h1>
      <div class="user-info">
        <span>{{ username }}</span>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </div>

    <div class="menu-grid">
      <!-- 文章管理卡片 -->
      <div class="menu-card" @click="navigateTo('Editor')">
        <div class="card-icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M14.06 9l.94.94L5.92 19H5v-.92L14.06 9m3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
          </svg>
        </div>
        <h3>文章管理</h3>
        <p>发布和编辑文章内容</p>
      </div>

      <!-- 图集管理卡片 -->
      <div class="menu-card" @click="navigateTo('GalleryEditor')">
        <div class="card-icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>
          </svg>
        </div>
        <h3>图集管理</h3>
        <p>管理图片和图集内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { logout, username } = useAuth()
const { showToast } = useToast()

const navigateTo = (route: string) => {
  router.push({ name: route })
}

const handleLogout = async () => {
  try {
    await logout()
    showToast('已退出登录', 'success')
    router.push('/admin/login')
  } catch (error) {
    showToast('退出失败', 'error')
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: var(--color-danger);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: var(--color-danger-dark);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.menu-card {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--color-border);
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.card-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  color: var(--color-primary);
}

.card-icon svg {
  width: 100%;
  height: 100%;
}

.menu-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: var(--color-text);
}

.menu-card p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

/* 暗色主题适配 */
:root.dark .menu-card {
  background: var(--color-surface-dark);
  border-color: var(--color-border-dark);
}

:root.dark .menu-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .menu-card {
    padding: 1.5rem;
  }
}
</style> 