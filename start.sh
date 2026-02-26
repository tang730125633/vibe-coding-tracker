#!/bin/bash
set -e

PROJECT_ROOT="/Users/tang/projects/vibe-coding-tracker"
BACKEND_DIR="$PROJECT_ROOT/output/backend"
FRONTEND_DIR="$PROJECT_ROOT/output/frontend"

echo "=== Vibe Coding 课程进度追踪器 - 本地启动 ==="

# 检查虚拟环境
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

# 创建日志目录
mkdir -p "$PROJECT_ROOT/logs"

# 启动后端
echo "启动后端服务..."
nohup "$PROJECT_ROOT/venv/bin/python" "$BACKEND_DIR/main.py" > "$PROJECT_ROOT/logs/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$PROJECT_ROOT/logs/backend.pid"
echo "  后端已启动 (PID: $BACKEND_PID)"
echo "  API: http://localhost:8000"
echo "  文档: http://localhost:8000/docs"

# 等待后端启动
sleep 2

# 检查前端依赖
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    echo "安装前端依赖..."
    npm install
fi

# 启动前端
echo "启动前端服务..."
npm run dev &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$PROJECT_ROOT/logs/frontend.pid"
echo "  前端已启动 (PID: $FRONTEND_PID)"
echo "  访问: http://localhost:5173"

echo ""
echo "=== 所有服务已启动 ==="
echo ""
echo "默认账号："
echo "  老师: teacher / teacher123"
echo "  学员: student1 / student123"
echo ""
echo "停止服务: ./stop.sh"
