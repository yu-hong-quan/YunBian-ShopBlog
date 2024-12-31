<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-brand">
          <h2 class="footer-logo">云边</h2>
          <p class="footer-desc">分享生活，记录点滴</p>
        </div>
        
        <div class="footer-links">
          <div class="links-group">
            <h3>导航</h3>
            <router-link to="/">首页</router-link>
            <router-link to="/articles">文章</router-link>
            <router-link to="/gallery">图集</router-link>
            <router-link to="/about">关于</router-link>
          </div>
          
          <div class="links-group">
            <h3>关注我们</h3>
            <a href="#" target="_blank">微博</a>
            <a href="#" target="_blank">知乎</a>
            <a href="#" target="_blank">Github</a>
          </div>
          
          <div class="links-group">
            <h3>更多</h3>
            <router-link to="/privacy">隐私政策</router-link>
            <router-link to="/terms">使用条款</router-link>
            <a href="mailto:contact@example.com">联系我们</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} 云边. All rights reserved.
        </p>
        <p class="beian">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">
            粤ICP备xxxxxxxx号-1
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 4rem 0 2rem;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
}

.footer-desc {
  color: var(--color-text);
  opacity: 0.8;
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.links-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.links-group h3 {
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.links-group a {
  color: var(--color-text);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.links-group a:hover {
  color: var(--color-primary);
  opacity: 1;
  transform: translateX(5px);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
}

.copyright {
  margin-bottom: 0.5rem;
}

.beian a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;
}

.beian a:hover {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .site-footer {
    padding: 2rem 0 1.5rem;
  }

  .footer-content {
    padding: 0 1rem;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .footer-brand {
    text-align: center;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .links-group {
    align-items: center;
    text-align: center;
  }

  .links-group a:hover {
    transform: none;
  }

  .footer-bottom {
    padding-top: 1.5rem;
  }
}
</style> 