import React, { useState, useEffect } from 'react';
import { statsAPI } from '../../api';
import ProgressBar from '../../components/ProgressBar';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.get();
      setStats(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">加载中...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8 text-gray-500">暂无数据</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">数据统计</h2>
        <p className="text-gray-600 mt-1">查看整体学习进度和数据</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-700">
            {stats.total_students}
          </div>
          <div className="text-sm text-gray-600 mt-1">学员总数</div>
        </div>

        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-700">
            {stats.total_homework}
          </div>
          <div className="text-sm text-gray-600 mt-1">作业总数</div>
        </div>

        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <div className="text-3xl font-bold text-yellow-700">
            {stats.pending_homework}
          </div>
          <div className="text-sm text-gray-600 mt-1">待批改作业</div>
        </div>

        <div className="card bg-purple-50 border-l-4 border-purple-500">
          <div className="text-3xl font-bold text-purple-700">
            {stats.avg_progress}%
          </div>
          <div className="text-sm text-gray-600 mt-1">平均进度</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">课程完成情况</h3>
          <div className="space-y-4">
            {stats.course_completion?.map((course) => (
              <div key={course.course_id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Week {course.week_number}</span>
                  <span className="text-gray-600">
                    {course.completed_count} / {stats.total_students} 人完成
                  </span>
                </div>
                <ProgressBar
                  progress={(course.completed_count / stats.total_students) * 100}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">作业提交率</h3>
          <div className="space-y-4">
            {stats.homework_submission?.map((course) => (
              <div key={course.course_id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Week {course.week_number}</span>
                  <span className="text-gray-600">
                    {course.submission_count} / {stats.total_students} 人提交
                  </span>
                </div>
                <ProgressBar
                  progress={(course.submission_count / stats.total_students) * 100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="text-lg font-semibold mb-4">学员进度排名</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">排名</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">学员</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">完成课程</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">提交作业</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">进度</th>
              </tr>
            </thead>
            <tbody>
              {stats.student_progress?.map((student, index) => (
                <tr key={student.student_id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{student.student_name}</td>
                  <td className="py-3 px-4">{student.completed_courses}</td>
                  <td className="py-3 px-4">{student.submitted_homework}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <ProgressBar progress={student.progress_percentage} />
                      </div>
                      <span className="text-sm text-gray-600 w-12">
                        {student.progress_percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stats;
