<template>
  <MusicPlayer />
</template>

<script setup>
import { onUnmounted } from 'vue'
import { useRealVh } from '@/composables/useRealVh'
useRealVh()
import TheNavigation from '@/components/TopNav.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
</script>
<style scoped>
/* 用 CSS 变量代替 100vh */
.notice-wrap,
.music-page {
  height: calc(var(--real-vh) * 100);   /* = 真实可视高 */
  width: 100vw;
  overflow: hidden;                     /* 本身也不滚动 */
}
.page-lock {
  height: calc(var(--real-vh) * 100);
  width: 100vw;
  overflow: hidden;   /* 本页无滚动条 */
}
</style>