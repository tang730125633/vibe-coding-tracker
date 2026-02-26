# Vibe Coding 课程进度追踪器 - 前端

基于 React 18 + Vite + Tailwind CSS 构建的课程管理系统前端。

## 技术栈

- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios

## 功能特性

### 学员端
- 课程大纲查看
- 学习进度追踪
- 作业提交和查看批改结果
- 课程资料下载

### 老师端
- 学员管理（增删改查）
- 作业批改
- 资料上传
- 数据统计和分析

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

## 环境变量

复制 `.env.example` 为 `.env` 并配置：

```
VITE_API_BASE=http://localhost:8000
```

## 默认账号

### 老师账号
- 用户名: tang
- 密码: tang123

### 学员账号
由老师创建

## 项目结构

```
src/
├── api/              # API 调用封装
├── components/       # 通用组件
├── pages/           # 页面组件
│   ├── student/     # 学员端页面
│   └── teacher/     # 老师端页面
├── utils/           # 工具函数
├── App.jsx          # 路由配置
└── main.jsx         # 入口文件
```

## 设计规范

- 学员端主色调: 蓝色系 (#3b82f6)
- 老师端主色调: 紫色系 (#a855f7)
- 响应式设计，支持移动端和桌面端

