import { useState, useEffect } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    fullname: '',
    password: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    username: '',
    fullname: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  // โหลดข้อมูลผู้ใช้จาก API
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  // ฟังก์ชันค้นหา
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    if (searchValue.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.username.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const deleteUser = async (userId) => {
    if (confirm('คุณต้องการลบผู้ใช้คนนี้หรือไม่?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchUsers();
          setSearchTerm('');
          setMessage('ลบผู้ใช้สำเร็จ');
          setTimeout(() => setMessage(''), 3000);
        } else {
          const errorData = await response.json();
          setMessage(`เกิดข้อผิดพลาด: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      username: user.username,
      fullname: user.fullname,
      password: ''
    });
  };

  const saveEdit = async () => {
    if (editForm.username.trim() && editForm.fullname.trim()) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: editForm.username.trim(),
            fullname: editForm.fullname.trim(),
            password: editForm.password.trim()
          })
        });
        
        if (response.ok) {
          setEditingId(null);
          setEditForm({ username: '', fullname: '', password: '' });
          fetchUsers();
          setSearchTerm('');
          setMessage('แก้ไขข้อมูลสำเร็จ');
          setTimeout(() => setMessage(''), 3000);
        } else {
          const errorData = await response.json();
          setMessage(`เกิดข้อผิดพลาด: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error updating user:', error);
        setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ username: '', fullname: '', password: '' });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!addForm.username.trim() || !addForm.fullname.trim() || !addForm.password.trim()) {
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: addForm.username.trim(),
          fullname: addForm.fullname.trim(),
          password: addForm.password.trim()
        })
      });

      if (response.ok) {
        setAddForm({ username: '', fullname: '', password: '' });
        setShowAddForm(false);
        fetchUsers();
        setMessage('เพิ่มผู้ใช้สำเร็จ');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setMessage(`เกิดข้อผิดพลาด: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
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
        <h1 style={{ color: '#6f42c1', margin: 0 }}>จัดการข้อมูลผู้ใช้</h1>
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
            {showAddForm ? 'ยกเลิก' : '+ เพิ่มผู้ใช้ใหม่'}
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

      {/* Add User Form */}
      {showAddForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>เพิ่มผู้ใช้ใหม่</h3>
          
          <form onSubmit={handleAddUser}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Username"
                value={addForm.username}
                onChange={(e) => setAddForm({...addForm, username: e.target.value})}
                style={{
                  padding: '12px',
                  border: '2px solid #6f42c1',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: 'black'
                }}
                required
              />
              
              <input
                type="text"
                placeholder="ชื่อ-นามสกุล"
                value={addForm.fullname}
                onChange={(e) => setAddForm({...addForm, fullname: e.target.value})}
                style={{
                  padding: '12px',
                  border: '2px solid #6f42c1',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: 'black'
                }}
                required
              />
              
              <input
                type="password"
                placeholder="รหัสผ่าน"
                value={addForm.password}
                onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                style={{
                  padding: '12px',
                  border: '2px solid #6f42c1',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  color: 'black'
                }}
                required
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
                เพิ่มผู้ใช้
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
        <h3 style={{ marginBottom: '15px', color: '#333' }}>ค้นหาผู้ใช้</h3>
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ หรือ username..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #6f42c1',
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
            พบ {filteredUsers.length} รายการจากการค้นหา "{searchTerm}"
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
          <h3 style={{ marginBottom: '20px', color: '#333' }}>แก้ไขข้อมูลผู้ใช้</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              placeholder="Username"
              value={editForm.username}
              onChange={(e) => setEditForm({...editForm, username: e.target.value})}
              style={{
                padding: '12px',
                border: '2px solid #6f42c1',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: 'black'
              }}
            />
            
            <input
              type="text"
              placeholder="ชื่อ-นามสกุล"
              value={editForm.fullname}
              onChange={(e) => setEditForm({...editForm, fullname: e.target.value})}
              style={{
                padding: '12px',
                border: '2px solid #6f42c1',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'white',
                color: 'black'
              }}
            />
            
            <input
              type="password"
              placeholder="รหัสผ่านใหม่ (เว้นว่างถ้าไม่ต้องการเปลี่ยน)"
              value={editForm.password}
              onChange={(e) => setEditForm({...editForm, password: e.target.value})}
              style={{
                padding: '12px',
                border: '2px solid #6f42c1',
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

      {/* Users List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          padding: '20px', 
          margin: 0, 
          backgroundColor: '#6f42c1', 
          color: 'white' 
        }}>
          รายการผู้ใช้ ({filteredUsers.length} คน{searchTerm ? ` จากทั้งหมด ${users.length} คน` : ''})
        </h3>
        
        {filteredUsers.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#666' 
          }}>
            {searchTerm ? `ไม่พบผู้ใช้ที่ตรงกับ "${searchTerm}"` : 'ยังไม่มีข้อมูลผู้ใช้'}
          </div>
        ) : (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0 
          }}>
            {filteredUsers.map((user) => (
              <li 
                key={user.id}
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
                    {user.fullname}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    marginBottom: '3px'
                  }}>
                    Username: {user.username}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666' 
                  }}>
                    สร้างเมื่อ: {new Date(user.created_at).toLocaleString('th-TH')}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => startEdit(user)}
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
                    onClick={() => deleteUser(user.id)}
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

export default UserManagement;