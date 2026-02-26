import React, { useState, useEffect } from 'react';
import { homeworkAPI, courseAPI } from '../../api';
import { getStatusText, getStatusColor, formatDateTime } from '../../utils/helpers';

const HomeworkReview = () => {
  const [homework, setHomework] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [reviewData, setReviewData] = useState({
    status: '',
    teacher_comment: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [homeworkRes, coursesRes] = await Promise.all([
        homeworkAPI.getAll(),
        courseAPI.getAll(),
      ]);

      setHomework(homeworkRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? `Week ${course.week_number}: ${course.title}` : '课程';
  };

  const handleReview = (hw) => {
    setSelectedHomework(hw);
    setReviewData({
      status: hw.status,
      teacher_comment: hw.teacher_comment || '',
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewData.status) {
      setMessage({ type: 'error', text: '请选择批改状态' });
      return;
    }

    try {
      await homeworkAPI.review(selectedHomework.id, reviewData);
      setMessage({ type: 'success', text: '批改成功' });
      setSelectedHomework(null);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: '批改失败' });
    }
  };

  const filterByStatus = (status) => {
    return homework.filter((hw) => hw.status === status);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">加载中...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">作业批改</h2>
        <p className="text-gray-600 mt-1">查看和批改学员作业</p>
      </div>

      {message.text && !selectedHomework && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-600'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-700">
            {filterByStatus('pending').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">待批改</div>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-700">
            {filterByStatus('approved').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">已通过</div>
        </div>
        <div className="card bg-red-50 border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-700">
            {filterByStatus('needs_revision').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">需修改</div>
        </div>
      </div>

      <div className="card">
        {homework.length === 0 ? (
          <div className="text-center py-8 text-gray-500">暂无作业</div>
        ) : (
          <div className="space-y-4">
            {homework.map((hw) => (
              <div key={hw.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {hw.student_name} - {getCourseTitle(hw.course_id)}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      提交时间: {formatDateTime(hw.submitted_at)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(hw.status)}`}>
                    {getStatusText(hw.status)}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">作业内容:</p>
                  <p className="text-gray-600 text-sm">{hw.content}</p>
                </div>

                {hw.link_url && (
                  <div className="mb-3">
                    <a
                      href={hw.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      查看作业链接 →
                    </a>
                  </div>
                )}

                {hw.teacher_comment && (
                  <div className="mb-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700 mb-1">评语:</p>
                    <p className="text-sm text-gray-600">{hw.teacher_comment}</p>
                  </div>
                )}

                <button
                  onClick={() => handleReview(hw)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  {hw.status === 'pending' ? '批改作业' : '修改批改'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedHomework && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">批改作业</h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                学员: {selectedHomework.student_name}
              </p>
              <p className="text-sm font-medium text-gray-700 mb-2">
                课程: {getCourseTitle(selectedHomework.course_id)}
              </p>
              <p className="text-sm text-gray-600">{selectedHomework.content}</p>
              {selectedHomework.link_url && (
                <a
                  href={selectedHomework.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  查看链接 →
                </a>
              )}
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  批改状态 *
                </label>
                <select
                  value={reviewData.status}
                  onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="">请选择...</option>
                  <option value="approved">通过</option>
                  <option value="needs_revision">需要修改</option>
                  <option value="pending">待批改</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  评语
                </label>
                <textarea
                  value={reviewData.teacher_comment}
                  onChange={(e) => setReviewData({ ...reviewData, teacher_comment: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="给学员一些反馈..."
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
                  提交批改
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedHomework(null)}
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

export default HomeworkReview;
