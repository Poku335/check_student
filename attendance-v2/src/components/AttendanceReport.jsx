import { useState, useEffect } from 'react';

function getThaiDateString() {
  return new Date().toISOString().split('T')[0];
}

function formatThaiTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
}

function AttendanceReport() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const response = await fetch('http://localhost:3000/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  async function fetchAttendanceReport(courseId) {
    setLoading(true);
    try {
      const today = getThaiDateString();
      const response = await fetch(`http://localhost:3000/api/attendance/history?course_id=${courseId}&date=${today}`);
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance report:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchAttendanceReport(course.id);
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '15px',
      margin: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#17a2b8', margin: 0 }}>รายงานการเข้าเรียนรายวิชา</h1>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🏠 กลับหน้าหลัก
        </button>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>เลือกรายวิชา</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => handleCourseSelect(course)}
              style={{
                padding: '15px',
                backgroundColor: selectedCourse?.id === course.id ? '#17a2b8' : 'white',
                color: selectedCourse?.id === course.id ? 'white' : '#333',
                border: '2px solid #17a2b8',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{course.course_code}</div>
              <div>{course.course_name}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: '#17a2b8', 
            marginBottom: '20px' 
          }}>
            การเข้าเรียนวันนี้: {selectedCourse.course_code} - {selectedCourse.course_name}
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              กำลังโหลดข้อมูล...
            </div>
          ) : attendanceData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              ยังไม่มีการเข้าเรียนในรายวิชานี้วันนี้
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '15px', color: '#666' }}>
                จำนวนนักเรียนที่เข้าเรียน: {attendanceData.length} คน
              </div>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                border: '1px solid #ddd'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#17a2b8', color: 'white' }}>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>ชื่อนักเรียน</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>สถานะ</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>เวลาเข้าเรียน</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{record.fullname}</td>
                      <td style={{ 
                        padding: '12px', 
                        border: '1px solid #ddd',
                        color: record.status === 'present' ? '#28a745' : record.status === 'late' ? '#ffc107' : '#dc3545'
                      }}>
                        {record.status === 'present' ? 'มาเรียน' : record.status === 'late' ? 'มาสาย' : 'ขาดเรียน'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                        {formatThaiTime(record.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;