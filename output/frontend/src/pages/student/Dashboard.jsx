import React, { useState, useEffect } from 'react';
import { courseAPI, progressAPI } from '../../api';
import CourseCard from '../../components/CourseCard';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, progressRes] = await Promise.all([
        courseAPI.getAll(),
        progressAPI.getMy(),
      ]);

      setCourses(coursesRes.data);
      setProgress(progressRes.data);
    } catch (err) {
      setError('加载数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForCourse = (courseId) => {
    return progress.find((p) => p.course_id === courseId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">课程大纲</h2>
        <p className="text-gray-600 mt-1">10 周完整课程规划</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={getProgressForCourse(course.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
