import api from './axios';

// 认证相关
export const authAPI = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  getMe: () => api.get('/api/auth/me'),
};

// 课程相关
export const courseAPI = {
  getAll: () => api.get('/api/courses'),
  getById: (id) => api.get(`/api/courses/${id}`),
};

// 进度相关
export const progressAPI = {
  getMy: () => api.get('/api/progress/me'),
  update: (id, data) => api.put(`/api/progress/${id}`, data),
};

// 作业相关
export const homeworkAPI = {
  getMy: () => api.get('/api/homework/me'),
  submit: (data) => api.post('/api/homework', data),
  getAll: () => api.get('/api/homework/all'),
  review: (id, data) => api.put(`/api/homework/${id}`, data),
};

// 学员相关（老师）
export const studentAPI = {
  getAll: () => api.get('/api/students'),
  create: (data) => api.post('/api/students', data),
  update: (id, data) => api.put(`/api/students/${id}`, data),
  delete: (id) => api.delete(`/api/students/${id}`),
};

// 资料相关
export const materialAPI = {
  getAll: () => api.get('/api/materials'),
  upload: (data) => api.post('/api/materials', data),
};

// 统计相关（老师）
export const statsAPI = {
  get: () => api.get('/api/stats'),
};
