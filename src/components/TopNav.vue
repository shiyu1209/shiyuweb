<template>
  <nav class="icon-nav">
    <router-link
      v-for="item in list"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: $route.path === item.path }"
    >
      <ion-icon :name="item.icon" class="icon"></ion-icon>
      <span class="text">{{ item.text }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const list = [
  { path: '/',        icon: 'home-outline',           text: 'Home' },
  { path: '/search',  icon: 'search-circle-outline',  text: 'Search' },
  { path: '/music',   icon: 'headset-outline',        text: 'Music' },
  { path: '/notice',  icon: 'chatbubble-outline',     text: 'Notice' },
  { path: '/profile', icon: 'person-circle-outline',  text: 'Profile' }
]
</script>

<style scoped>
.icon-nav {
  position: fixed;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 12px;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #ffffff;
  transform: translateY(-2px);
}

.nav-item.active {
  color: #667eea;
  height: 72px;
}

.icon {
  font-size: 28px;
}

.text {
  font-size: 10px;
  margin-top: 4px;
  opacity: 0;
  transition: opacity .2s;
}

.nav-item.active .text {
  opacity: 1;
}
</style>