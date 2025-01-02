<template>
  <div class="app-container">
    <Navbar />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 64px; /* 桌面端导航栏高度 */
}

.app-container > :not(footer) {
  flex: 1;
}

@media (max-width: 768px) {
  .app-container {
    padding-top: 56px; /* 移动端导航栏高度 */
  }
}
</style>