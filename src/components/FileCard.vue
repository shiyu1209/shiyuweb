<template>
  <div class="file-card" @click="openFile">
    <div class="file-icon">
      <ion-icon :name="getFileIcon(file.type)" />
    </div>
    
    <div class="file-info">
      <h4 class="file-name">{{ file.name }}</h4>
      <div class="file-meta">
        <span class="file-size">{{ file.size }}</span>
        <span class="file-date">{{ formatDate(file.date) }}</span>
      </div>
      <div class="file-category">{{ file.category }}</div>
      
      <div v-if="file.tags && file.tags.length > 0" class="file-tags">
        <span 
          v-for="tag in file.tags.slice(0, 3)" 
          :key="tag" 
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <div class="file-actions">
      <button @click.stop="downloadFile" class="action-btn">
        <ion-icon name="download-outline" />
      </button>
      <button @click.stop="shareFile" class="action-btn">
        <ion-icon name="share-outline" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFiles } from '@/stores/files'

const props = defineProps({
  file: {
    type: Object,
    required: true
  }
})

const fileStore = useFiles()

function getFileIcon(type) {
  const icons = {
    'document': 'document-text-outline',
    'image': 'image-outline',
    'audio': 'musical-note-outline',
    'video': 'videocam-outline'
  }
  return icons[type] || 'document-outline'
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '今天'
  if (diffDays === 2) return '昨天'
  if (diffDays <= 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN')
}

function openFile() {
  // 添加到最近访问
  fileStore.addToRecentFiles(props.file)
  
  // 根据文件类型打开
  if (props.file.type === 'image') {
    // 在新窗口中打开图片
    window.open(props.file.path, '_blank')
  } else if (props.file.type === 'audio') {
    // 可以集成到音乐播放器
    console.log('播放音乐:', props.file.name)
  } else {
    // 其他文件类型尝试在新窗口打开
    window.open(props.file.path, '_blank')
  }
}

function downloadFile(event) {
  event.stopPropagation()
  // 创建下载链接
  const link = document.createElement('a')
  link.href = props.file.path
  link.download = props.file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function shareFile(event) {
  event.stopPropagation()
  // 分享功能
  if (navigator.share) {
    navigator.share({
      title: props.file.name,
      text: `查看 ${props.file.name}`,
      url: window.location.origin + props.file.path
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.origin + props.file.path)
    alert('链接已复制到剪贴板')
  }
}
</script>

<style scoped>
.file-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 16px;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2));
  border-color: rgba(255, 255, 255, 0.4);
}

.file-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  margin: 0 0 8px 0;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
}

.file-size,
.file-date {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.file-category {
  color: #a5b4fc;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}

.file-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(102, 126, 234, 0.2);
  color: #a5b4fc;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

.file-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
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

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .file-info {
    width: 100%;
  }
  
  .file-name {
    white-space: normal;
    overflow: visible;
    text-overflow: unset;
  }
  
  .file-actions {
    align-self: flex-end;
  }
}
</style>