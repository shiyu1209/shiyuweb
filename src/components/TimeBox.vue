<template>
  <div class="time-box">{{ time }}</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('00:00:00')
let timer = null

function pad(n) {
  return n > 9 ? n : '0' + n
}
function update() {
  const d = new Date()
  time.value = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

onMounted(() => {
  update()
  timer = setInterval(update, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.time-box{
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 2px;
}
</style>