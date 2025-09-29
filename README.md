# MyWebApp

一个基于 Vue 3 + Vite 构建的现代化多功能 Web 应用，提供音乐播放、文件管理、搜索和个人资料等功能。

## 📋 项目简介

shiyuapp 是一个功能丰富的单页面应用程序，采用现代化的前端技术栈构建。应用具有优雅的用户界面设计，包含动画效果和响应式布局，为用户提供流畅的交互体验。

## ✨ 主要功能

- 🎵 **音乐播放器** - 支持音频播放、可视化效果、播放列表管理
- 📁 **文件管理** - 文件浏览、上传、下载功能
- 🔍 **智能搜索** - 全局搜索功能，快速定位内容
- 🏠 **个性化首页** - 动态背景、鱼儿动画效果
- 📢 **通知中心** - 消息提醒和通知管理
- 👤 **个人资料** - 用户信息管理和设置
- 🎨 **动画效果** - 页面过渡动画、交互反馈

## 🛠️ 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 现代化状态管理库

### 构建工具
- **Vite** - 下一代前端构建工具
- **@vitejs/plugin-vue** - Vue 单文件组件支持

### UI 组件
- **Ionicons** - 现代化图标库
- **自定义组件** - 高度定制化的 UI 组件

### 开发工具
- **ES6+ Modules** - 现代 JavaScript 模块系统
- **CSS3** - 现代样式和动画
- **响应式设计** - 移动端适配

## 📦 安装指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd mywebapp
```

2. **安装依赖**
```bash
npm install
# 或使用 yarn
yarn install
```

3. **启动开发服务器**
```bash
npm run dev
# 或使用 yarn
yarn dev
```

4. **构建生产版本**
```bash
npm run build
# 或使用 yarn
yarn build
```

5. **预览生产构建**
```bash
npm run preview
# 或使用 yarn
yarn preview
```

## 🚀 使用示例

### 开发环境启动
```bash
# 启动开发服务器
npm run dev

# 应用将在 http://localhost:5173 运行
```

### 项目结构
```
mywebapp/
├── public/                 # 静态资源
│   ├── favicon/           # 网站图标
│   ├── files/             # 文件资源
│   ├── image/             # 图片资源
│   └── music/             # 音频文件
├── src/
│   ├── assets/            # 项目资源
│   ├── components/        # Vue 组件
│   │   ├── FileCard.vue   # 文件卡片组件
│   │   ├── FishAnimation.vue # 鱼儿动画组件
│   │   ├── MusicPlayer.vue   # 音乐播放器
│   │   ├── TimeBox.vue       # 时间显示组件
│   │   └── TopNav.vue        # 顶部导航
│   ├── composables/       # 组合式函数
│   ├── stores/            # Pinia 状态管理
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   ├── Music.vue      # 音乐页面
│   │   ├── Search.vue     # 搜索页面
│   │   ├── Notice.vue     # 通知页面
│   │   └── Profile.vue    # 个人资料页面
│   ├── App.vue            # 根组件
│   ├── main.js            # 应用入口
│   └── router.js          # 路由配置
├── index.html             # HTML 模板
├── package.json           # 项目配置
└── vite.config.js         # Vite 配置
```

### 核心功能使用

#### 音乐播放器
```javascript
// 在组件中使用音乐状态管理
import { useMusicStore } from '@/stores/music'

const musicStore = useMusicStore()
// 播放音乐
musicStore.play()
// 暂停音乐
musicStore.pause()
```

#### 文件管理
```javascript
// 使用文件状态管理
import { useFilesStore } from '@/stores/files'

const filesStore = useFilesStore()
// 获取文件列表
const files = filesStore.getFiles()
```

## 🔧 配置说明

### Vite 配置
项目使用 Vite 作为构建工具，配置了以下特性：
- Vue 3 单文件组件支持
- 路径别名 `@` 指向 `src` 目录
- Ionicons 自定义元素支持

### 路由配置
应用使用 Vue Router 4 进行页面路由管理：
- `/` - 首页
- `/search` - 搜索页面
- `/music` - 音乐播放页面
- `/notice` - 通知中心
- `/profile` - 个人资料

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下步骤：

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 使用 ES6+ 语法
- 遵循 Vue 3 Composition API 最佳实践
- 保持代码简洁和可读性
- 添加必要的注释和文档

### 提交规范
使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue Router 官方文档](https://router.vuejs.org/)
- [Ionicons 图标库](https://ionic.io/ionicons)

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发起 Pull Request
- 邮箱：[2521393424@qq.com]

---

⭐ 如果这个项目对您有帮助，请给它一个星标！