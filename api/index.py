import sys
import os

# 添加后端目录到 Python 路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'output', 'backend'))

from main import app

# Vercel serverless 函数入口
def handler(request, context):
    return app(request, context)
