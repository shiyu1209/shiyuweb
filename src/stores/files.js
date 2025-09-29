import { reactive, computed } from 'vue'

// 马川贺的个人文件存储
const state = reactive({
  files: [
    // 获奖证书文档
    { 
      id: 1,
      name: '省级_全国大学生数学建模竞赛 二等奖马川贺.pdf', 
      type: 'document', 
      size: '2.1MB', 
      date: '2024-09-15', 
      category: '获奖证书',
      path: '/files/documents/省级_全国大学生数学建模竞赛 二等奖马川贺.pdf',
      tags: ['数学建模', '省级', '二等奖', '竞赛']
    },
    { 
      id: 2,
      name: '国家级：第六届"泰迪杯"数据分析技能赛三等奖 马川贺.pdf', 
      type: 'document', 
      size: '1.8MB', 
      date: '2024-08-20', 
      category: '获奖证书',
      path: '/files/documents/国家级：第六届"泰迪杯"数据分析技能赛三等奖 马川贺  .pdf',
      tags: ['泰迪杯', '国家级', '数据分析', '三等奖']
    },
    { 
      id: 3,
      name: 'MathorCup高校数学建模挑战赛--大数据竞赛三等奖马川贺.pdf', 
      type: 'document', 
      size: '2.3MB', 
      date: '2023-12-10', 
      category: '获奖证书',
      path: '/files/documents/国家级2023年MathorCup高校数学建模挑战赛--大数据竞赛三等奖马川贺  .pdf',
      tags: ['MathorCup', '国家级', '数学建模', '大数据', '三等奖']
    },
    { 
      id: 4,
      name: '省级 2024东北三省数学建模联赛 二等奖.pdf', 
      type: 'document', 
      size: '1.9MB', 
      date: '2024-06-15', 
      category: '获奖证书',
      path: '/files/documents/省级 2024东北三省数学建模联赛 二等奖.pdf',
      tags: ['东北三省', '省级', '数学建模', '二等奖']
    },
    { 
      id: 5,
      name: '"正大杯"第十四届全国大学生市场调查与分析大赛省三.pdf', 
      type: 'document', 
      size: '1.5MB', 
      date: '2024-05-20', 
      category: '获奖证书',
      path: '/files/documents/"正大杯"第十四届全国大学生市场调查与分析大赛黑龙江赛区本科生组结果公示---省三.pdf',
      tags: ['正大杯', '市场调查', '数据分析', '省级', '三等奖']
    },
    
    // 个人照片
    { 
      id: 6,
      name: '头像.jpg', 
      type: 'image', 
      size: '856KB', 
      date: '2024-09-01', 
      category: '个人照片',
      path: '/image/头像.jpg',
      tags: ['头像', '个人照片', '马川贺']
    },
    { 
      id: 7,
      name: '优秀学生奖学金.png', 
      type: 'image', 
      size: '1.2MB', 
      date: '2024-07-10', 
      category: '获奖证书',
      path: '/files/images/优秀学生奖学金.png',
      tags: ['奖学金', '优秀学生', '荣誉']
    },
    { 
      id: 8,
      name: '省级_全国大学生数学建模竞赛 二等奖马川贺.jpg', 
      type: 'image', 
      size: '2.1MB', 
      date: '2024-09-15', 
      category: '获奖证书',
      path: '/files/images/省级_全国大学生数学建模竞赛 二等奖马川贺.jpg',
      tags: ['数学建模', '证书照片', '二等奖']
    },
    
    // 音乐文件
    { 
      id: 9,
      name: '偏向.mp3', 
      type: 'audio', 
      size: '4.2MB', 
      date: '2024-08-15', 
      category: '音乐收藏',
      path: '/music/偏向.mp3',
      tags: ['音乐', '收藏', '流行']
    },
    { 
      id: 10,
      name: '一路向北.mp3', 
      type: 'audio', 
      size: '3.8MB', 
      date: '2024-08-15', 
      category: '音乐收藏',
      path: '/music/一路向北.mp3',
      tags: ['音乐', '收藏', '经典']
    },
    { 
      id: 11,
      name: '雨爱.mp3', 
      type: 'audio', 
      size: '4.1MB', 
      date: '2024-08-15', 
      category: '音乐收藏',
      path: '/music/雨爱.mp3',
      tags: ['音乐', '收藏', '抒情']
    },
    { 
      id: 12,
      name: '在加纳共和国离婚.mp3', 
      type: 'audio', 
      size: '3.9MB', 
      date: '2024-08-15', 
      category: '音乐收藏',
      path: '/music/在加纳共和国离婚.mp3',
      tags: ['音乐', '收藏', '独特']
    },
    { 
      id: 13,
      name: '租购.mp3', 
      type: 'audio', 
      size: '4.0MB', 
      date: '2024-08-15', 
      category: '音乐收藏',
      path: '/music/租购.mp3',
      tags: ['音乐', '收藏', '现代']
    }
  ],
  
  searchHistory: ['数学建模竞赛', '泰迪杯', '获奖证书', '数据分析', '马川贺', '音乐'],
  recentFiles: []
})

// 计算属性
const filesByCategory = computed(() => {
  const categories = {}
  state.files.forEach(file => {
    if (!categories[file.category]) {
      categories[file.category] = []
    }
    categories[file.category].push(file)
  })
  return categories
})

const fileTypeStats = computed(() => {
  const stats = {}
  state.files.forEach(file => {
    stats[file.type] = (stats[file.type] || 0) + 1
  })
  return stats
})

// 方法
function searchFiles(keyword) {
  if (!keyword.trim()) return []
  
  const searchTerm = keyword.toLowerCase()
  return state.files.filter(file => {
    return (
      file.name.toLowerCase().includes(searchTerm) ||
      file.category.toLowerCase().includes(searchTerm) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  })
}

function addToSearchHistory(term) {
  if (term && !state.searchHistory.includes(term)) {
    state.searchHistory.unshift(term)
    if (state.searchHistory.length > 10) {
      state.searchHistory.pop()
    }
  }
}

function addToRecentFiles(file) {
  const index = state.recentFiles.findIndex(f => f.id === file.id)
  if (index > -1) {
    state.recentFiles.splice(index, 1)
  }
  state.recentFiles.unshift(file)
  if (state.recentFiles.length > 5) {
    state.recentFiles.pop()
  }
}

export function useFiles() {
  return {
    files: state.files,
    searchHistory: state.searchHistory,
    recentFiles: state.recentFiles,
    filesByCategory,
    fileTypeStats,
    searchFiles,
    addToSearchHistory,
    addToRecentFiles
  }
}