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
}

.app-container > :not(footer) {
  flex: 1;
}
</style>