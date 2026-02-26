import sys
import os
sys.path.append(os.path.dirname(__file__))

from database import engine, SessionLocal, Base
from models import User, Course, Progress, UserRole, ProgressStatus
from auth import get_password_hash

def init_database():
    """初始化数据库"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

    db = SessionLocal()

    try:
        # 检查是否已有数据
        existing_courses = db.query(Course).count()
        if existing_courses > 0:
            print("Database already initialized. Skipping...")
            return

        # 创建默认老师账号
        print("Creating default teacher account...")
        teacher = User(
            username="tang",
            password=get_password_hash("tang123"),
            name="Tang",
            email="tang@vibecoding.com",
            role=UserRole.teacher
        )
        db.add(teacher)
        db.commit()
        print(f"Teacher account created: username=tang, password=tang123")

        # 创建 10 周课程数据
        print("Creating course data...")
        courses_data = [
            {
                "week_number": 1,
                "title": "AI Studio 基础功能",
                "description": "学习 Gemini AI Studio 的基本使用方法，了解对话式 AI 编程",
                "tech_stack": "Gemini AI Studio",
                "learning_goals": "掌握 AI Studio 界面操作，能够使用对话方式生成简单代码",
                "class_date": "2026-01-09"
            },
            {
                "week_number": 2,
                "title": "上线部署",
                "description": "学习如何将项目部署到线上，让作品可以被访问",
                "tech_stack": "Vercel + Railway",
                "learning_goals": "掌握 Vercel 部署流程，理解前后端分离部署",
                "class_date": "2026-01-16"
            },
            {
                "week_number": 3,
                "title": "API 和上线部署",
                "description": "深入学习 API 集成和高级部署技巧",
                "tech_stack": "API 集成",
                "learning_goals": "能够集成第三方 API，完成复杂功能开发",
                "class_date": "2026-01-23"
            },
            {
                "week_number": 4,
                "title": "Cursor + Cline",
                "description": "学习使用 IDE 集成的 AI 工具，提升开发效率",
                "tech_stack": "Cursor + Cline + AI 辅助编程",
                "learning_goals": "掌握 Cursor 和 Cline 的使用，能够用 AI 修改和优化代码",
                "class_date": "2026-01-30"
            },
            {
                "week_number": 5,
                "title": "实战项目开发",
                "description": "从零开始开发一个完整的 Web 应用",
                "tech_stack": "完整应用开发",
                "learning_goals": "独立完成一个可展示的项目，包含前后端功能",
                "class_date": "2026-02-06"
            },
            {
                "week_number": 6,
                "title": "高级功能实现",
                "description": "学习更复杂的功能开发，如用户认证、数据库操作",
                "tech_stack": "进阶技术",
                "learning_goals": "掌握用户系统、数据持久化等高级功能",
                "class_date": "2026-02-13"
            },
            {
                "week_number": 7,
                "title": "性能优化",
                "description": "学习如何优化应用性能，提升用户体验",
                "tech_stack": "性能优化技巧",
                "learning_goals": "理解性能瓶颈，掌握常见优化方法",
                "class_date": "2026-02-20"
            },
            {
                "week_number": 8,
                "title": "用户体验提升",
                "description": "学习 UI/UX 设计原则，让应用更美观易用",
                "tech_stack": "UX/UI 设计",
                "learning_goals": "能够设计友好的用户界面，提升产品质量",
                "class_date": "2026-02-27"
            },
            {
                "week_number": 9,
                "title": "项目打磨",
                "description": "完善项目细节，准备作品展示",
                "tech_stack": "细节完善",
                "learning_goals": "学会项目收尾，处理边界情况和异常",
                "class_date": "2026-03-06"
            },
            {
                "week_number": 10,
                "title": "项目展示",
                "description": "展示最终作品，分享学习心得",
                "tech_stack": "作品发布",
                "learning_goals": "完成课程，拥有可展示的作品集",
                "class_date": "2026-03-13"
            }
        ]

        for course_data in courses_data:
            course = Course(**course_data)
            db.add(course)

        db.commit()
        print(f"Created {len(courses_data)} courses successfully!")

        print("\nDatabase initialization completed!")
        print("\nDefault credentials:")
        print("  Teacher - username: tang, password: tang123")
        print("\nYou can now start the server with: python main.py")

    except Exception as e:
        print(f"Error during initialization: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
