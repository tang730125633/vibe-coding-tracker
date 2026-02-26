import React from 'react';
import { NavLink } from 'react-router-dom';
import { getCurrentUser } from '../utils/helpers';

const Sidebar = () => {
  const user = getCurrentUser();
  const isTeacher = user?.role === 'teacher';

  const studentLinks = [
    { to: '/student', label: '课程大纲', icon: '📚' },
    { to: '/student/progress', label: '我的进度', icon: '📊' },
    { to: '/student/homework', label: '作业提交', icon: '📝' },
    { to: '/student/materials', label: '资料下载', icon: '📁' },
  ];

  const teacherLinks = [
    { to: '/teacher', label: '学员管理', icon: '👥' },
    { to: '/teacher/homework', label: '作业批改', icon: '✅' },
    { to: '/teacher/materials', label: '资料上传', icon: '📤' },
    { to: '/teacher/stats', label: '数据统计', icon: '📈' },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;
  const bgColor = isTeacher ? 'bg-purple-50' : 'bg-blue-50';
  const activeColor = isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';

  return (
    <aside className={`w-64 ${bgColor} min-h-screen p-4`}>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/student' || link.to === '/teacher'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? activeColor
                  : 'text-gray-700 hover:bg-white'
              }`
            }
          >
            <span className="text-xl">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
