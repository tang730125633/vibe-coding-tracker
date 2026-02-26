from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import UserRole, ProgressStatus, HomeworkStatus

# User schemas
class UserBase(BaseModel):
    username: str
    name: str
    email: Optional[str] = None
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Auth schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Course schemas
class CourseBase(BaseModel):
    week_number: int
    title: str
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    learning_goals: Optional[str] = None
    class_date: Optional[str] = None

class CourseResponse(CourseBase):
    id: int

    class Config:
        from_attributes = True

# Progress schemas
class ProgressBase(BaseModel):
    status: ProgressStatus

class ProgressUpdate(ProgressBase):
    pass

class ProgressResponse(ProgressBase):
    id: int
    student_id: int
    course_id: int
    completed_at: Optional[datetime] = None
    course: CourseResponse

    class Config:
        from_attributes = True

# Homework schemas
class HomeworkCreate(BaseModel):
    course_id: int
    content: Optional[str] = None
    file_url: Optional[str] = None
    link_url: Optional[str] = None

class HomeworkUpdate(BaseModel):
    status: HomeworkStatus
    teacher_comment: Optional[str] = None

class HomeworkResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    content: Optional[str] = None
    file_url: Optional[str] = None
    link_url: Optional[str] = None
    status: HomeworkStatus
    teacher_comment: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    student: UserResponse
    course: CourseResponse

    class Config:
        from_attributes = True

# Material schemas
class MaterialCreate(BaseModel):
    course_id: int
    title: str
    file_url: str
    file_type: Optional[str] = None

class MaterialResponse(MaterialCreate):
    id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Stats schemas
class StatsResponse(BaseModel):
    total_students: int
    total_courses: int
    total_homework: int
    pending_homework: int
    completion_rate: float
    homework_submission_rate: float
