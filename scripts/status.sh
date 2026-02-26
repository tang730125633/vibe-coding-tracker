#!/bin/bash

PROJECT_ROOT="/Users/tang/projects/vibe-coding-tracker"

echo "=== 服务状态检查 ==="

# 检查后端
if [ -f "$PROJECT_ROOT/logs/backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_ROOT/logs/backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "后端服务: 运行中 (PID: $BACKEND_PID)"
        echo "  API: http://localhost:8000"
        echo "  文档: http://localhost:8000/docs"
    else
        echo "后端服务: 已停止"
    fi
else
    echo "后端服务: 未启动"
fi

# 检查前端
if [ -f "$PROJECT_ROOT/logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_ROOT/logs/frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "前端服务: 运行中 (PID: $FRONTEND_PID)"
        echo "  访问: http://localhost:5173"
    else
        echo "前端服务: 已停止"
    fi
else
    echo "前端服务: 未启动"
fi

# 检查数据库
if [ -f "$PROJECT_ROOT/output/backend/vibe_coding.db" ]; then
    DB_SIZE=$(du -h "$PROJECT_ROOT/output/backend/vibe_coding.db" | cut -f1)
    echo "数据库: 存在 ($DB_SIZE)"
else
    echo "数据库: 不存在"
fi

echo ""
echo "=== 日志文件 ==="
if [ -f "$PROJECT_ROOT/logs/backend.log" ]; then
    echo "后端日志: $PROJECT_ROOT/logs/backend.log"
    echo "最后 5 行:"
    tail -n 5 "$PROJECT_ROOT/logs/backend.log"
fi
