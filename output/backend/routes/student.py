from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Course, Progress, Homework, Material, User
from schemas import (
    CourseResponse, ProgressResponse, HomeworkCreate,
    HomeworkResponse, MaterialResponse
)
from auth import get_current_user

router = APIRouter(prefix="/api", tags=["student"])

@router.get("/courses", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    """获取所有课程"""
    courses = db.query(Course).order_by(Course.week_number).all()
    return courses

@router.get("/progress/me", response_model=List[ProgressResponse])
def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取我的进度"""
    progress = db.query(Progress).filter(
        Progress.student_id == current_user.id
    ).all()
    return progress

@router.post("/homework", response_model=HomeworkResponse)
def submit_homework(
    homework: HomeworkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """提交作业"""
    # 检查课程是否存在
    course = db.query(Course).filter(Course.id == homework.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # 创建作业
    db_homework = Homework(
        student_id=current_user.id,
        **homework.dict()
    )
    db.add(db_homework)
    db.commit()
    db.refresh(db_homework)
    return db_homework

@router.get("/homework/me", response_model=List[HomeworkResponse])
def get_my_homework(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取我的作业列表"""
    homework = db.query(Homework).filter(
        Homework.student_id == current_user.id
    ).order_by(Homework.submitted_at.desc()).all()
    return homework

@router.get("/materials", response_model=List[MaterialResponse])
def get_materials(
    course_id: int = None,
    db: Session = Depends(get_db)
):
    """获取资料列表"""
    query = db.query(Material)
    if course_id:
        query = query.filter(Material.course_id == course_id)
    materials = query.order_by(Material.uploaded_at.desc()).all()
    return materials
