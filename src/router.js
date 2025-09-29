import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',        name: 'Home',    component: () => import('@/views/Home.vue') },
    { path: '/search',  name: 'Search',  component: () => import('@/views/Search.vue') },
    { path: '/music',   name: 'Music',   component: () => import('@/views/Music.vue') },
    { path: '/notice',  name: 'Notice',  component: () => import('@/views/Notice.vue') },
    { path: '/profile', name: 'Profile', component: () => import('@/views/Profile.vue') },
  ]
})