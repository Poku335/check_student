import { useState } from 'react';
import AttendancePage from './AttendancePage';
import Profile from './Profile';
import UserManagement from './UserManagement';
import CourseManagement from './CourseManagement';
import AttendanceReport from './AttendanceReport';

function Dashboard({ username, onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'attendance':
        return <AttendancePage />;
      case 'profile':
        return <Profile />;
      case 'users':
        return <UserManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'reports':
        return <AttendanceReport />;
      case 'dashboard':
      default:
        return <DashboardHome setCurrentPage={setCurrentPage} username={username} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#4a90e2',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 
            onClick={() => setCurrentPage('dashboard')}
            style={{ 
              color: 'white', 
              margin: 0,
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ระบบเช็คชื่อเข้าเรียน
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: 'white' }}>{username}</span>
            <button
              onClick={() => {
                if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                  onLogout();
                }
              }}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 40px',
        backgroundColor: 'white',
        minHeight: 'calc(100vh - 80px)',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)'
      }}>
        {renderCurrentPage()}
      </div>
    </div>
  );
}

function DashboardHome({ setCurrentPage, username }) {
  const categories = [
    {
      id: 'attendance',
      title: 'เช็คชื่อเข้าเรียน',
      description: 'บันทึกการเข้าเรียนของนักเรียน',
      icon: '✓',
      color: '#28a745'
    },
    {
      id: 'profile',
      title: 'จัดการข้อมูลนักเรียน',
      description: 'เพิ่ม แก้ไข ลบ และค้นหาข้อมูลนักเรียน',
      icon: '👥',
      color: '#4a90e2'
    },
    {
      id: 'users',
      title: 'จัดการข้อมูลผู้ใช้',
      description: 'เพิ่ม แก้ไข ลบ และจัดการข้อมูลผู้ใช้ระบบ',
      icon: '👤',
      color: '#6f42c1'
    },
    {
      id: 'courses',
      title: 'จัดการรายวิชา',
      description: 'เพิ่ม แก้ไข ลบ และจัดการรายวิชาต่างๆ',
      icon: '📚',
      color: '#fd7e14'
    },
    {
      id: 'reports',
      title: 'รายงานการเข้าเรียน',
      description: 'ดูรายงานการเข้าเรียนแยกตามรายวิชา',
      icon: '📊',
      color: '#17a2b8'
    }
  ];

  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h2 style={{ 
          color: '#333', 
          fontSize: '32px',
          marginBottom: '10px'
        }}>
          ยินดีต้อนรับ, {username}
        </h2>
        <p style={{ 
          color: '#666', 
          fontSize: '18px' 
        }}>
          เลือกหมวดหมู่ที่ต้องการใช้งาน
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setCurrentPage(category.id)}
            style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: `3px solid ${category.color}`,
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
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
              fontSize: '48px',
              backgroundColor: category.color,
              color: 'white',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {category.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{
                color: category.color,
                fontSize: '24px',
                margin: '0 0 10px 0',
                fontWeight: 'bold'
              }}>
                {category.title}
              </h3>
              <p style={{
                color: '#666',
                fontSize: '16px',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {category.description}
              </p>
            </div>
            
            <div style={{
              fontSize: '24px',
              color: category.color
            }}>
              →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;