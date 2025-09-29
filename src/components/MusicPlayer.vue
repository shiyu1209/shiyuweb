<template>
  <div class="music-player">
    <!-- 背景装饰和音频可视化 -->
    <div class="background-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      
      <!-- 音频可视化条 -->
      <div class="audio-visualizer" v-if="store.playing">
        <div class="visualizer-bar" v-for="i in 120" :key="i" :style="{ animationDelay: (i * 0.05) + 's' }"></div>
      </div>
    </div>

    <!-- 主要布局容器 -->
    <div class="main-layout">
      <!-- 左侧播放器区域 -->
      <div class="player-area">
        <!-- 专辑封面区域 -->
        <div class="album-section">
          <div class="album-container" :class="{ spinning: store.playing }">
            <div class="album-cover">
              <img :src="store.current.poster" alt="专辑封面" />
              <div class="vinyl-center"></div>
            </div>
          </div>
          

        </div>

        <!-- 控制区域 -->
        <div class="control-area">
          <!-- 歌曲信息和进度条合并区域 -->
          <div class="song-progress-section">
            <div class="song-info">
              <h2 class="song-title">{{ store.current.title }}</h2>
              <p class="song-artist">{{ store.current.artist }}</p>
            </div>
            
            <div class="progress-section">
              <div class="time-info">
                <span class="current-time">{{ format(store.currentTime) }}</span>
                <span class="total-time">{{ format(store.duration) }}</span>
              </div>
              <div class="progress-container" @click="setProgress">
                <div class="progress-track"></div>
                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
                <div class="progress-thumb" :style="{ left: progress + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- 控制按钮区域 -->
          <div class="controls-section">
            <div class="main-controls">
              <button class="control-btn" @click="store.prev()">
                <ion-icon name="play-skip-back"></ion-icon>
              </button>
              <button class="play-btn" @click="store.toggle()">
                <ion-icon :name="store.playing ? 'pause' : 'play'"></ion-icon>
              </button>
              <button class="control-btn" @click="store.next()">
                <ion-icon name="play-skip-forward"></ion-icon>
              </button>
            </div>

            <div class="volume-section">
              <button class="volume-btn" @click="muteToggle">
                <ion-icon :name="getVolumeIcon()"></ion-icon>
              </button>
              <div class="volume-slider">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  v-model.number="store.volume"
                  class="volume-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧播放列表区域 -->
      <div class="playlist-area">
        <div class="playlist-card">
          <div class="playlist-header">
            <h3>播放列表</h3>
            <div class="playlist-stats">{{ store.list.length }} 首歌曲</div>
          </div>
          
          <div class="playlist-content">
            <div
              v-for="(song, index) in store.list"
              :key="index"
              class="playlist-item"
              :class="{ active: index === store.index, playing: index === store.index && store.playing }"
              @click="selectSong(index)"
            >
              <div class="item-index">{{ index + 1 }}</div>
              <div class="song-cover">
                <img :src="song.poster" :alt="song.title" />
                <div class="play-indicator" v-if="index === store.index && store.playing">
                  <div class="wave-bar"></div>
                  <div class="wave-bar"></div>
                  <div class="wave-bar"></div>
                </div>
              </div>
              <div class="song-details">
                <div class="song-name">{{ song.title }}</div>
                <div class="song-artist">{{ song.artist }}</div>
              </div>
              <div class="song-actions">
                <button class="action-btn" @click.stop="selectSong(index)">
                  <ion-icon :name="index === store.index && store.playing ? 'pause' : 'play'"></ion-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的音频元素 -->
    <audio
      ref="audio"
      :src="store.current.src"
      :volume="store.volume"
      @ended="store.next()"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoaded"
    />
  </div>
</template>

<script setup>
import { useMusic } from '../stores/music'
import { ref, watch, onMounted } from 'vue'

const store = useMusic()
const audio = ref(null)
const progress = ref(0)
const showPlaylist = ref(false)

function format(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function onTimeUpdate() {
  store.currentTime = audio.value.currentTime
  progress.value = (audio.value.currentTime / audio.value.duration) * 100 || 0
}

function onLoaded() {
  store.duration = audio.value.duration
}

function setProgress(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const percentage = x / rect.width
  audio.value.currentTime = percentage * audio.value.duration
}

function selectSong(index) {
  store.index = index
  store.play()
  showPlaylist.value = false
}

function muteToggle() {
  if (store.volume > 0) {
    store.lastVol = store.volume
    store.volume = 0
  } else {
    store.volume = store.lastVol || 0.7
  }
}

function getVolumeIcon() {
  if (store.volume === 0) return 'volume-mute'
  if (store.volume < 0.3) return 'volume-low'
  if (store.volume < 0.7) return 'volume-medium'
  return 'volume-high'
}

// 播放状态同步
watch(
  () => store.playing,
  val => {
    if (val) {
      audio.value.play().catch(console.error)
    } else {
      audio.value.pause()
    }
  }
)

// 切歌自动播放
watch(
  () => store.index,
  () => {
    audio.value.load()
    if (store.playing) {
      setTimeout(() => {
        audio.value.play().catch(console.error)
      }, 100)
    }
  }
)

onMounted(() => {
  audio.value.load()
})
</script>

<style scoped>
.music-player {
  position: relative;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
  overflow: hidden;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 30px;
  box-sizing: border-box;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #a8edea, #fed6e3);
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #d299c2, #fef9d7);
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 音频可视化 */
.audio-visualizer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 20px;
  opacity: 0.4;
  z-index: 1;
}

.visualizer-bar {
  width: 6px;
  background: linear-gradient(to top, #4facfe, #00f2fe, #a8edea);
  border-radius: 3px;
  animation: visualize 1.5s ease-in-out infinite;
  margin: 0 1px;
}

.visualizer-bar:nth-child(odd) {
  background: linear-gradient(to top, #4facfe, #00f2fe, #ffffff);
}

.visualizer-bar:nth-child(even) {
  background: linear-gradient(to top, #a8edea, #fed6e3, #d299c2);
}

@keyframes visualize {
  0%, 100% { 
    height: 15px; 
    transform: scaleY(1);
  }
  25% { 
    height: 80px; 
    transform: scaleY(1.2);
  }
  50% { 
    height: 100px; 
    transform: scaleY(1.5);
  }
  75% { 
    height: 60px; 
    transform: scaleY(1.1);
  }
}

/* 主要布局 */
.main-layout {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  height: calc(100vh - 60px);
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
}

/* 左侧播放器区域 */
.player-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
  height: 100%;
}

.album-section {
  text-align: center;
}

.album-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto 20px;
  transition: transform 0.3s ease;
}

.album-container.spinning {
  animation: spin 20s linear infinite;
}

.control-area {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 歌曲信息和进度条合并区域 */
.song-progress-section {
  margin-bottom: 25px;
  text-align: center;
}

.song-progress-section .song-info {
  margin-bottom: 20px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.album-cover {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 8px solid rgba(255, 255, 255, 0.2);
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vinyl-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: #333;
  border-radius: 50%;
  border: 2px solid #666;
}

.vinyl-center::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #000;
  border-radius: 50%;
}

/* 歌曲信息 */
.song-info {
  color: white;
  text-align: center;
}

.song-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.song-artist {
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
  font-weight: 400;
}

/* 进度条区域 */
.progress-section {
  margin-bottom: 20px;
}

.time-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
  opacity: 0.8;
  color: white;
}

.progress-container {
  position: relative;
  height: 5px;
  cursor: pointer;
  margin: 0 auto;
}

.progress-track {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.progress-bar {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: left 0.1s linear;
}

/* 控制按钮区域 */
.controls-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

.control-btn, .play-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn {
  width: 45px;
  height: 45px;
  font-size: 18px;
}

.play-btn {
  width: 60px;
  height: 60px;
  font-size: 24px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  box-shadow: 0 6px 16px rgba(79, 172, 254, 0.4);
}

.control-btn:hover, .play-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.volume-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.volume-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.volume-btn:hover {
  opacity: 1;
}

.volume-slider {
  width: 90px;
}

.volume-input {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.volume-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* 右侧播放列表区域 */
.playlist-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.playlist-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: 500px;
  display: flex;
  flex-direction: column;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  flex-shrink: 0;
}

.playlist-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.playlist-stats {
  font-size: 13px;
  opacity: 0.7;
}

.playlist-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.playlist-content::-webkit-scrollbar {
  width: 6px;
}

.playlist-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.playlist-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.playlist-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 6px;
  color: white;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(3px);
}

.playlist-item.active {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(0, 242, 254, 0.3));
  border: 1px solid rgba(79, 172, 254, 0.5);
}

.item-index {
  width: 25px;
  text-align: center;
  font-size: 13px;
  opacity: 0.7;
  font-weight: 500;
}

.playlist-item.active .item-index {
  opacity: 0;
}

.song-cover {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  margin: 0 12px;
  flex-shrink: 0;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  padding: 3px;
}

.wave-bar {
  width: 2px;
  height: 10px;
  background: #4facfe;
  border-radius: 1px;
  animation: wave 1s ease-in-out infinite;
}

.wave-bar:nth-child(2) { animation-delay: 0.2s; }
.wave-bar:nth-child(3) { animation-delay: 0.4s; }

@keyframes wave {
  0%, 100% { height: 5px; }
  50% { height: 12px; }
}

.song-details {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-details .song-artist {
  font-size: 12px;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.playlist-item:hover .song-actions {
  opacity: 1;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 14px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-layout {
    grid-template-columns: 1fr 350px;
    gap: 20px;
  }
  
  .album-container {
    width: 300px;
    height: 300px;
  }
  
  .playlist-card {
    height: 550px;
  }
}

@media (max-width: 968px) {
  .music-player {
    padding: 20px;
  }
  
  .main-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .playlist-area {
    order: -1;
  }
  
  .playlist-card {
    height: 300px;
  }
  
  .album-container {
    width: 280px;
    height: 280px;
  }
  
  .song-title {
    font-size: 24px;
  }
  
  .control-area {
    padding: 25px;
  }
}

@media (max-width: 768px) {
  .music-player {
    padding: 15px;
  }
  
  .player-area {
    gap: 30px;
  }
  
  .album-container {
    width: 250px;
    height: 250px;
  }
  
  .song-title {
    font-size: 22px;
  }
  
  .song-artist {
    font-size: 16px;
  }
  
  .main-controls {
    gap: 20px;
  }
  
  .control-btn {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .play-btn {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
  
  .playlist-card {
    height: 250px;
  }
  
  .playlist-header {
    padding: 20px;
  }
  
  .playlist-content {
    padding: 15px;
  }
  
  .playlist-item {
    padding: 10px;
  }
  
  .song-cover {
    width: 40px;
    height: 40px;
    margin: 0 12px;
  }
}

@media (max-width: 480px) {
  .album-container {
    width: 220px;
    height: 220px;
  }
  
  .song-title {
    font-size: 20px;
  }
  
  .song-artist {
    font-size: 15px;
  }
  
  .control-area, .album-info-card {
    padding: 20px;
  }
  
  .main-controls {
    gap: 15px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .play-btn {
    width: 55px;
    height: 55px;
    font-size: 22px;
  }
  
  .volume-section {
    gap: 10px;
  }
  
  .volume-slider {
    width: 80px;
  }
}
</style>