import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../api';
import { formatDateTime } from '../../utils/helpers';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({ username: '', password: '', name: '', email: '' });
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      password: '',
      name: student.name,
      email: student.email || '',
    });
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个学员吗？')) return;

    try {
      await studentAPI.delete(id);
      setMessage({ type: 'success', text: '删除成功' });
      fetchStudents();
    } catch (err) {
      setMessage({ type: 'error', text: '删除失败' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.name) {
      setMessage({ type: 'error', text: '请填写必填项' });
      return;
    }

    if (!editingStudent && !formData.password) {
      setMessage({ type: 'error', text: '新建学员需要设置密码' });
      return;
    }

    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.id, formData);
        setMessage({ type: 'success', text: '更新成功' });
      } else {
        await studentAPI.create(formData);
        setMessage({ type: 'success', text: '添加成功' });
      }

      setShowModal(false);
      fetchStudents();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || '操作失败' });
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">加载中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">学员管理</h2>
          <p className="text-gray-600 mt-1">管理学员账号和信息</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          + 添加学员
        </button>
      </div>

      {message.text && !showModal && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-600'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">用户名</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">姓名</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">邮箱</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">创建时间</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{student.username}</td>
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.email || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDateTime(student.created_at)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">暂无学员</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              {editingStudent ? '编辑学员' : '添加学员'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名 *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-field"
                  disabled={!!editingStudent}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码 {!editingStudent && '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder={editingStudent ? '留空则不修改' : ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              {message.text && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex space-x-3">
                <button type="submit" className="flex-1 btn-primary">
                  {editingStudent ? '更新' : '添加'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
