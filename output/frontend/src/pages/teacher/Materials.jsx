import React, { useState, useEffect } from 'react';
import { materialAPI, courseAPI } from '../../api';
import { formatDateTime } from '../../utils/helpers';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    file_url: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [materialsRes, coursesRes] = await Promise.all([
        materialAPI.getAll(),
        courseAPI.getAll(),
      ]);

      setMaterials(materialsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ course_id: '', title: '', file_url: '' });
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course_id || !formData.title || !formData.file_url) {
      setMessage({ type: 'error', text: '请填写所有字段' });
      return;
    }

    try {
      await materialAPI.upload({
        course_id: parseInt(formData.course_id),
        title: formData.title,
        file_url: formData.file_url,
      });

      setMessage({ type: 'success', text: '上传成功' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: '上传失败' });
    }
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? `Week ${course.week_number}: ${course.title}` : '课程';
  };

  const groupedMaterials = materials.reduce((acc, material) => {
    const courseId = material.course_id;
    if (!acc[courseId]) {
      acc[courseId] = [];
    }
    acc[courseId].push(material);
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center py-8 text-gray-500">加载中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">资料上传</h2>
          <p className="text-gray-600 mt-1">上传课程资料供学员下载</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          + 上传资料
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

      {Object.keys(groupedMaterials).length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">暂无资料</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMaterials).map(([courseId, courseMaterials]) => (
            <div key={courseId} className="card">
              <h3 className="text-lg font-semibold mb-4">
                {getCourseTitle(parseInt(courseId))}
              </h3>
              <div className="space-y-3">
                {courseMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="font-medium text-gray-900">{material.title}</p>
                        <p className="text-sm text-gray-500">
                          上传时间: {formatDateTime(material.uploaded_at)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={material.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      查看
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">上传资料</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择课程 *
                </label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="input-field"
                >
                  <option value="">请选择...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      Week {course.week_number}: {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  资料标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="例如: Week 1 课程代码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文件链接 *
                </label>
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  提示: 可以使用网盘链接、GitHub 链接等
                </p>
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
                  上传
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

export default Materials;
