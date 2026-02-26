import React, { useState, useEffect } from 'react';
import { courseAPI, progressAPI } from '../../api';
import ProgressBar from '../../components/ProgressBar';
import { calculateProgress, getStatusText, getStatusColor } from '../../utils/helpers';

const Progress = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, progressRes] = await Promise.all([
        courseAPI.getAll(),
        progressAPI.getMy(),
      ]);

      setCourses(coursesRes.data);
      setProgress(progressRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForCourse = (courseId) => {
    return progress.find((p) => p.course_id === courseId);
  };

  const completedCount = progress.filter((p) => p.status === 'completed').length;
  const totalProgress = calculateProgress(completedCount, courses.length);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">加载中...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">我的进度</h2>
        <p className="text-gray-600 mt-1">查看学习进度和完成情况</p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">总体进度</h3>
          <span className="text-2xl font-bold text-blue-600">{totalProgress}%</span>
        </div>
        <ProgressBar progress={totalProgress} />
        <div className="mt-3 text-sm text-gray-600">
          已完成 {completedCount} / {courses.length} 周课程
        </div>
      </div>

      <div className="space-y-4">
        {courses.map((course) => {
          const courseProgress = getProgressForCourse(course.id);
          const status = courseProgress?.status || 'not_started';

          return (
            <div key={course.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Week {course.week_number}: {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{course.tech_stack}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress;
