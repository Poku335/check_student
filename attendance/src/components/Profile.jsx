import { useState, useEffect } from 'react';

function Profile() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: ''
  });

  // โหลดข้อมูลนักเรียนจาก API
  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const response = await fetch('http://localhost:3000/api/students');
      const data = await response.json();
      setStudents(data);
      setFilteredStudents(data); // ตั้งค่าเริ่มต้นให้แสดงทั้งหมด
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }

  // ฟังก์ชันค้นหา
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    if (searchValue.trim() === '') {
      setFilteredStudents(students); // แสดงทั้งหมดถ้าไม่มีการค้นหา
    } else {
      const filtered = students.filter(student =>
        student.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchValue.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(searchValue.toLowerCase()))
      );
      setFilteredStudents(filtered);
    }
  };

  const deleteStudent = async (studentId) => {
    if (confirm('คุณต้องการลบนักเรียนคนนี้หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/students/${studentId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // รีเฟรชข้อมูล
          fetchStudents();
          setSearchTerm(''); // เคลียร์การค้นหา
        } else {
          alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  };

  const startEdit = (student) => {
    setEditingId(student.student_id);
    setEditForm({
      fullname: student.fullname,
      email: student.email || ''
    });
  };

  const saveEdit = async () => {
    if (editForm.fullname.trim()) {
      try {
        const response = await fetch(`http://localhost:3000/api/students/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullname: editForm.fullname.trim(),
            email: editForm.email.trim()
          })
        });
        
        if (response.ok) {
          setEditingId(null);
          setEditForm({ fullname: '', email: '' });
          fetchStudents(); // รีเฟรชข้อมูล
          setSearchTerm(''); // เคลียร์การค้นหา
        } else {
          alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
        }
      } catch (error) {
        console.error('Error updating student:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ fullname: '', email: '' });
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
        <h1 style={{ color: '#4a90e2', margin: 0 }}>จัดการข้อมูลนักเรียน</h1>
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
      
      {/* Search Section */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>ค้นหานักเรียน</h3>
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ, รหัสนักเรียน หรืออีเมล..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
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
        {searchTerm && (
          <div style={{ 
            marginTop: '10px', 
            fontSize: '14px', 
            color: '#666' 
          }}>
            พบ {filteredStudents.length} รายการจากการค้นหา "{searchTerm}"
          </div>
        )}
      </div>

      {/* Edit Form Section - แสดงเฉพาะเมื่อกำลังแก้ไข */}
      {editingId && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            แก้ไขข้อมูลนักเรียน
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="ชื่อ-นามสกุล"
              value={editForm.fullname}
              onChange={(e) => setEditForm({...editForm, fullname: e.target.value})}
              style={{
                padding: '12px',
                border: '2px solid #4a90e2',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: 'black'
              }}
            />
            
            <input
              type="email"
              placeholder="อีเมล"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              style={{
                padding: '12px',
                border: '2px solid #4a90e2',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: 'black'
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

      {/* Profiles List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          padding: '20px', 
          margin: 0, 
          backgroundColor: '#4a90e2', 
          color: 'white' 
        }}>
          รายการนักเรียน ({filteredStudents.length} คน{searchTerm ? ` จากทั้งหมด ${students.length} คน` : ''})
        </h3>
        
        {filteredStudents.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#666' 
          }}>
            {searchTerm ? `ไม่พบนักเรียนที่ตรงกับ "${searchTerm}"` : 'ยังไม่มีข้อมูลนักเรียน'}
          </div>
        ) : (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0 
          }}>
            {filteredStudents.map((student) => (
              <li 
                key={student.student_id}
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
                    {student.fullname}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    marginBottom: '3px'
                  }}>
                    รหัส: {student.student_id}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666' 
                  }}>
                    อีเมล: {student.email || 'ไม่ระบุ'}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666' 
                  }}>
                    สร้างเมื่อ: {new Date(student.created_at).toLocaleString('th-TH')}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => startEdit(student)}
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
                    onClick={() => deleteStudent(student.student_id)}
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

export default Profile;