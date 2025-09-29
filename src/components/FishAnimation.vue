<template>
  <div ref="container" class="fish-container" />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const container = ref(null)

const fishCount = 7
const splashCount = 3
const minDelay = 1000
const maxDelay = 3000
const minSpeed = 1
const maxSpeed = 2

const rand = n => Math.floor(Math.random() * n) + 1

function createFish() {
  if (!container.value) return
  
  const fish = document.createElement('img')
  fish.src = `/image/fish/${rand(fishCount)}.gif`
  fish.className = 'fish'
  const leftPos = Math.random() * 100
  const speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
  fish.style.left = `${leftPos}%`
  fish.style.top = '-100px'
  fish.style.width = '100px'
  fish.style.position = 'absolute'
  container.value.appendChild(fish)

  let start = null
  const duration = 5000 / speed
  function animate(ts) {
    if (!start) start = ts
    const p = (ts - start) / duration
    if (p < 1) {
      fish.style.top = -100 + p * (window.innerHeight + 100) + 'px'
      requestAnimationFrame(animate)
    } else {
      createSplash(leftPos)
      fish.remove()
    }
  }
  requestAnimationFrame(animate)
  setTimeout(createFish, minDelay + Math.random() * (maxDelay - minDelay))
}

function createSplash(leftPos) {
  if (!container.value) return
  
  const sp = document.createElement('img')
  sp.src = `/image/fish/${rand(splashCount) + 7}.gif`
  sp.className = 'splash'
  sp.style.left = `${leftPos}%`
  sp.style.bottom = '0'
  sp.style.width = '150px'
  sp.style.position = 'absolute'
  container.value.appendChild(sp)
  setTimeout(() => sp.remove(), 1000)
}

onMounted(() => {
  // 确保DOM已经渲染完成
  setTimeout(() => {
    if (container.value) {
      createFish()
    }
  }, 100)
})
</script>

<style>
.fish-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
}
</style>