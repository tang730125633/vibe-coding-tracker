from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime
from database import get_db
from models import User, Homework, Material, Progress, Course, UserRole, HomeworkStatus, ProgressStatus
from schemas import (
    UserResponse, UserCreate, UserUpdate, HomeworkResponse,
    HomeworkUpdate, MaterialCreate, MaterialResponse, StatsResponse
)
from auth import get_current_teacher, get_password_hash

router = APIRouter(prefix="/api", tags=["teacher"])

@router.get("/students", response_model=List[UserResponse])
def get_students(
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """获取学员列表"""
    students = db.query(User).filter(User.role == UserRole.student).all()
    return students

@router.post("/students", response_model=UserResponse)
def create_student(
    user: UserCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """添加学员"""
    # 检查用户名是否已存在
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # 创建学员
    db_user = User(
        username=user.username,
        password=get_password_hash(user.password),
        name=user.name,
        email=user.email,
        role=UserRole.student
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # 为新学员创建所有课程的进度记录
    courses = db.query(Course).all()
    for course in courses:
        progress = Progress(
            student_id=db_user.id,
            course_id=course.id,
            status=ProgressStatus.not_started
        )
        db.add(progress)
    db.commit()

    return db_user

@router.put("/students/{student_id}", response_model=UserResponse)
def update_student(
    student_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """编辑学员"""
    student = db.query(User).filter(
        User.id == student_id,
        User.role == UserRole.student
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 更新字段
    if user_update.name:
        student.name = user_update.name
    if user_update.email:
        student.email = user_update.email
    if user_update.password:
        student.password = get_password_hash(user_update.password)

    db.commit()
    db.refresh(student)
    return student

@router.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """删除学员"""
    student = db.query(User).filter(
        User.id == student_id,
        User.role == UserRole.student
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}

@router.get("/homework/all", response_model=List[HomeworkResponse])
def get_all_homework(
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """获取所有作业"""
    homework = db.query(Homework).order_by(Homework.submitted_at.desc()).all()
    return homework

@router.put("/homework/{homework_id}", response_model=HomeworkResponse)
def review_homework(
    homework_id: int,
    homework_update: HomeworkUpdate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """批改作业"""
    homework = db.query(Homework).filter(Homework.id == homework_id).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    homework.status = homework_update.status
    homework.teacher_comment = homework_update.teacher_comment
    homework.reviewed_at = datetime.utcnow()

    db.commit()
    db.refresh(homework)
    return homework

@router.post("/materials", response_model=MaterialResponse)
def upload_material(
    material: MaterialCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """上传资料"""
    # 检查课程是否存在
    course = db.query(Course).filter(Course.id == material.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db_material = Material(**material.dict())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

@router.get("/stats", response_model=StatsResponse)
def get_stats(
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """获取统计数据"""
    total_students = db.query(User).filter(User.role == UserRole.student).count()
    total_courses = db.query(Course).count()
    total_homework = db.query(Homework).count()
    pending_homework = db.query(Homework).filter(
        Homework.status == HomeworkStatus.pending
    ).count()

    # 计算完成率
    total_progress = db.query(Progress).count()
    completed_progress = db.query(Progress).filter(
        Progress.status == ProgressStatus.completed
    ).count()
    completion_rate = (completed_progress / total_progress * 100) if total_progress > 0 else 0

    # 计算作业提交率
    expected_homework = total_students * total_courses
    homework_submission_rate = (total_homework / expected_homework * 100) if expected_homework > 0 else 0

    return StatsResponse(
        total_students=total_students,
        total_courses=total_courses,
        total_homework=total_homework,
        pending_homework=pending_homework,
        completion_rate=round(completion_rate, 2),
        homework_submission_rate=round(homework_submission_rate, 2)
    )
