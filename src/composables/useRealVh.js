// src/composables/useRealVh.js
import { onUnmounted } from 'vue'

export function useRealVh() {
  function setRealVh() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--real-vh', `${vh}px`)
  }

  setRealVh()
  window.addEventListener('resize', setRealVh)

  onUnmounted(() => {
    window.removeEventListener('resize', setRealVh)
  })
}