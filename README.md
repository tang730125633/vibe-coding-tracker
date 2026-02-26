# Vibe Coding 课程进度追踪器

学员进度管理系统，帮助老师追踪学员学习进度、批改作业、管理资料。

## 功能特性

### 学员端
- 查看课程大纲和进度
- 提交作业
- 下载学习资料
- 查看作业批改结果

### 老师端
- 学员管理（增删改查）
- 作业批改和评分
- 资料上传管理
- 数据统计分析

## 技术栈

- 后端: FastAPI + SQLAlchemy + SQLite
- 前端: React + Vite + TailwindCSS
- 部署: Vercel

## 本地运行

### 前置要求
- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 快速启动

```bash
# 克隆项目
git clone <your-repo-url>
cd vibe-coding-tracker

# 一键启动（会自动安装依赖、初始化数据库、启动服务）
./start.sh

# 访问应用
# 前端: http://localhost:5173
# 后端 API: http://localhost:8000
# API 文档: http://localhost:8000/docs
```

### 停止服务

```bash
./stop.sh
```

### 手动启动

如果需要分别启动前后端：

```bash
# 后端
cd output/backend
python3 -m venv ../../venv
source ../../venv/bin/activate
pip install -r requirements.txt
python init_db.py
python main.py

# 前端（新终端）
cd output/frontend
npm install
npm run dev
```

## 默认账号

系统初始化后会创建以下测试账号：

**老师账号**
- 用户名: `teacher`
- 密码: `teacher123`

**学员账号**
- 用户名: `student1`
- 密码: `student123`

## Vercel 部署

详细部署步骤请查看 [DEPLOY.md](./DEPLOY.md)

快速部署：

```bash
./deploy.sh
```

## API 文档

启动后端服务后访问：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 项目结构

```
vibe-coding-tracker/
├── output/
│   ├── backend/          # FastAPI 后端
│   │   ├── main.py       # 应用入口
│   │   ├── database.py   # 数据库配置
│   │   ├── models.py     # 数据模型
│   │   ├── schemas.py    # Pydantic 模型
│   │   ├── auth.py       # 认证逻辑
│   │   ├── init_db.py    # 数据库初始化
│   │   └── routes/       # API 路由
│   └── frontend/         # React 前端
│       ├── src/
│       │   ├── pages/    # 页面组件
│       │   ├── components/ # 通用组件
│       │   └── api/      # API 调用
│       └── package.json
├── api/                  # Vercel serverless 函数
├── data/                 # 进度追踪数据
├── scripts/              # 部署脚本
├── start.sh              # 本地启动脚本
├── stop.sh               # 停止服务脚本
├── deploy.sh             # 部署脚本
└── vercel.json           # Vercel 配置
```

## 开发

### 后端开发

```bash
cd output/backend
source ../../venv/bin/activate
python main.py
```

### 前端开发

```bash
cd output/frontend
npm run dev
```

### 数据库重置

```bash
cd output/backend
rm vibe_coding.db
python init_db.py
```

## 常见问题

### 端口被占用

如果 8000 或 5173 端口被占用，可以修改：
- 后端: `output/backend/main.py` 最后一行的端口号
- 前端: `output/frontend/vite.config.js` 添加 server.port 配置

### 数据库文件位置

SQLite 数据库文件位于 `output/backend/vibe_coding.db`

### API 连接失败

检查前端环境变量配置：
- 开发环境: `output/frontend/.env` 中的 `VITE_API_BASE`
- 生产环境: Vercel 环境变量

## License

MIT

## 作者

Tang - Vibe Coding 课程讲师
