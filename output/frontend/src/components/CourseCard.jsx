import React from 'react';

const CourseCard = ({ course, progress, onClick }) => {
  const getStatusBadge = () => {
    if (!progress) return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">未开始</span>;

    switch (progress.status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">已完成</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">进行中</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">未开始</span>;
    }
  };

  return (
    <div
      onClick={onClick}
      className="card hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Week {course.week_number}: {course.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{course.tech_stack}</p>
        </div>
        {getStatusBadge()}
      </div>

      <p className="text-gray-600 text-sm mb-3">{course.description}</p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          上课时间: {new Date(course.class_date).toLocaleDateString('zh-CN')}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
