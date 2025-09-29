<template>
  <div class="search-page">
    <!-- 背景层 -->
    <div class="bg-layer" :class="{ active: isSearchFocused }"></div>

    <!-- 时钟组件 - 右上角固定位置 -->
    <div class="time-corner">
      <TimeBox />
    </div>

    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-container">        
        <div class="search-box" :class="{ focused: isSearchFocused }">
          <!-- 用logo替换搜索图标 -->
          <img src="/image/logo.png" class="search-logo" />
          <input
            ref="searchInput"
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="搜索文件、图片、文档..."
            @focus="onSearchFocus"
            @blur="onSearchBlur"
            @input="onSearch"
          />
          <button 
            v-if="searchKeyword" 
            @click="clearSearch" 
            class="clear-btn"
          >
            <ion-icon name="close-outline" />
          </button>
        </div>

        <!-- 搜索建议 -->
        <div v-if="showSuggestions" class="search-suggestions">
          <div class="suggestion-section">
            <h4>搜索历史</h4>
            <div class="suggestion-items">
              <span 
                v-for="item in fileStore.searchHistory.slice(0, 5)"
                :key="item"
                @click="selectSuggestion(item)"
                class="suggestion-item"
              >
                <ion-icon name="time-outline" />
                {{ item }}
              </span>
            </div>
          </div>
          
          <div class="suggestion-section">
            <h4>AboutMe</h4>
            <div class="suggestion-items">
              <span 
                v-for="tag in achievementTags"
                :key="tag"
                @click="selectSuggestion(tag)"
                class="suggestion-item achievement-item"
              >
                <ion-icon name="trophy-outline" />
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="suggestion-section">
            <h4>文件类型</h4>
            <div class="suggestion-items">
              <span 
                v-for="category in fileCategories"
                :key="category"
                @click="selectSuggestion(category)"
                class="suggestion-item category-item"
              >
                <ion-icon name="folder-outline" />
                {{ category }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="search-content">
      <!-- 搜索结果 -->
      <div v-if="searchKeyword" class="search-results">
        <div class="results-header">
          <h3>搜索结果 ({{ searchResults.length }})</h3>
          <div class="view-toggle">
            <button 
              @click="viewMode = 'list'" 
              :class="{ active: viewMode === 'list' }"
              class="view-btn"
            >
              <ion-icon name="list-outline" />
            </button>
            <button 
              @click="viewMode = 'grid'" 
              :class="{ active: viewMode === 'grid' }"
              class="view-btn"
            >
              <ion-icon name="grid-outline" />
            </button>
          </div>
        </div>

        <div class="results-container" :class="viewMode">
          <FileCard 
            v-for="file in searchResults" 
            :key="file.id" 
            :file="file"
            class="result-item"
          />
          
          <div v-if="searchResults.length === 0" class="no-results">
            <ion-icon name="search-outline" />
            <h3>未找到相关文件</h3>
            <p>尝试使用不同的关键词或检查拼写</p>
          </div>
        </div>
      </div>

      <!-- 默认展示 -->
      <div v-else class="default-content">
        <!-- 欢迎区域 -->
        <div class="welcome-section">
          <h2>个人文件库</h2>
          <p>搜索您的证书、照片和音乐收藏</p>
        </div>

        <!-- 最近访问 -->
        <div v-if="fileStore.recentFiles && fileStore.recentFiles.length > 0" class="recent-files">
          <h3>最近访问</h3>
          <div class="recent-container">
            <FileCard 
              v-for="file in fileStore.recentFiles" 
              :key="file.id" 
              :file="file"
            />
          </div>
        </div>

        <!-- 文件统计 -->
        <div class="file-stats">
          <h3>文件概览</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">
                <ion-icon name="trophy-outline" />
              </div>
              <div class="stat-number">{{ getFileCountByCategory('获奖证书') }}</div>
              <div class="stat-label">获奖证书</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <ion-icon name="image-outline" />
              </div>
              <div class="stat-number">{{ getFileCountByCategory('个人照片') }}</div>
              <div class="stat-label">个人照片</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <ion-icon name="musical-note-outline" />
              </div>
              <div class="stat-number">{{ getFileCountByCategory('音乐收藏') }}</div>
              <div class="stat-label">音乐收藏</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <ion-icon name="documents-outline" />
              </div>
              <div class="stat-number">{{ fileStore.files?.length || 0 }}</div>
              <div class="stat-label">总文件数</div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFiles } from '@/stores/files'
import FileCard from '@/components/FileCard.vue'
import TimeBox from '@/components/TimeBox.vue'

const fileStore = useFiles()
const searchInput = ref(null)
const searchKeyword = ref('')
const isSearchFocused = ref(false)
const showSuggestions = ref(false)
const viewMode = ref('list')

// 计算属性
const searchResults = computed(() => {
  return fileStore.searchFiles(searchKeyword.value)
})

const achievementTags = computed(() => {
  return ['数学建模', '泰迪杯', '二等奖', '三等奖', '国家级', '省级', '数据分析', 'MathorCup']
})

const fileCategories = computed(() => {
  return ['获奖证书', '个人照片', '音乐收藏']
})

const popularTags = computed(() => {
  const allTags = fileStore.files.flatMap(file => file.tags)
  const tagCounts = {}
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1
  })
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([tag]) => tag)
})

// 本地计算文件类型统计，避免循环引用
const localFileTypeStats = computed(() => {
  const stats = {}
  if (fileStore.files) {
    fileStore.files.forEach(file => {
      stats[file.type] = (stats[file.type] || 0) + 1
    })
  }
  return stats
})

// 方法
function onSearchFocus() {
  isSearchFocused.value = true
  showSuggestions.value = true
}

function onSearchBlur() {
  // 延迟隐藏建议，允许点击建议项
  setTimeout(() => {
    isSearchFocused.value = false
    showSuggestions.value = false
  }, 200)
}

function onSearch() {
  // 实时搜索逻辑已通过计算属性实现
}

function clearSearch() {
  searchKeyword.value = ''
  searchInput.value?.focus()
}

function selectSuggestion(suggestion) {
  searchKeyword.value = suggestion
  showSuggestions.value = false
}

function searchByCategory(category) {
  const categoryNames = {
    'image': '图片',
    'document': '文档',
    'video': '视频',
    'audio': '音频'
  }
  searchKeyword.value = categoryNames[category] || category
}

function getCategoryIcon(category) {
  const icons = {
    '获奖证书': 'trophy-outline',
    '个人照片': 'image-outline',
    '音乐收藏': 'musical-note-outline',
    'image': 'image-outline',
    'document': 'document-text-outline',
    'video': 'videocam-outline',
    'audio': 'musical-note-outline'
  }
  return icons[category] || 'folder-outline'
}

function getCategoryName(category) {
  const names = {
    '获奖证书': '获奖证书',
    '个人照片': '个人照片',
    '音乐收藏': '音乐收藏',
    'image': '图片',
    'document': '文档',
    'video': '视频',
    'audio': '音频'
  }
  return names[category] || category
}

function getTypeName(type) {
  const names = {
    'pdf': 'PDF',
    'image': '图片',
    'document': '文档',
    'video': '视频',
    'audio': '音频'
  }
  return names[type] || type.toUpperCase()
}

function getFileCountByCategory(category) {
  return fileStore.files?.filter(file => file.category === category).length || 0
}

onMounted(() => {
  // 可以在这里加载文件列表
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.bg-layer {
  position: fixed;
  inset: 0;
  background: url(/image/cat.jpg) center/cover no-repeat;
  transition: all 0.3s ease;
  z-index: -1;
}

.bg-layer.active {
  filter: blur(8px);
  transform: scale(1.05);
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.time-corner {
  position: fixed;
  top: 13px;
  right: 250px;
  z-index: 1001;
}

.search-logo {
  height: 24px;
  width: auto;
  margin-right: 12px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.search-box.focused .search-logo {
  opacity: 1;
}

.search-box {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-box.focused {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.25));
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}



.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  padding: 15px 0;
  color: white;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.clear-btn {
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #2d3748;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7));
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  margin-top: 10px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.suggestion-section {
  margin-bottom: 20px;
}

.suggestion-section:last-child {
  margin-bottom: 0;
}

.suggestion-section h4 {
  margin: 0 0 12px 0;
  color: white;
  font-size: 15px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.suggestion-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(102, 126, 234, 0.2);
  color: #a5b4fc;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 15px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(102, 126, 234, 0.8);
  color: white;
  border-color: rgba(102, 126, 234, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.tag-item {
  background: rgba(236, 201, 75, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(236, 201, 75, 0.3);
}

.tag-item:hover {
  background: rgba(236, 201, 75, 0.8);
  color: white;
  border-color: rgba(236, 201, 75, 0.9);
  box-shadow: 0 2px 8px rgba(236, 201, 75, 0.3);
}

.achievement-item {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.achievement-item:hover {
  background: rgba(34, 197, 94, 0.8);
  color: white;
  border-color: rgba(34, 197, 94, 0.9);
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.category-item {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.category-item:hover {
  background: rgba(168, 85, 247, 0.8);
  color: white;
  border-color: rgba(168, 85, 247, 0.9);
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.3);
}

.search-content {
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h3 {
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.view-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.view-btn.active,
.view-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.results-container.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.results-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.no-results ion-icon {
  font-size: 64px;
  opacity: 0.5;
  margin-bottom: 20px;
}

.no-results h3 {
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.no-results p {
  margin: 0;
  opacity: 0.8;
}

.default-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.welcome-section {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 20px;
}

.welcome-section h2 {
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-section p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.recent-files h3,
.file-stats h3 {
  color: white;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 24px;
}

.recent-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2));
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin: 0 auto 16px auto;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-header {
    padding: 15px;
  }
  
  .search-content {
    padding: 20px 15px;
  }
  
  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .quick-items {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>