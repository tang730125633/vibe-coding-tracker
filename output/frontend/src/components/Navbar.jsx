import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, clearAuth } from '../utils/helpers';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Vibe Coding 课程追踪器
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user?.name || user?.username}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              user?.role === 'teacher'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role === 'teacher' ? '老师' : '学员'}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
