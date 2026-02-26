# Vercel 部署检查清单

在部署到 Vercel 之前，请确认以下项目：

## 代码准备

- [ ] 所有代码已提交到 Git
- [ ] 代码已推送到 GitHub
- [ ] `.gitignore` 已配置（不提交敏感信息）
- [ ] `vercel.json` 配置正确
- [ ] `api/index.py` serverless 入口已创建

## 环境配置

- [ ] `.env.example` 已创建（不包含真实密钥）
- [ ] 前端 API 配置支持生产环境（`/api` 路径）
- [ ] 后端 CORS 配置允许生产域名

## 依赖检查

- [ ] `output/backend/requirements.txt` 包含所有依赖
- [ ] `output/frontend/package.json` 包含所有依赖
- [ ] 前端可以成功构建（`npm run build`）

## 功能测试

- [ ] 本地环境可以正常启动
- [ ] 登录功能正常
- [ ] API 端点正常响应
- [ ] 前端页面正常显示

## Vercel 配置

- [ ] 已注册 Vercel 账号
- [ ] 已连接 GitHub 账号
- [ ] 准备好环境变量：
  - [ ] `SECRET_KEY`（使用强随机字符串）
  - [ ] `DATABASE_URL`（SQLite 或云数据库）

## 部署后验证

- [ ] 访问生产域名，页面正常加载
- [ ] 测试登录功能
- [ ] 测试 API 端点（`/api/health`）
- [ ] 检查浏览器控制台无错误
- [ ] 检查 Vercel 函数日志无错误

## 可选优化

- [ ] 配置自定义域名
- [ ] 设置生产数据库（PlanetScale/Supabase）
- [ ] 配置错误追踪（Sentry）
- [ ] 设置监控告警
- [ ] 配置 CI/CD 自动测试

## 常见问题

### 构建失败

检查：
- 依赖是否完整
- Node.js/Python 版本是否兼容
- 构建命令是否正确

### API 404

检查：
- `vercel.json` 路由配置
- `api/index.py` 是否存在
- 前端 API baseURL 配置

### CORS 错误

检查：
- 后端 CORS 配置
- 是否允许生产域名

### 数据库问题

SQLite 在 serverless 环境有限制，建议：
- 使用 Vercel Postgres
- 使用 PlanetScale
- 使用 Supabase

## 部署命令

```bash
# 1. 推送代码
./deploy.sh

# 2. 在 Vercel 控制台完成部署
# 访问 https://vercel.com
```

## 回滚计划

如果部署出现问题：
1. 在 Vercel 控制台找到之前的稳定版本
2. 点击 "Promote to Production"
3. 或者在本地回滚代码并重新部署

## 支持

遇到问题？
- 查看 [DEPLOY.md](./DEPLOY.md) 详细指南
- 查看 Vercel 部署日志
- 查看 Vercel 函数日志

---

准备好了？运行 `./deploy.sh` 开始部署！
