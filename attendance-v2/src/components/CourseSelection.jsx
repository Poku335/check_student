import { useState, useEffect } from 'react';

function CourseSelection({ onCourseSelect, onBack }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '50px',
        textAlign: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        กำลังโหลดรายวิชา...
      </div>
    );
  }

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
        <h1 style={{ color: '#28a745', margin: 0 }}>เลือกรายวิชาสำหรับเช็คชื่อ</h1>
        <button
          onClick={onBack}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← กลับหน้าหลัก
        </button>
      </div>

      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <p style={{ 
          color: '#666', 
          fontSize: '16px',
          margin: 0
        }}>
          กรุณาเลือกรายวิชาที่ต้องการเช็คชื่อ
        </p>
      </div>

      {courses.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          color: '#666',
          fontSize: '18px'
        }}>
          ยังไม่มีรายวิชาในระบบ
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => onCourseSelect(course)}
              style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '3px solid #28a745',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '36px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  📚
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    color: '#28a745',
                    fontSize: '18px',
                    margin: '0 0 5px 0',
                    fontWeight: 'bold'
                  }}>
                    {course.course_code}
                  </h3>
                  <h4 style={{
                    color: '#333',
                    fontSize: '16px',
                    margin: '0 0 10px 0',
                    fontWeight: 'normal'
                  }}>
                    {course.course_name}
                  </h4>
                  {course.description && (
                    <p style={{
                      color: '#666',
                      fontSize: '14px',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {course.description}
                    </p>
                  )}
                </div>
                
                <div style={{
                  fontSize: '24px',
                  color: '#28a745'
                }}>
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseSelection;