import sys
import os

# 添加后端目录到 Python 路径
backend_path = os.path.join(os.path.dirname(__file__), '..', 'output', 'backend')
sys.path.insert(0, backend_path)

# 初始化数据库（Vercel 每次冷启动都需要）
from database import engine, SessionLocal, Base
from models import User, Course, UserRole
from auth import get_password_hash

# 创建表
Base.metadata.create_all(bind=engine)

# 初始化默认数据
db = SessionLocal()
try:
    # 检查是否已有老师账号
    existing_teacher = db.query(User).filter(User.username == "tang").first()
    if not existing_teacher:
        # 创建默认老师
        teacher = User(
            username="tang",
            password=get_password_hash("tang123"),
            name="Tang",
            email="tang@vibecoding.com",
            role=UserRole.teacher
        )
        db.add(teacher)

        # 创建课程数据
        courses_data = [
            {"week_number": 1, "title": "AI Studio 基础功能", "description": "学习 Gemini AI Studio", "tech_stack": "Gemini AI Studio", "learning_goals": "掌握 AI Studio", "class_date": "2026-01-09"},
            {"week_number": 2, "title": "上线部署", "description": "学习部署", "tech_stack": "Vercel + Railway", "learning_goals": "掌握部署", "class_date": "2026-01-16"},
            {"week_number": 3, "title": "API 和上线部署", "description": "API 集成", "tech_stack": "API 集成", "learning_goals": "集成 API", "class_date": "2026-01-23"},
            {"week_number": 4, "title": "Cursor + Cline", "description": "AI 辅助编程", "tech_stack": "Cursor + Cline", "learning_goals": "掌握 AI 工具", "class_date": "2026-01-30"},
            {"week_number": 5, "title": "实战项目开发", "description": "完整应用", "tech_stack": "完整应用", "learning_goals": "独立开发", "class_date": "2026-02-06"},
            {"week_number": 6, "title": "高级功能实现", "description": "高级功能", "tech_stack": "进阶技术", "learning_goals": "高级功能", "class_date": "2026-02-13"},
            {"week_number": 7, "title": "性能优化", "description": "优化性能", "tech_stack": "性能优化", "learning_goals": "优化方法", "class_date": "2026-02-20"},
            {"week_number": 8, "title": "用户体验提升", "description": "UI/UX", "tech_stack": "UX/UI", "learning_goals": "设计界面", "class_date": "2026-02-27"},
            {"week_number": 9, "title": "项目打磨", "description": "完善细节", "tech_stack": "细节完善", "learning_goals": "项目收尾", "class_date": "2026-03-06"},
            {"week_number": 10, "title": "项目展示", "description": "作品展示", "tech_stack": "作品发布", "learning_goals": "完成课程", "class_date": "2026-03-13"}
        ]

        for course_data in courses_data:
            course = Course(**course_data)
            db.add(course)

        db.commit()
finally:
    db.close()

from main import app

# Vercel serverless 函数入口
def handler(request, context):
    return app(request, context)
