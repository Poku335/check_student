import { useState } from 'react';

function StudentForm({ onBack, selectedCourse }) {
  const [formData, setFormData] = useState({
    student_id: '',
    fullname: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (!formData.student_id || !formData.fullname) {
      setMessage('กรุณากรอกรหัสนักเรียนและชื่อ-นามสกุล');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        if (selectedCourse) {
          try {
            const enrollResponse = await fetch(`http://localhost:3000/api/courses/${selectedCourse.id}/enroll`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                student_id: formData.student_id
              })
            });
            
            if (enrollResponse.ok) {
              setMessage(`เพิ่มนักเรียนและลงทะเบียนเข้ารายวิชา ${selectedCourse.course_code} สำเร็จ!`);
            } else {
              setMessage('เพิ่มนักเรียนสำเร็จ แต่ไม่สามารถลงทะเบียนเข้ารายวิชาได้');
            }
          } catch (enrollError) {
            setMessage('เพิ่มนักเรียนสำเร็จ แต่เกิดข้อผิดพลาดในการลงทะเบียนเข้ารายวิชา');
          }
        } else {
          setMessage('เพิ่มนักเรียนสำเร็จ!');
        }
        
        setFormData({
          student_id: '',
          fullname: '',
          email: ''
        });
      } else {
        const errorData = await response.json();
        setMessage(`เกิดข้อผิดพลาด: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating student:', error);
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '15px',
      margin: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef',
      maxWidth: '1000px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: '#4a90e2', margin: 0 }}>เพิ่มนักเรียนใหม่</h1>
          {selectedCourse && (
            <p style={{ color: '#28a745', margin: '5px 0 0 0', fontSize: '14px' }}>
              จะลงทะเบียนเข้ารายวิชา: {selectedCourse.course_code} - {selectedCourse.course_name}
            </p>
          )}
        </div>
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
          ← กลับหน้าเช็คชื่อ
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            รหัสนักเรียน *
          </label>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleInputChange}
            placeholder="เช่น STD001"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #4a90e2',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: 'white',
              color: 'black'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            ชื่อ-นามสกุล *
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            placeholder="เช่น สมชาย ใจดี"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #4a90e2',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: 'white',
              color: 'black'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            อีเมล (ไม่บังคับ)
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="เช่น student@example.com"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #4a90e2',
              borderRadius: '5px',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: 'white',
              color: 'black'
            }}
          />
        </div>

        {message && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            backgroundColor: message.includes('สำเร็จ') ? '#d4edda' : '#f8d7da',
            color: message.includes('สำเร็จ') ? '#155724' : '#721c24',
            border: `1px solid ${message.includes('สำเร็จ') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </form>
    </div>
  );
}

export default StudentForm;