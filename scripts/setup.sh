#!/bin/bash
set -e

PROJECT_ROOT="/Users/tang/projects/vibe-coding-tracker"
BACKEND_DIR="$PROJECT_ROOT/output/backend"

echo "=== 环境初始化 ==="

# 创建虚拟环境
if [ ! -d "$PROJECT_ROOT/venv" ]; then
    echo "创建 Python 虚拟环境..."
    python3 -m venv "$PROJECT_ROOT/venv"
fi

# 安装后端依赖
echo "安装后端依赖..."
"$PROJECT_ROOT/venv/bin/pip" install -q -r "$BACKEND_DIR/requirements.txt"

# 初始化数据库
echo "初始化数据库..."
cd "$BACKEND_DIR"
"$PROJECT_ROOT/venv/bin/python" init_db.py

# 安装前端依赖
echo "安装前端依赖..."
cd "$PROJECT_ROOT/output/frontend"
npm install

# 创建必要的目录
mkdir -p "$PROJECT_ROOT/logs"

echo "=== 环境初始化完成 ==="
echo ""
echo "启动服务: ./start.sh"
