// 获取当前用户
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// 保存用户信息
export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// 保存 token
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// 清除认证信息
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// 检查是否已登录
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// 格式化日期
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 格式化日期时间
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 计算进度百分比
export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// 获取状态文本
export const getStatusText = (status) => {
  const statusMap = {
    not_started: '未开始',
    in_progress: '进行中',
    completed: '已完成',
    pending: '待批改',
    approved: '已通过',
    needs_revision: '需修改',
  };
  return statusMap[status] || status;
};

// 获取状态颜色
export const getStatusColor = (status) => {
  const colorMap = {
    not_started: 'text-gray-500 bg-gray-100',
    in_progress: 'text-blue-600 bg-blue-100',
    completed: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    approved: 'text-green-600 bg-green-100',
    needs_revision: 'text-red-600 bg-red-100',
  };
  return colorMap[status] || 'text-gray-500 bg-gray-100';
};
