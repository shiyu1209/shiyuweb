<template>
  <div class="notice-container">
    <!-- 头部区域 -->
    <div class="notice-header">
      <h1 class="page-title">
        <ion-icon name="notifications-outline"></ion-icon>
        通知中心
      </h1>
      <div class="header-actions">
        <button @click="markAllAsRead" class="action-btn" :disabled="!hasUnreadNotices">
          <ion-icon name="checkmark-done-outline"></ion-icon>
          全部已读
        </button>
        <button @click="clearAllNotices" class="action-btn danger">
          <ion-icon name="trash-outline"></ion-icon>
          清空
        </button>
      </div>
    </div>

    <!-- 通知统计 -->
    <div class="notice-stats">
      <div class="stat-item">
        <span class="stat-number">{{ totalNotices }}</span>
        <span class="stat-label">总通知</span>
      </div>
      <div class="stat-item">
        <span class="stat-number unread">{{ unreadCount }}</span>
        <span class="stat-label">未读</span>
      </div>
    </div>

    <!-- 通知筛选 -->
    <div class="notice-filters">
      <button 
        v-for="filter in filters" 
        :key="filter.key"
        @click="activeFilter = filter.key"
        :class="['filter-btn', { active: activeFilter === filter.key }]"
      >
        <ion-icon :name="filter.icon"></ion-icon>
        {{ filter.label }}
        <span v-if="filter.count > 0" class="filter-count">{{ filter.count }}</span>
      </button>
    </div>

    <!-- 通知列表 -->
    <div class="notice-list">
      <div v-if="filteredNotices.length === 0" class="empty-state">
        <div class="empty-icon">
          <ion-icon name="notifications-off-outline"></ion-icon>
        </div>
        <h3>暂无通知</h3>
        <p>{{ getEmptyMessage() }}</p>
      </div>
      
      <TransitionGroup name="notice" tag="div" class="notices-wrapper">
        <div 
          v-for="notice in filteredNotices" 
          :key="notice.id"
          :class="['notice-item', { unread: !notice.read }]"
          @click="markAsRead(notice.id)"
        >
          <div class="notice-icon">
            <ion-icon :name="getNoticeIcon(notice.type)"></ion-icon>
          </div>
          
          <div class="notice-content">
            <div class="notice-header-info">
              <h4 class="notice-title">{{ notice.title }}</h4>
              <span class="notice-time">{{ formatTime(notice.time) }}</span>
            </div>
            <p class="notice-message">{{ notice.message }}</p>
            <div class="notice-meta">
              <span :class="['notice-type', notice.type]">{{ getTypeLabel(notice.type) }}</span>
              <span v-if="!notice.read" class="unread-dot"></span>
            </div>
          </div>
          
          <div class="notice-actions">
            <button @click.stop="deleteNotice(notice.id)" class="delete-btn">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 浮动添加按钮 (用于测试) -->
    <button @click="addTestNotice" class="fab">
      <ion-icon name="add-outline"></ion-icon>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRealVh } from '@/composables/useRealVh'

useRealVh()

// 通知数据
const notices = ref([
  {
    id: 1,
    type: 'system',
    title: '系统更新',
    message: '系统已更新到最新版本 v2.1.0，新增了多项功能和性能优化。',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
    read: false
  },
  {
    id: 2,
    type: 'message',
    title: '新消息',
    message: '您有一条来自管理员的重要消息，请及时查看。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
    read: false
  },
  {
    id: 3,
    type: 'update',
    title: '功能更新',
    message: '音乐播放器新增了歌词显示功能，快去体验吧！',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
    read: true
  },
  {
    id: 4,
    type: 'warning',
    title: '安全提醒',
    message: '检测到异常登录行为，请确认是否为本人操作。',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2天前
    read: true
  }
])

// 筛选器
const activeFilter = ref('all')
const filters = computed(() => [
  { key: 'all', label: '全部', icon: 'list-outline', count: notices.value.length },
  { key: 'unread', label: '未读', icon: 'mail-unread-outline', count: unreadCount.value },
  { key: 'system', label: '系统', icon: 'settings-outline', count: notices.value.filter(n => n.type === 'system').length },
  { key: 'message', label: '消息', icon: 'chatbubble-outline', count: notices.value.filter(n => n.type === 'message').length },
  { key: 'update', label: '更新', icon: 'refresh-outline', count: notices.value.filter(n => n.type === 'update').length },
  { key: 'warning', label: '警告', icon: 'warning-outline', count: notices.value.filter(n => n.type === 'warning').length }
])

// 计算属性
const totalNotices = computed(() => notices.value.length)
const unreadCount = computed(() => notices.value.filter(n => !n.read).length)
const hasUnreadNotices = computed(() => unreadCount.value > 0)

const filteredNotices = computed(() => {
  if (activeFilter.value === 'all') return notices.value
  if (activeFilter.value === 'unread') return notices.value.filter(n => !n.read)
  return notices.value.filter(n => n.type === activeFilter.value)
})

// 方法
const markAsRead = (id) => {
  const notice = notices.value.find(n => n.id === id)
  if (notice) notice.read = true
}

const markAllAsRead = () => {
  notices.value.forEach(n => n.read = true)
}

const deleteNotice = (id) => {
  const index = notices.value.findIndex(n => n.id === id)
  if (index > -1) notices.value.splice(index, 1)
}

const clearAllNotices = () => {
  if (confirm('确定要清空所有通知吗？')) {
    notices.value.splice(0)
  }
}

const addTestNotice = () => {
  const types = ['system', 'message', 'update', 'warning']
  const titles = ['测试通知', '新功能上线', '系统维护', '重要提醒']
  const messages = [
    '这是一条测试通知消息。',
    '我们为您带来了全新的功能体验。',
    '系统将在今晚进行例行维护。',
    '请注意查看最新的重要信息。'
  ]
  
  const randomType = types[Math.floor(Math.random() * types.length)]
  const randomTitle = titles[Math.floor(Math.random() * titles.length)]
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]
  
  notices.value.unshift({
    id: Date.now(),
    type: randomType,
    title: randomTitle,
    message: randomMessage,
    time: new Date(),
    read: false
  })
}

const getNoticeIcon = (type) => {
  const icons = {
    system: 'settings-outline',
    message: 'mail-outline',
    update: 'refresh-circle-outline',
    warning: 'warning-outline'
  }
  return icons[type] || 'notifications-outline'
}

const getTypeLabel = (type) => {
  const labels = {
    system: '系统',
    message: '消息',
    update: '更新',
    warning: '警告'
  }
  return labels[type] || '通知'
}

const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return time.toLocaleDateString()
}

const getEmptyMessage = () => {
  const messages = {
    all: '还没有任何通知',
    unread: '所有通知都已读完',
    system: '暂无系统通知',
    message: '暂无消息通知',
    update: '暂无更新通知',
    warning: '暂无警告通知'
  }
  return messages[activeFilter.value] || '暂无通知'
}
</script>

<style scoped>
.notice-container {
  min-height: calc(var(--real-vh) * 100);
  background: url(/image/cat.jpg) center/cover fixed;
  padding: 80px 20px 20px;
  position: relative;
}

.notice-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1;
}

.notice-container > * {
  position: relative;
  z-index: 2;
}

/* 头部区域 */
.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.page-title ion-icon {
  font-size: 32px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.danger:hover:not(:disabled) {
  background: rgba(255,107,107,0.3);
  border-color: rgba(255,107,107,0.5);
}

/* 通知统计 */
.notice-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-item {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px 24px;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.2);
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.stat-number.unread {
  color: #ff6b6b;
}

.stat-label {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}

/* 筛选器 */
.notice-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(10px);
}

.filter-btn:hover,
.filter-btn.active {
  background: rgba(255,255,255,0.25);
  color: white;
  transform: translateY(-2px);
}

.filter-count {
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 600;
}

/* 通知列表 */
.notice-list {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.2);
  overflow: hidden;
  max-height: 60vh;
  overflow-y: auto;
}

/* 通知列表内部滚动条样式 */
.notice-list::-webkit-scrollbar {
  width: 6px;
}

.notice-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.notice-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.notice-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.notices-wrapper {
  display: flex;
  flex-direction: column;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-item:hover {
  background: rgba(255,255,255,0.1);
}

.notice-item.unread {
  background: rgba(255,255,255,0.05);
}

.notice-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #ff6b6b;
}

.notice-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.notice-content {
  flex: 1;
  min-width: 0;
}

.notice-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
  line-height: 1.4;
}

.notice-time {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  white-space: nowrap;
}

.notice-message {
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notice-type {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.notice-type.system {
  background: rgba(103, 126, 234, 0.3);
  color: #677eea;
}

.notice-type.message {
  background: rgba(52, 152, 219, 0.3);
  color: #3498db;
}

.notice-type.update {
  background: rgba(46, 204, 113, 0.3);
  color: #2ecc71;
}

.notice-type.warning {
  background: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #ff6b6b;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.notice-actions {
  flex-shrink: 0;
}

.delete-btn {
  width: 32px;
  height: 32px;
  background: rgba(255,107,107,0.2);
  border: 1px solid rgba(255,107,107,0.3);
  border-radius: 50%;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: rgba(255,107,107,0.3);
  transform: scale(1.1);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255,255,255,0.8);
}

.empty-icon {
  font-size: 64px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  margin: 0 0 12px 0;
  color: white;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
  color: rgba(255,255,255,0.6);
}

/* 浮动按钮 */
.fab {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255,107,107,0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fab:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 6px 25px rgba(255,107,107,0.6);
}

/* 动画 */
.notice-enter-active,
.notice-leave-active {
  transition: all 0.3s ease;
}

.notice-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.notice-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notice-container {
    padding: 80px 16px 16px;
  }
  
  .notice-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .notice-stats {
    justify-content: center;
  }
  
  .notice-filters {
    justify-content: flex-start;
  }
  
  .notice-item {
    padding: 16px;
  }
  
  .notice-header-info {
    flex-direction: column;
    gap: 4px;
  }
  
  .fab {
    bottom: 80px;
    right: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .stat-item {
    padding: 12px 16px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .notice-item {
    gap: 12px;
  }
  
  .notice-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
}
</style>