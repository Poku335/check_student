import { useState, useEffect } from 'react';

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    course_code: '',
    course_name: '',
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    course_code: '',
    course_name: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  // โหลดข้อมูลรายวิชาจาก API
  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const response = await fetch('http://localhost:3000/api/courses');
      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  // ฟังก์ชันค้นหา
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    if (searchValue.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.course_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.course_code.toLowerCase().includes(searchValue.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setFilteredCourses(filtered);
    }
  };

  const deleteCourse = async (courseId) => {
    if (confirm('คุณต้องการลบรายวิชานี้หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchCourses();
          setSearchTerm('');
          setMessage('ลบรายวิชาสำเร็จ');
          setTimeout(() => setMessage(''), 3000);
        } else {
          const errorData = await response.json();
          setMessage(`เกิดข้อผิดพลาด: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  };

  const startEdit = (course) => {
    setEditingId(course.id);
    setEditForm({
      course_code: course.course_code,
      course_name: course.course_name,
      description: course.description || ''
    });
  };

  const saveEdit = async () => {
    if (editForm.course_code.trim() && editForm.course_name.trim()) {
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_code: editForm.course_code.trim(),
            course_name: editForm.course_name.trim(),
            description: editForm.description.trim()
          })
        });
        
        if (response.ok) {
          setEditingId(null);
          setEditForm({ course_code: '', course_name: '', description: '' });
          fetchCourses();
          setSearchTerm('');
          setMessage('แก้ไขรายวิชาสำเร็จ');
          setTimeout(() => setMessage(''), 3000);
        } else {
          const errorData = await response.json();
          setMessage(`เกิดข้อผิดพลาด: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error updating course:', error);
        setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ course_code: '', course_name: '', description: '' });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    
    if (!addForm.course_code.trim() || !addForm.course_name.trim()) {
      setMessage('กรุณากรอกรหัสวิชาและชื่อวิชา');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_code: addForm.course_code.trim(),
          course_name: addForm.course_name.trim(),
          description: addForm.description.trim()
        })
      });

      if (response.ok) {
        setAddForm({ course_code: '', course_name: '', description: '' });
        setShowAddForm(false);
        fetchCourses();
        setMessage('เพิ่มรายวิชาสำเร็จ');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(`เกิดข้อผิดพลาด: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
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
        <h1 style={{ color: '#fd7e14', margin: 0 }}>จัดการรายวิชา</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
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
          <button
            onClick={() => setShowAddForm(!showAddForm)}
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
            {showAddForm ? 'ยกเลิก' : '+ เพิ่มรายวิชาใหม่'}
          </button>
        </div>
      </div>

      {/* Message */}
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

      {/* Add Course Form */}
      {showAddForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>เพิ่มรายวิชาใหม่</h3>
          
          <form onSubmit={handleAddCourse}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="รหัสวิชา (เช่น CS101)"
                value={addForm.course_code}
                onChange={(e) => setAddForm({...addForm, course_code: e.target.value})}
                style={{
                  padding: '12px',
                  border: '2px solid #fd7e14',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: 'black'
                }}
                required
              />
              
              <input
                type="text"
                placeholder="ชื่อวิชา"
                value={addForm.course_name}
                onChange={(e) => setAddForm({...addForm, course_name: e.target.value})}
                style={{
                  padding: '12px',
                  border: '2px solid #fd7e14',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: 'black'
                }}
                required
              />
              
              <textarea
                placeholder="คำอธิบายรายวิชา (ไม่บังคับ)"
                value={addForm.description}
                onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                rows="3"
                style={{
                  padding: '12px',
                  border: '2px solid #fd7e14',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: 'black',
                  resize: 'vertical'
                }}
              />
              
              <button
                type="submit"
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                เพิ่มรายวิชา
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Search Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>ค้นหารายวิชา</h3>
        <input
          type="text"
          placeholder="ค้นหาด้วยรหัสวิชา, ชื่อวิชา หรือคำอธิบาย..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #fd7e14',
            borderRadius: '5px',
            fontSize: '16px',
            boxSizing: 'border-box',
            backgroundColor: 'white',
            color: 'black'
          }}
        />
        {searchTerm && (
          <div style={{ 
            marginTop: '10px', 
            fontSize: '14px', 
            color: '#666' 
          }}>
            พบ {filteredCourses.length} รายการจากการค้นหา "{searchTerm}"
          </div>
        )}
      </div>

      {/* Edit Form Section */}
      {editingId && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>แก้ไขรายวิชา</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="รหัสวิชา"
              value={editForm.course_code}
              onChange={(e) => setEditForm({...editForm, course_code: e.target.value})}
              style={{
                padding: '12px',
                border: '2px solid #fd7e14',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: 'black'
              }}
            />
            
            <input
              type="text"
              placeholder="ชื่อวิชา"
              value={editForm.course_name}
              onChange={(e) => setEditForm({...editForm, course_name: e.target.value})}
              style={{
                padding: '12px',
                border: '2px solid #fd7e14',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: 'black'
              }}
            />
            
            <textarea
              placeholder="คำอธิบายรายวิชา"
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              rows="3"
              style={{
                padding: '12px',
                border: '2px solid #fd7e14',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: 'black',
                resize: 'vertical'
              }}
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={saveEdit}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                บันทึก
              </button>
              <button
                onClick={cancelEdit}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          padding: '20px', 
          margin: 0, 
          backgroundColor: '#fd7e14', 
          color: 'white' 
        }}>
          รายการวิชา ({filteredCourses.length} วิชา{searchTerm ? ` จากทั้งหมด ${courses.length} วิชา` : ''})
        </h3>
        
        {filteredCourses.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#666' 
          }}>
            {searchTerm ? `ไม่พบรายวิชาที่ตรงกับ "${searchTerm}"` : 'ยังไม่มีรายวิชา'}
          </div>
        ) : (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0 
          }}>
            {filteredCourses.map((course) => (
              <li 
                key={course.id}
                style={{
                  padding: '15px 20px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '16px',
                    marginBottom: '5px',
                    color: 'black'
                  }}>
                    {course.course_code} - {course.course_name}
                  </div>
                  {course.description && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#666',
                      marginBottom: '3px'
                    }}>
                      {course.description}
                    </div>
                  )}
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666' 
                  }}>
                    สร้างเมื่อ: {new Date(course.created_at).toLocaleString('th-TH')}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => startEdit(course)}
                    style={{
                      backgroundColor: '#ffc107',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ลบ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CourseManagement;