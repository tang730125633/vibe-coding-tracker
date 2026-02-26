# Vibe Coding 课程进度追踪器 - 后端 API

## 技术栈

- FastAPI - 现代 Python Web 框架
- SQLAlchemy - ORM 数据库操作
- SQLite - 轻量级数据库
- JWT - 用户认证
- Pydantic - 数据验证

## 项目结构

```
backend/
├── main.py              # 主程序入口
├── database.py          # 数据库连接配置
├── models.py            # SQLAlchemy 数据模型
├── schemas.py           # Pydantic 请求/响应模型
├── auth.py              # JWT 认证和权限验证
├── init_db.py           # 数据库初始化脚本
├── requirements.txt     # Python 依赖
└── routes/
    ├── auth.py          # 认证路由
    ├── student.py       # 学员端路由
    └── teacher.py       # 老师端路由
```

## 快速开始

### 1. 安装依赖

```bash
cd /Users/tang/projects/vibe-coding-tracker/output/backend
pip install -r requirements.txt
```

### 2. 初始化数据库

```bash
python init_db.py
```

这会创建数据库并插入：
- 10 周课程数据
- 默认老师账号：username=tang, password=tang123

### 3. 启动服务器

```bash
python main.py
```

服务器将在 http://localhost:8000 启动

### 4. 查看 API 文档

访问 http://localhost:8000/docs 查看自动生成的 API 文档

## API 端点

### 认证 API

- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户信息

### 学员端 API

- `GET /api/courses` - 获取所有课程
- `GET /api/progress/me` - 获取我的进度
- `POST /api/homework` - 提交作业
- `GET /api/homework/me` - 获取我的作业列表
- `GET /api/materials` - 获取资料列表

### 老师端 API

- `GET /api/students` - 获取学员列表
- `POST /api/students` - 添加学员
- `PUT /api/students/{id}` - 编辑学员
- `DELETE /api/students/{id}` - 删除学员
- `GET /api/homework/all` - 获取所有作业
- `PUT /api/homework/{id}` - 批改作业
- `POST /api/materials` - 上传资料
- `GET /api/stats` - 获取统计数据

## 数据模型

### User (用户)
- id, username, password, role, name, email, created_at

### Course (课程)
- id, week_number, title, description, tech_stack, learning_goals, class_date

### Progress (进度)
- id, student_id, course_id, status, completed_at

### Homework (作业)
- id, student_id, course_id, content, file_url, link_url, status, teacher_comment, submitted_at, reviewed_at

### Material (资料)
- id, course_id, title, file_url, file_type, uploaded_at

## 认证说明

所有需要认证的 API 都需要在请求头中携带 JWT token：

```
Authorization: Bearer <your_token>
```

登录后会返回 token，前端需要保存并在后续请求中使用。

## 权限说明

- 学员（student）：只能访问学员端 API
- 老师（teacher）：可以访问所有 API

## 数据库位置

SQLite 数据库文件位于：
```
/Users/tang/projects/vibe-coding-tracker/data/vibe_coding.db
```

## 开发建议

1. 使用 FastAPI 自动生成的文档测试 API
2. 先创建老师账号，再通过老师账号添加学员
3. 学员登录后可以查看课程、提交作业
4. 老师可以批改作业、管理学员、查看统计

## 注意事项

- 默认允许所有来源的 CORS 请求（生产环境需要修改）
- JWT Secret Key 需要在生产环境中更换
- 密码使用 bcrypt 加密存储
- Token 有效期为 7 天
