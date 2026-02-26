import React, { useState, useEffect } from 'react';
import { materialAPI, courseAPI } from '../../api';
import { formatDateTime } from '../../utils/helpers';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? `Week ${course.week_number}: ${course.title}` : '课程资料';
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">资料下载</h2>
        <p className="text-gray-600 mt-1">下载课程资料和代码示例</p>
      </div>

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
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      下载
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Materials;
