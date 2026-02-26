import pytest
import sys
from pathlib import Path
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 添加后端目录到 Python 路径
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from main import app
from database import Base, get_db
from models import User, Course, UserRole
from auth import get_password_hash

# 测试数据库
TEST_DATABASE_URL = "sqlite:///./test_vibe_coding.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def db():
    """创建测试数据库"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # 创建测试用户
    teacher = User(
        username="tang",
        password=get_password_hash("tang123"),
        name="Tang",
        email="tang@vibecoding.com",
        role=UserRole.teacher
    )
    student = User(
        username="student1",
        password=get_password_hash("student123"),
        name="Test Student",
        email="student@test.com",
        role=UserRole.student
    )
    db.add(teacher)
    db.add(student)

    # 创建测试课程
    for i in range(1, 11):
        course = Course(
            week_number=i,
            title=f"Week {i} Course",
            description=f"Week {i} description",
            tech_stack="Test Tech",
            learning_goals="Test goals",
            class_date=f"2026-0{(i-1)//4+1}-{(i-1)%4*7+9:02d}"
        )
        db.add(course)

    db.commit()

    yield db

    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
async def client():
    """创建测试客户端"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def teacher_token(client):
    """获取老师 token"""
    response = await client.post("/api/auth/login", json={
        "username": "tang",
        "password": "tang123"
    })
    return response.json()["access_token"]

@pytest.fixture
async def student_token(client):
    """获取学员 token"""
    response = await client.post("/api/auth/login", json={
        "username": "student1",
        "password": "student123"
    })
    return response.json()["access_token"]
