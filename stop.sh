#!/bin/bash

PROJECT_ROOT="/Users/tang/projects/vibe-coding-tracker"

echo "=== 停止所有服务 ==="

# 停止后端
if [ -f "$PROJECT_ROOT/logs/backend.pid" ]; then
    BACKEND_PID=$(cat "$PROJECT_ROOT/logs/backend.pid")
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo "后端服务已停止 (PID: $BACKEND_PID)"
    fi
    rm "$PROJECT_ROOT/logs/backend.pid"
fi

# 停止前端
if [ -f "$PROJECT_ROOT/logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PROJECT_ROOT/logs/frontend.pid")
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo "前端服务已停止 (PID: $FRONTEND_PID)"
    fi
    rm "$PROJECT_ROOT/logs/frontend.pid"
fi

echo "=== 所有服务已停止 ==="
