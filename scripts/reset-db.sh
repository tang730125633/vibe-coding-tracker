#!/bin/bash

PROJECT_ROOT="/Users/tang/projects/vibe-coding-tracker"
BACKEND_DIR="$PROJECT_ROOT/output/backend"

echo "=== 重置数据库 ==="

# 停止服务
if [ -f "$PROJECT_ROOT/logs/backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_ROOT/logs/backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo "已停止后端服务"
    fi
fi

# 删除数据库
if [ -f "$BACKEND_DIR/vibe_coding.db" ]; then
    rm "$BACKEND_DIR/vibe_coding.db"
    echo "已删除旧数据库"
fi

# 重新初始化
cd "$BACKEND_DIR"
"$PROJECT_ROOT/venv/bin/python" init_db.py

echo "=== 数据库重置完成 ==="
echo ""
echo "默认账号："
echo "  老师: teacher / teacher123"
echo "  学员: student1 / student123"
