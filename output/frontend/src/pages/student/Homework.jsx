import React, { useState, useEffect } from 'react';
import { courseAPI, homeworkAPI } from '../../api';
import { getStatusText, getStatusColor, formatDateTime } from '../../utils/helpers';

const Homework = () => {
  const [courses, setCourses] = useState([]);
  const [homework, setHomework] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [formData, setFormData] = useState({
    content: '',
    link_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, homeworkRes] = await Promise.all([
        courseAPI.getAll(),
        homeworkAPI.getMy(),
      ]);

      setCourses(coursesRes.data);
      setHomework(homeworkRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      setMessage({ type: 'error', text: '请选择课程' });
      return;
    }

    if (!formData.content && !formData.link_url) {
      setMessage({ type: 'error', text: '请填写作业内容或链接' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await homeworkAPI.submit({
        course_id: parseInt(selectedCourse),
        content: formData.content,
        link_url: formData.link_url,
      });

      setMessage({ type: 'success', text: '作业提交成功' });
      setFormData({ content: '', link_url: '' });
      setSelectedCourse('');
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: '提交失败，请重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">作业提交</h2>
        <p className="text-gray-600 mt-1">提交作业并查看批改结果</p>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">提交新作业</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择课程
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="input-field"
              disabled={loading}
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
              作业内容
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input-field"
              rows="4"
              placeholder="描述你的作业内容..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              作业链接（可选）
            </label>
            <input
              type="url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              className="input-field"
              placeholder="https://..."
              disabled={loading}
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? '提交中...' : '提交作业'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">我的作业列表</h3>
        {homework.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无作业记录</p>
        ) : (
          <div className="space-y-4">
            {homework.map((hw) => {
              const course = courses.find((c) => c.id === hw.course_id);
              return (
                <div key={hw.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {course ? `Week ${course.week_number}: ${course.title}` : '课程'}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        提交时间: {formatDateTime(hw.submitted_at)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(hw.status)}`}>
                      {getStatusText(hw.status)}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-2">{hw.content}</p>

                  {hw.link_url && (
                    <a
                      href={hw.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      查看链接 →
                    </a>
                  )}

                  {hw.teacher_comment && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm font-medium text-gray-900 mb-1">老师评语:</p>
                      <p className="text-sm text-gray-700">{hw.teacher_comment}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homework;
