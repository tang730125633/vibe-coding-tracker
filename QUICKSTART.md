# 快速参考

## 本地开发

```bash
# 初始化环境（首次运行）
./scripts/setup.sh

# 启动所有服务
./start.sh

# 停止所有服务
./stop.sh

# 查看服务状态
./scripts/status.sh

# 重置数据库
./scripts/reset-db.sh
```

## 访问地址

- 前端: http://localhost:5173
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

## 默认账号

**老师**
- 用户名: `teacher`
- 密码: `teacher123`

**学员**
- 用户名: `student1`
- 密码: `student123`

## Vercel 部署

```bash
# 推送到 GitHub 并准备部署
./deploy.sh

# 然后访问 https://vercel.com 完成部署
```

详细步骤见 [DEPLOY.md](./DEPLOY.md)

## 项目结构

```
vibe-coding-tracker/
├── output/
│   ├── backend/          # FastAPI 后端
│   └── frontend/         # React 前端
├── api/                  # Vercel serverless 函数
├── scripts/              # 辅助脚本
├── data/                 # 进度追踪
├── start.sh              # 启动服务
├── stop.sh               # 停止服务
├── deploy.sh             # 部署脚本
├── README.md             # 完整文档
└── DEPLOY.md             # 部署指南
```

## 常用命令

### 后端

```bash
cd output/backend

# 激活虚拟环境
source ../../venv/bin/activate

# 运行后端
python main.py

# 初始化数据库
python init_db.py
```

### 前端

```bash
cd output/frontend

# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 环境变量

### 后端 (.env)

```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./vibe_coding.db
```

### 前端 (output/frontend/.env)

```bash
VITE_API_BASE=http://localhost:8000
```

## API 端点

### 认证
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户

### 学员端
- `GET /api/courses` - 课程列表
- `GET /api/progress/me` - 我的进度
- `POST /api/homework` - 提交作业
- `GET /api/homework/me` - 我的作业
- `GET /api/materials` - 资料列表

### 老师端
- `GET /api/students` - 学员列表
- `POST /api/students` - 添加学员
- `PUT /api/students/:id` - 编辑学员
- `DELETE /api/students/:id` - 删除学员
- `GET /api/homework/all` - 所有作业
- `PUT /api/homework/:id` - 批改作业
- `POST /api/materials` - 上传资料
- `GET /api/stats` - 统计数据

## 故障排查

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :8000
lsof -i :5173

# 杀死进程
kill -9 <PID>
```

### 数据库问题

```bash
# 重置数据库
./scripts/reset-db.sh
```

### 依赖问题

```bash
# 重新安装后端依赖
source venv/bin/activate
pip install -r output/backend/requirements.txt

# 重新安装前端依赖
cd output/frontend
rm -rf node_modules package-lock.json
npm install
```

## 日志位置

- 后端日志: `logs/backend.log`
- 前端日志: 浏览器控制台

## 更多信息

- 完整文档: [README.md](./README.md)
- 部署指南: [DEPLOY.md](./DEPLOY.md)
- API 文档: http://localhost:8000/docs
