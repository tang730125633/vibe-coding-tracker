# Vercel 部署指南

本文档详细说明如何将 Vibe Coding 课程进度追踪器部署到 Vercel。

## 前置要求

1. GitHub 账号
2. Vercel 账号（可用 GitHub 登录）
3. 项目代码已推送到 GitHub

## 部署步骤

### 1. 准备 GitHub 仓库

如果还没有推送代码到 GitHub：

```bash
cd /Users/tang/projects/vibe-coding-tracker

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Vibe Coding 课程进度追踪器"

# 在 GitHub 创建新仓库后，添加远程仓库
git remote add origin https://github.com/你的用户名/vibe-coding-tracker.git

# 推送
git push -u origin main
```

或者使用快捷脚本：

```bash
./deploy.sh
```

### 2. 连接 Vercel

1. 访问 https://vercel.com
2. 点击右上角 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub" 用 GitHub 账号登录
4. 授权 Vercel 访问你的 GitHub 仓库

### 3. 导入项目

1. 在 Vercel 控制台点击 "Add New..." → "Project"
2. 找到你的 `vibe-coding-tracker` 仓库
3. 点击 "Import"

### 4. 配置项目

#### 4.1 构建设置

Vercel 会自动检测到 `vercel.json` 配置，无需手动配置。

如果需要手动配置：
- Framework Preset: `Vite`
- Root Directory: `./`
- Build Command: `cd output/frontend && npm run build`
- Output Directory: `output/frontend/dist`

#### 4.2 环境变量

点击 "Environment Variables"，添加以下变量：

**必需变量**

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `SECRET_KEY` | 随机字符串（至少32位） | JWT 加密密钥 |
| `DATABASE_URL` | `sqlite:///./vibe_coding.db` | 数据库连接 |

**可选变量**

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PYTHON_VERSION` | `3.11` | Python 版本 |

生成安全的 SECRET_KEY：

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 5. 部署

1. 确认所有配置正确
2. 点击 "Deploy"
3. 等待部署完成（通常 2-3 分钟）

### 6. 验证部署

部署成功后：

1. 访问 Vercel 提供的域名（如 `https://vibe-coding-tracker.vercel.app`）
2. 测试登录功能
3. 检查 API 是否正常工作

测试 API：
```bash
curl https://你的域名.vercel.app/api/health
```

应该返回：
```json
{"status": "ok"}
```

### 7. 自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

## 数据库说明

### SQLite 限制

Vercel serverless 函数是无状态的，每次请求可能在不同的实例上运行。SQLite 文件系统数据库在这种环境下有限制：

- 数据不会持久化（重新部署后丢失）
- 多实例可能导致数据不一致

### 生产环境建议

对于生产环境，建议使用云数据库：

**选项 1: Vercel Postgres**
```bash
# 在 Vercel 项目中添加 Postgres
vercel postgres create
```

**选项 2: PlanetScale (MySQL)**
1. 注册 https://planetscale.com
2. 创建数据库
3. 获取连接字符串
4. 更新 Vercel 环境变量 `DATABASE_URL`

**选项 3: Supabase (PostgreSQL)**
1. 注册 https://supabase.com
2. 创建项目
3. 获取连接字符串
4. 更新 Vercel 环境变量 `DATABASE_URL`

修改后端代码以支持 PostgreSQL：

```bash
# 更新 requirements.txt
pip install psycopg2-binary

# 修改 database.py 中的 DATABASE_URL
```

## 更新部署

每次推送到 GitHub main 分支，Vercel 会自动重新部署。

手动触发部署：
1. 在 Vercel 控制台进入项目
2. 点击 "Deployments"
3. 点击最新部署右侧的 "..." → "Redeploy"

## 环境管理

Vercel 支持多环境：

- **Production**: main 分支自动部署
- **Preview**: 其他分支和 PR 自动部署预览版本
- **Development**: 本地开发环境

为不同环境设置不同的环境变量：
1. 在 Vercel 项目设置中点击 "Environment Variables"
2. 为每个变量选择适用的环境（Production / Preview / Development）

## 常见问题

### 1. 部署失败：找不到模块

**问题**: `ModuleNotFoundError: No module named 'xxx'`

**解决**:
- 确认 `output/backend/requirements.txt` 包含所有依赖
- 检查 Python 版本兼容性

### 2. API 404 错误

**问题**: 前端无法访问 `/api/*` 路径

**解决**:
- 检查 `vercel.json` 中的路由配置
- 确认 `api/index.py` 文件存在
- 查看 Vercel 部署日志

### 3. CORS 错误

**问题**: 浏览器控制台显示 CORS 错误

**解决**:
- 检查 `output/backend/main.py` 中的 CORS 配置
- 确认 `allow_origins` 包含你的域名

### 4. 数据库初始化

**问题**: 首次部署后没有默认账号

**解决**:
Vercel serverless 环境下需要手动初始化数据库。有两个方案：

**方案 A: 使用初始化 API**
```bash
curl -X POST https://你的域名.vercel.app/api/init-db
```

**方案 B: 在代码中自动初始化**
修改 `api/index.py`，在应用启动时检查并初始化数据库。

### 5. 环境变量不生效

**问题**: 修改环境变量后没有生效

**解决**:
- 修改环境变量后需要重新部署
- 在 Vercel 控制台触发 "Redeploy"

### 6. 构建超时

**问题**: 部署时构建超时

**解决**:
- 检查 `package.json` 中的依赖是否过多
- 考虑使用 `npm ci` 代替 `npm install`
- 清理 node_modules 缓存

## 监控和日志

### 查看日志

1. 在 Vercel 控制台进入项目
2. 点击 "Deployments"
3. 点击具体部署查看构建日志
4. 点击 "Functions" 查看运行时日志

### 性能监控

Vercel 提供内置的性能监控：
1. 在项目中点击 "Analytics"
2. 查看请求量、响应时间等指标

### 错误追踪

建议集成错误追踪服务：
- Sentry
- LogRocket
- Datadog

## 成本

Vercel 免费计划包括：
- 100GB 带宽/月
- 100 小时 serverless 函数执行时间/月
- 无限部署

对于小型项目（如课程追踪器），免费计划通常足够。

## 安全建议

1. **SECRET_KEY**: 使用强随机字符串，不要提交到代码仓库
2. **环境变量**: 敏感信息只存储在 Vercel 环境变量中
3. **HTTPS**: Vercel 自动提供 HTTPS，确保所有请求使用 HTTPS
4. **CORS**: 生产环境限制 `allow_origins` 为你的域名
5. **认证**: 定期更新 JWT 密钥和密码策略

## 回滚

如果新部署出现问题：

1. 在 Vercel 控制台点击 "Deployments"
2. 找到之前的稳定版本
3. 点击 "..." → "Promote to Production"

## 备份

定期备份数据库：

```bash
# 本地开发环境
cp output/backend/vibe_coding.db backups/vibe_coding_$(date +%Y%m%d).db
```

生产环境使用云数据库的自动备份功能。

## 下一步

- 配置自定义域名
- 设置 CI/CD 自动化测试
- 集成错误追踪
- 配置生产数据库
- 添加监控告警

## 支持

遇到问题？

1. 查看 Vercel 文档: https://vercel.com/docs
2. 查看项目 README.md
3. 联系项目维护者

---

部署愉快！
