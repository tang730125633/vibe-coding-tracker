#!/bin/bash

# 测试运行脚本

echo "=== Vibe Coding 课程进度追踪器 - 测试脚本 ==="
echo ""

# 检查是否在项目根目录
if [ ! -f "data/prd.json" ]; then
    echo "错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 1. 安装后端依赖
echo "1. 安装后端依赖..."
pip3 install -q -r output/backend/requirements.txt
if [ $? -ne 0 ]; then
    echo "错误: 后端依赖安装失败"
    exit 1
fi

# 2. 安装测试依赖
echo "2. 安装测试依赖..."
pip3 install -q -r output/tests/requirements-test.txt
if [ $? -ne 0 ]; then
    echo "错误: 测试依赖安装失败"
    exit 1
fi

# 3. 初始化数据库（如果不存在）
if [ ! -f "data/vibe_coding.db" ]; then
    echo "3. 初始化数据库..."
    cd output/backend && python3 init_db.py && cd ../..
    if [ $? -ne 0 ]; then
        echo "错误: 数据库初始化失败"
        exit 1
    fi
else
    echo "3. 数据库已存在，跳过初始化"
fi

# 4. 运行测试
echo ""
echo "4. 运行 API 测试..."
echo "================================"
python3 -m pytest output/tests/test_api.py -v --tb=short

# 5. 显示测试结果
if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    echo "✅ 所有测试通过！"
    echo ""
    echo "查看覆盖率报告:"
    echo "  pytest output/tests/test_api.py --cov=output/backend --cov-report=html"
    echo "  open htmlcov/index.html"
else
    echo ""
    echo "================================"
    echo "❌ 部分测试失败，请查看上面的错误信息"
    echo ""
    echo "常见问题:"
    echo "  1. 导入错误: 检查 Python 路径和模块名称"
    echo "  2. 数据库错误: 删除 test_vibe_coding.db 重新运行"
    echo "  3. 认证错误: 检查 JWT token 生成逻辑"
fi

echo ""
echo "前端测试清单: output/tests/test_frontend.md"
echo "Bug 记录: output/tests/bugs.md"
