<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- 背景图 -->
    <div
      class="bg-img"
      :style="{ backgroundImage: `url(/image/cat.jpg)` }"
    />
    <!-- 鱼儿动画 -->
    <FishAnimation />
    <!-- 欢迎文字 -->
    <div class="absolute-center text-white text-4xl font-bold tracking-widest">

    </div>
  </div>
</template>

<script setup>
import FishAnimation from '@/components/FishAnimation.vue'
</script>

<style scoped>
.bg-img{
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: -1;
}
.absolute-center{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>