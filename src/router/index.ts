import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { keepAlive: true }
    },
    {
      path: '/articles',
      name: 'Articles',
      component: () => import('@/views/Articles.vue'),
      meta: { keepAlive: true }
    },
    {
      path: '/gallery',
      name: 'Gallery',
      component: () => import('@/views/Gallery.vue'),
      meta: { keepAlive: true }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About.vue')
    },
    {
      path: '/admin/login',
      name: 'Login',
      component: () => import('@/views/admin/Login.vue')
    },
    {
      path: '/admin/editor',
      name: 'Editor',
      component: () => import('@/views/admin/Editor.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const { checkAuth } = useAuth()
  
  if (to.meta.requiresAuth && !checkAuth()) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router 