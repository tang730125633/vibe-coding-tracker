import pytest
from httpx import AsyncClient

# ==================== 认证测试 ====================

@pytest.mark.asyncio
async def test_login_success(client, db):
    """测试登录成功"""
    response = await client.post("/api/auth/login", json={
        "username": "tang",
        "password": "tang123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == "tang"
    assert data["user"]["role"] == "teacher"

@pytest.mark.asyncio
async def test_login_wrong_password(client, db):
    """测试登录失败 - 错误密码"""
    response = await client.post("/api/auth/login", json={
        "username": "tang",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

@pytest.mark.asyncio
async def test_login_nonexistent_user(client, db):
    """测试登录失败 - 用户不存在"""
    response = await client.post("/api/auth/login", json={
        "username": "nonexistent",
        "password": "password"
    })
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_me_with_token(client, db, teacher_token):
    """测试获取当前用户信息 - 有效 token"""
    response = await client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {teacher_token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "tang"
    assert data["role"] == "teacher"

@pytest.mark.asyncio
async def test_get_me_without_token(client, db):
    """测试获取当前用户信息 - 无 token"""
    response = await client.get("/api/auth/me")
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_get_me_invalid_token(client, db):
    """测试获取当前用户信息 - 无效 token"""
    response = await client.get("/api/auth/me", headers={
        "Authorization": "Bearer invalid_token"
    })
    assert response.status_code == 401

# ==================== 学员端 API 测试 ====================

@pytest.mark.asyncio
async def test_get_courses(client, db):
    """测试获取课程列表"""
    response = await client.get("/api/courses")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    assert data[0]["week_number"] == 1
    assert data[0]["title"] == "Week 1 Course"

@pytest.mark.asyncio
async def test_get_my_progress(client, db, student_token):
    """测试获取我的进度"""
    response = await client.get("/api/progress/me", headers={
        "Authorization": f"Bearer {student_token}"
    })
    assert response.status_code == 200
    # 新学员应该没有进度记录（需要老师创建）
    data = response.json()
    assert isinstance(data, list)

@pytest.mark.asyncio
async def test_get_my_progress_without_token(client, db):
    """测试获取我的进度 - 无 token"""
    response = await client.get("/api/progress/me")
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_submit_homework(client, db, student_token):
    """测试提交作业"""
    response = await client.post("/api/homework",
        headers={"Authorization": f"Bearer {student_token}"},
        json={
            "course_id": 1,
            "content": "这是我的作业内容",
            "link_url": "https://github.com/test/homework"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "这是我的作业内容"
    assert data["status"] == "pending"
    assert data["student"]["username"] == "student1"

@pytest.mark.asyncio
async def test_submit_homework_invalid_course(client, db, student_token):
    """测试提交作业 - 无效课程 ID"""
    response = await client.post("/api/homework",
        headers={"Authorization": f"Bearer {student_token}"},
        json={
            "course_id": 999,
            "content": "Test homework"
        }
    )
    assert response.status_code == 404
    assert "Course not found" in response.json()["detail"]

@pytest.mark.asyncio
async def test_submit_homework_without_token(client, db):
    """测试提交作业 - 无 token"""
    response = await client.post("/api/homework", json={
        "course_id": 1,
        "content": "Test"
    })
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_get_my_homework(client, db, student_token):
    """测试获取我的作业列表"""
    # 先提交一个作业
    await client.post("/api/homework",
        headers={"Authorization": f"Bearer {student_token}"},
        json={"course_id": 1, "content": "Test homework"}
    )

    # 获取作业列表
    response = await client.get("/api/homework/me", headers={
        "Authorization": f"Bearer {student_token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["content"] == "Test homework"

@pytest.mark.asyncio
async def test_get_materials(client, db):
    """测试获取资料列表"""
    response = await client.get("/api/materials")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

@pytest.mark.asyncio
async def test_get_materials_by_course(client, db):
    """测试按课程获取资料"""
    response = await client.get("/api/materials?course_id=1")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

# ==================== 老师端 API 测试 ====================

@pytest.mark.asyncio
async def test_get_students(client, db, teacher_token):
    """测试获取学员列表"""
    response = await client.get("/api/students", headers={
        "Authorization": f"Bearer {teacher_token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["role"] == "student"

@pytest.mark.asyncio
async def test_get_students_as_student(client, db, student_token):
    """测试学员访问老师端 API - 应该被拒绝"""
    response = await client.get("/api/students", headers={
        "Authorization": f"Bearer {student_token}"
    })
    assert response.status_code == 403
    assert "Only teachers" in response.json()["detail"]

@pytest.mark.asyncio
async def test_create_student(client, db, teacher_token):
    """测试添加学员"""
    response = await client.post("/api/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "username": "newstudent",
            "password": "password123",
            "name": "New Student",
            "email": "new@test.com",
            "role": "student"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newstudent"
    assert data["role"] == "student"

@pytest.mark.asyncio
async def test_create_student_duplicate_username(client, db, teacher_token):
    """测试添加学员 - 用户名已存在"""
    response = await client.post("/api/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "username": "student1",  # 已存在
            "password": "password123",
            "name": "Duplicate",
            "email": "dup@test.com",
            "role": "student"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

@pytest.mark.asyncio
async def test_update_student(client, db, teacher_token):
    """测试编辑学员"""
    # 先获取学员 ID
    students = await client.get("/api/students", headers={
        "Authorization": f"Bearer {teacher_token}"
    })
    student_id = students.json()[0]["id"]

    # 更新学员信息
    response = await client.put(f"/api/students/{student_id}",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "name": "Updated Name",
            "email": "updated@test.com"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["email"] == "updated@test.com"

@pytest.mark.asyncio
async def test_update_nonexistent_student(client, db, teacher_token):
    """测试编辑不存在的学员"""
    response = await client.put("/api/students/999",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={"name": "Test"}
    )
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_delete_student(client, db, teacher_token):
    """测试删除学员"""
    # 先创建一个学员
    create_response = await client.post("/api/students",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "username": "todelete",
            "password": "password123",
            "name": "To Delete",
            "email": "delete@test.com",
            "role": "student"
        }
    )
    student_id = create_response.json()["id"]

    # 删除学员
    response = await client.delete(f"/api/students/{student_id}", headers={
        "Authorization": f"Bearer {teacher_token}"
    })
    assert response.status_code == 200
    assert "deleted successfully" in response.json()["message"]

@pytest.mark.asyncio
async def test_get_all_homework(client, db, teacher_token, student_token):
    """测试获取所有作业"""
    # 先提交一个作业
    await client.post("/api/homework",
        headers={"Authorization": f"Bearer {student_token}"},
        json={"course_id": 1, "content": "Test homework"}
    )

    # 老师获取所有作业
    response = await client.get("/api/homework/all", headers={
        "Authorization": f"Bearer {teacher_token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

@pytest.mark.asyncio
async def test_review_homework(client, db, teacher_token, student_token):
    """测试批改作业"""
    # 先提交一个作业
    homework_response = await client.post("/api/homework",
        headers={"Authorization": f"Bearer {student_token}"},
        json={"course_id": 1, "content": "Test homework"}
    )
    homework_id = homework_response.json()["id"]

    # 批改作业
    response = await client.put(f"/api/homework/{homework_id}",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "status": "approved",
            "teacher_comment": "做得很好！"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    assert data["teacher_comment"] == "做得很好！"
    assert data["reviewed_at"] is not None

@pytest.mark.asyncio
async def test_review_nonexistent_homework(client, db, teacher_token):
    """测试批改不存在的作业"""
    response = await client.put("/api/homework/999",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={"status": "approved"}
    )
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_upload_material(client, db, teacher_token):
    """测试上传资料"""
    response = await client.post("/api/materials",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "course_id": 1,
            "title": "Week 1 资料",
            "file_url": "https://example.com/material.pdf",
            "file_type": "pdf"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Week 1 资料"
    assert data["course_id"] == 1

@pytest.mark.asyncio
async def test_upload_material_invalid_course(client, db, teacher_token):
    """测试上传资料 - 无效课程"""
    response = await client.post("/api/materials",
        headers={"Authorization": f"Bearer {teacher_token}"},
        json={
            "course_id": 999,
            "title": "Test",
            "file_url": "https://example.com/test.pdf"
        }
    )
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_get_stats(client, db, teacher_token):
    """测试获取统计数据"""
    response = await client.get("/api/stats", headers={
        "Authorization": f"Bearer {teacher_token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert "total_students" in data
    assert "total_courses" in data
    assert "total_homework" in data
    assert "pending_homework" in data
    assert "completion_rate" in data
    assert "homework_submission_rate" in data
    assert data["total_courses"] == 10

@pytest.mark.asyncio
async def test_get_stats_as_student(client, db, student_token):
    """测试学员访问统计数据 - 应该被拒绝"""
    response = await client.get("/api/stats", headers={
        "Authorization": f"Bearer {student_token}"
    })
    assert response.status_code == 403

# ==================== 健康检查测试 ====================

@pytest.mark.asyncio
async def test_root_endpoint(client):
    """测试根路径"""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data

@pytest.mark.asyncio
async def test_health_check(client):
    """测试健康检查"""
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
