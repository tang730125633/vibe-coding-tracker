# Bug 记录

## Bug 列表

### Bug #1: [待测试后填写]
**严重程度**: P0 / P1 / P2
**发现时间**: YYYY-MM-DD
**发现位置**: 前端/后端
**描述**:
**复现步骤**:
1.
2.
3.
**预期行为**:
**实际行为**:
**建议修复**:

---

## 已知问题

### 1. 数据库路径问题
**描述**: conftest.py 中的测试数据库路径可能需要调整
**影响**: 测试运行时可能找不到数据库文件
**建议**: 使用绝对路径或确保在正确的目录运行测试

### 2. 新学员进度记录
**描述**: 新创建的学员没有自动创建进度记录
**影响**: 学员端可能看不到进度
**状态**: 已在 teacher.py 的 create_student 中修复

### 3. 文件上传功能
**描述**: 当前只支持 URL 上传，不支持实际文件上传
**影响**: 用户体验不够好
**建议**: 后续可以集成文件存储服务（如 Cloudinary, AWS S3）

---

## 测试注意事项

1. **测试前准备**
   - 确保后端依赖已安装: `pip install -r output/backend/requirements.txt`
   - 确保测试依赖已安装: `pip install -r output/tests/requirements-test.txt`
   - 确保数据库已初始化: `cd output/backend && python init_db.py`

2. **运行测试**
   - 在项目根目录运行: `pytest output/tests/test_api.py -v`
   - 查看覆盖率: `pytest output/tests/test_api.py --cov=output/backend --cov-report=html`

3. **测试隔离**
   - 每个测试使用独立的测试数据库
   - 测试完成后自动清理数据

4. **常见问题**
   - 如果测试失败，检查后端代码是否有语法错误
   - 如果导入失败，检查 Python 路径是否正确
   - 如果数据库错误，尝试删除测试数据库文件重新运行
