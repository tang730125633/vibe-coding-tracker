#!/bin/bash
set -e

PROJECT_ROOT="/Users/tang/projects/vibe-coding-tracker"

echo "=== Vibe Coding 课程进度追踪器 - Vercel 部署 ==="

# 检查 git
if [ ! -d "$PROJECT_ROOT/.git" ]; then
    echo "初始化 Git 仓库..."
    cd "$PROJECT_ROOT"
    git init
    git add .
    git commit -m "Initial commit: Vibe Coding 课程进度追踪器

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
fi

# 检查 GitHub 远程仓库
if ! git remote | grep -q origin; then
    echo ""
    echo "请先在 GitHub 创建仓库，然后运行："
    echo "  git remote add origin <你的仓库地址>"
    echo "  git push -u origin main"
    echo ""
    echo "然后继续部署："
    echo "  1. 访问 https://vercel.com"
    echo "  2. 导入你的 GitHub 仓库"
    echo "  3. 配置环境变量（见 DEPLOY.md）"
    echo "  4. 点击 Deploy"
    exit 0
fi

# 推送到 GitHub
echo "推送到 GitHub..."
git push -u origin main

echo ""
echo "=== 代码已推送到 GitHub ==="
echo ""
echo "接下来："
echo "  1. 访问 https://vercel.com"
echo "  2. 点击 'New Project'"
echo "  3. 导入你的 GitHub 仓库"
echo "  4. 配置环境变量（见 DEPLOY.md）"
echo "  5. 点击 Deploy"
echo ""
echo "详细步骤请查看 DEPLOY.md"
