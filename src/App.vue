<template>
  <div>
  <TopNav />
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  </div>
</template>

<script setup>
import TopNav from '@/components/TopNav.vue'
import 'ionicons'
</script>

<style>
/* 页面过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 确保应用容器不会影响滚动条 */
#app {
  width: 100%;
  min-height: 100vh;
}
</style>