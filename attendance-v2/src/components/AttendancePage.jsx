import { useState, useEffect } from 'react';
import StudentForm from './StudentForm';
import CourseSelection from './CourseSelection';

function getThaiDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function formatThaiTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
}

function StudentRow({ student, onMarkPresent, onResetStatus, attendanceStatus, attendanceTime }) {
  const isPresent = attendanceStatus[student.student_id] || false;
  const checkInTime = attendanceTime[student.student_id] || null;
  
  return (
    <tr>
      <td style={{ border: '1px solid #4a90e2', padding: '12px', color: 'black' }}>{student.fullname}</td>
      <td style={{ border: '1px solid #4a90e2', padding: '12px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button 
            onClick={() => onMarkPresent(student.student_id)}
            disabled={isPresent}
            style={{
              backgroundColor: isPresent ? '#28a745' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: isPresent ? 'not-allowed' : 'pointer'
            }}
          >
            {isPresent ? 'มาแล้ว' : 'มาเรียน'}
          </button>
          {isPresent && (
            <button 
              onClick={() => onResetStatus(student.student_id)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              รีเซ็ต
            </button>
          )}
        </div>
      </td>
      <td style={{ border: '1px solid #4a90e2', padding: '12px', textAlign: 'center' }}>
        <span style={{ 
          color: isPresent ? '#28a745' : '#dc3545',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {isPresent ? 'มา' : 'ไม่มา'}
        </span>
      </td>
      <td style={{ border: '1px solid #4a90e2', padding: '12px', textAlign: 'center' }}>
        <span style={{ 
          color: 'black',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {checkInTime || '-'}
        </span>
      </td>
    </tr>
  );
}

function StudentTable({ students, onMarkPresent, onResetStatus, attendanceStatus, attendanceTime }) {
  return (
    <table style={{ 
      width: '100%', 
      borderCollapse: 'collapse',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <thead>
        <tr style={{ backgroundColor: '#4a90e2' }}>
          <th style={{ 
            border: '1px solid #4a90e2', 
            padding: '12px',
            color: 'white',
            fontWeight: 'bold'
          }}>Student Name</th>
          <th style={{ 
            border: '1px solid #4a90e2', 
            padding: '12px',
            color: 'white',
            fontWeight: 'bold'
          }}>Action</th>
          <th style={{ 
            border: '1px solid #4a90e2', 
            padding: '12px',
            color: 'white',
            fontWeight: 'bold'
          }}>Status</th>
          <th style={{ 
            border: '1px solid #4a90e2', 
            padding: '12px',
            color: 'white',
            fontWeight: 'bold'
          }}>Check-in Time</th>
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <StudentRow 
            key={student.student_id} 
            student={student} 
            onMarkPresent={onMarkPresent}
            onResetStatus={onResetStatus}
            attendanceStatus={attendanceStatus}
            attendanceTime={attendanceTime}
          />
        ))}
      </tbody>
    </table>
  );
}

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceTime, setAttendanceTime] = useState({});
  const [currentView, setCurrentView] = useState('courseSelection'); // 'courseSelection', 'attendance' หรือ 'addStudent'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (selectedCourse) {
      setAttendanceStatus({});
      setAttendanceTime({});
      
      fetchCourseStudents();
      fetchTodayAttendance();
    }
  }, [selectedCourse]);

  async function fetchCourseStudents() {
    if (!selectedCourse) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/courses/${selectedCourse.id}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching course students:', error);
    }
  }

  async function fetchTodayAttendance() {
    if (!selectedCourse) return;
    
    setLoading(true);
    try {
      const today = getThaiDateString();
      const response = await fetch(`http://localhost:3000/api/attendance/history?date=${today}&course_id=${selectedCourse.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      

      const statusMap = {};
      const timeMap = {};
      
      data.forEach(record => {
        if (record.event_type === 'clock_in' && record.course_id == selectedCourse.id) {
          statusMap[record.student_id] = true;
          timeMap[record.student_id] = formatThaiTime(record.timestamp);
        }
      });
      
      setAttendanceStatus(statusMap);
      setAttendanceTime(timeMap);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleMarkPresent(studentId) {
    if (!selectedCourse) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          course_id: selectedCourse.id,
          event_type: 'clock_in'
        })
      });
      
      if (response.ok) {
        await fetchTodayAttendance();
        
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`เกิดข้อผิดพลาด: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  }

  async function handleResetStatus(studentId) {
    if (!selectedCourse) return;
    
    if (confirm('คุณต้องการรีเซ็ตการเช็คชื่อของนักเรียนคนนี้หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/attendance/reset/${studentId}/${selectedCourse.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchTodayAttendance();
          
          setAttendanceStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[studentId];
            return newStatus;
          });
          
          setAttendanceTime(prev => {
            const newTime = { ...prev };
            delete newTime[studentId];
            return newTime;
          });
        } else {
          const errorData = await response.json();
          alert(`เกิดข้อผิดพลาด: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error resetting attendance:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  }

  async function handleResetAll() {
    if (!selectedCourse) return;
    
    if (confirm('คุณต้องการรีเซ็ตการเช็คชื่อทั้งหมดในรายวิชานี้หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/attendance/reset-all/${selectedCourse.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchTodayAttendance();
          
          setAttendanceStatus({});
          setAttendanceTime({});
        } else {
          const errorData = await response.json();
          alert(`เกิดข้อผิดพลาด: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error resetting all attendance:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  }
  
  if (currentView === 'courseSelection') {
    return (
      <CourseSelection 
        onCourseSelect={(course) => {
          setSelectedCourse(course);
          setCurrentView('attendance');
        }}
        onBack={() => {
          window.location.reload();
        }}
      />
    );
  }

  if (currentView === 'addStudent') {
    return (
      <StudentForm 
        selectedCourse={selectedCourse}
        onBack={() => {
          setCurrentView('attendance');
          fetchCourseStudents();
        }} 
      />
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
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', color: '#4a90e2' }}>
            เช็คชื่อเข้าเรียน - {new Date().toLocaleDateString('th-TH')}
          </h1>
          {selectedCourse && (
            <div>
              <h2 style={{ margin: '0 0 5px 0', color: '#28a745', fontSize: '18px' }}>
                {selectedCourse.course_code} - {selectedCourse.course_name}
              </h2>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                การเช็คชื่อจะบันทึกเฉพาะในรายวิชานี้เท่านั้น
              </p>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCurrentView('courseSelection')}
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📚 เปลี่ยนรายวิชา
          </button>
          <button
            onClick={handleResetAll}
            style={{
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🗑️ รีเซ็ตทั้งหมด
          </button>
          <button
            onClick={() => setCurrentView('addStudent')}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            + เพิ่มนักเรียนใหม่
          </button>
        </div>
      </div>
      
      {students.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>
            ไม่มีนักเรียนในรายวิชานี้
          </h3>
          <p style={{ color: '#999', margin: 0 }}>
            กรุณาเพิ่มนักเรียนเข้าในรายวิชาก่อนเช็คชื่อ
          </p>
        </div>
      ) : (
        <StudentTable 
          students={students} 
          onMarkPresent={handleMarkPresent}
          onResetStatus={handleResetStatus}
          attendanceStatus={attendanceStatus}
          attendanceTime={attendanceTime}
        />
      )}
    </div>
  );
}

export default AttendancePage;