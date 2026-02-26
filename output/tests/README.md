# 测试文档

## 测试概览

本项目包含完整的后端 API 测试和前端功能测试清单。

### 测试文件

- `test_api.py` - 后端 API 自动化测试（pytest）
- `test_frontend.md` - 前端功能手动测试清单
- `conftest.py` - pytest 配置和 fixtures
- `requirements-test.txt` - 测试依赖
- `run_tests.sh` - 一键运行测试脚本
- `bugs.md` - Bug 记录和已知问题

## 快速开始

### 运行后端测试

```bash
# 方式 1: 使用测试脚本（推荐）
cd /Users/tang/projects/vibe-coding-tracker
./output/tests/run_tests.sh

# 方式 2: 手动运行
pip3 install -r output/backend/requirements.txt
pip3 install -r output/tests/requirements-test.txt
pytest output/tests/test_api.py -v
```

### 运行前端测试

前端测试为手动测试，请按照 `test_frontend.md` 中的清单逐项测试。

```bash
# 1. 启动后端
cd output/backend
python3 main.py

# 2. 启动前端（新终端）
cd output/frontend
npm run dev

# 3. 打开浏览器访问 http://localhost:5173
# 4. 按照 test_frontend.md 清单进行测试
```

## 测试覆盖范围

### 后端 API 测试（test_api.py）

#### 1. 认证测试（6 个测试）
- ✅ 登录成功
- ✅ 登录失败 - 错误密码
- ✅ 登录失败 - 用户不存在
- ✅ 获取当前用户 - 有效 token
- ✅ 获取当前用户 - 无 token
- ✅ 获取当前用户 - 无效 token

#### 2. 学员端 API 测试（8 个测试）
- ✅ 获取课程列表
- ✅ 获取我的进度
- ✅ 获取我的进度 - 无 token
- ✅ 提交作业
- ✅ 提交作业 - 无效课程 ID
- ✅ 提交作业 - 无 token
- ✅ 获取我的作业列表
- ✅ 获取资料列表
- ✅ 按课程获取资料

#### 3. 老师端 API 测试（13 个测试）
- ✅ 获取学员列表
- ✅ 学员访问老师端 API - 权限拒绝
- ✅ 添加学员
- ✅ 添加学员 - 用户名已存在
- ✅ 编辑学员
- ✅ 编辑不存在的学员
- ✅ 删除学员
- ✅ 获取所有作业
- ✅ 批改作业
- ✅ 批改不存在的作业
- ✅ 上传资料
- ✅ 上传资料 - 无效课程
- ✅ 获取统计数据
- ✅ 学员访问统计数据 - 权限拒绝

#### 4. 健康检查测试（2 个测试）
- ✅ 根路径
- ✅ 健康检查

**总计: 29 个自动化测试**

### 前端功能测试（test_frontend.md）

- 登录流程测试（3 项）
- 学员端页面测试（6 个页面）
- 老师端页面测试（5 个页面）
- 权限控制测试（2 项）
- 响应式设计测试（2 项）
- 错误处理测试（2 项）
- 性能测试（2 项）

## 测试结果

### 预期结果

所有 29 个后端测试应该通过。如果有失败的测试，请检查：

1. **导入错误**: 确保在项目根目录运行测试
2. **数据库错误**: 删除 `test_vibe_coding.db` 重新运行
3. **认证错误**: 检查 JWT token 配置

### 查看覆盖率

```bash
pytest output/tests/test_api.py --cov=output/backend --cov-report=html
open htmlcov/index.html
```

## 测试策略

### 正常流程测试
- 测试 API 的正常使用场景
- 验证返回数据的正确性

### 边界情况测试
- 空数据、无效数据
- 不存在的资源（404）
- 重复数据（409）

### 权限测试
- 无 token 访问
- 无效 token 访问
- 学员访问老师端 API（403）

### 错误处理测试
- 验证错误状态码
- 验证错误信息

## 已知限制

1. **文件上传**: 当前只测试 URL 上传，不测试实际文件上传
2. **并发测试**: 未包含并发请求测试
3. **性能测试**: 未包含压力测试和负载测试
4. **前端测试**: 前端测试为手动测试，未使用自动化工具

## 后续改进

1. 添加前端自动化测试（Playwright / Cypress）
2. 添加集成测试（端到端测试）
3. 添加性能测试（Locust / k6）
4. 添加 CI/CD 集成（GitHub Actions）
5. 提高测试覆盖率到 90%+

## 问题反馈

如果发现 Bug，请记录在 `bugs.md` 中，包括：
- Bug 描述
- 复现步骤
- 预期行为 vs 实际行为
- 建议修复方案
