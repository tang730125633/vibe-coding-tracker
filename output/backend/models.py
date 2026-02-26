from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class UserRole(str, enum.Enum):
    student = "student"
    teacher = "teacher"

class ProgressStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"

class HomeworkStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    needs_revision = "needs_revision"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # hashed
    role = Column(Enum(UserRole), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress = relationship("Progress", back_populates="student")
    homework = relationship("Homework", back_populates="student")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    week_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    tech_stack = Column(String)
    learning_goals = Column(Text)
    class_date = Column(String)

    progress = relationship("Progress", back_populates="course")
    homework = relationship("Homework", back_populates="course")
    materials = relationship("Material", back_populates="course")

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    status = Column(Enum(ProgressStatus), default=ProgressStatus.not_started)
    completed_at = Column(DateTime)

    student = relationship("User", back_populates="progress")
    course = relationship("Course", back_populates="progress")

class Homework(Base):
    __tablename__ = "homework"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    content = Column(Text)
    file_url = Column(String)
    link_url = Column(String)
    status = Column(Enum(HomeworkStatus), default=HomeworkStatus.pending)
    teacher_comment = Column(Text)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime)

    student = relationship("User", back_populates="homework")
    course = relationship("Course", back_populates="homework")

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    file_type = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="materials")
