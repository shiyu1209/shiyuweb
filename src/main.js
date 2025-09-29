import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import 'ionicons'
import '@/assets/main.css'   // ← 加这里

const a =createApp(App)
a.use(createPinia())
a.use(router)
a.mount('#app')

// 去掉全局滚动条
// document.documentElement.style.overflow = 'hidden'
// document.body.style.overflow = 'hidden'