import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// 学员端页面
import StudentDashboard from './pages/student/Dashboard';
import StudentProgress from './pages/student/Progress';
import StudentHomework from './pages/student/Homework';
import StudentMaterials from './pages/student/Materials';

// 老师端页面
import TeacherStudents from './pages/teacher/Students';
import TeacherHomework from './pages/teacher/HomeworkReview';
import TeacherMaterials from './pages/teacher/Materials';
import TeacherStats from './pages/teacher/Stats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* 学员端路由 */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="homework" element={<StudentHomework />} />
          <Route path="materials" element={<StudentMaterials />} />
        </Route>

        {/* 老师端路由 */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requiredRole="teacher">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherStudents />} />
          <Route path="homework" element={<TeacherHomework />} />
          <Route path="materials" element={<TeacherMaterials />} />
          <Route path="stats" element={<TeacherStats />} />
        </Route>

        {/* 默认重定向 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

