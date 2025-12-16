import { useState } from 'react';
import AttendancePage from './AttendancePage';
import Profile from './Profile';
import UserManagement from './UserManagement';
import CourseManagement from './CourseManagement';
import AttendanceReport from './AttendanceReport';

function Dashboard({ username, onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      name: 'หน้าหลัก',
      icon: '🏠',
      description: 'ภาพรวมระบบ'
    },
    {
      id: 'attendance',
      name: 'เช็คชื่อ',
      icon: '✅',
      description: 'บันทึกการเข้าเรียน'
    },
    {
      id: 'courses',
      name: 'จัดการวิชา',
      icon: '📚',
      description: 'เพิ่ม แก้ไข วิชาเรียน'
    },
    {
      id: 'users',
      name: 'จัดการผู้ใช้',
      icon: '👥',
      description: 'เพิ่ม แก้ไข ผู้ใช้งาน'
    },
    {
      id: 'reports',
      name: 'รายงาน',
      icon: '📊',
      description: 'สถิติการเข้าเรียน'
    },
    {
      id: 'profile',
      name: 'โปรไฟล์',
      icon: '👤',
      description: 'ข้อมูลส่วนตัว'
    }
  ];

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
        return <DashboardHome menuItems={menuItems} setCurrentPage={setCurrentPage} username={username} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="card" style={{
        margin: 0,
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div className="flex items-center gap-4">
            <div style={{ fontSize: '2rem' }}>🎓</div>
            <div>
              <h1 
                onClick={() => setCurrentPage('dashboard')}
                style={{ 
                  margin: 0,
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--primary)'
                }}
              >
                ระบบเช็คชื่อเข้าเรียน
              </h1>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Attendance Management System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div style={{ fontSize: '1.25rem' }}>👋</div>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                {username}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                  onLogout();
                }
              }}
              className="btn-error"
              style={{ fontSize: '0.875rem' }}
            >
              <span>🚪</span>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {currentPage !== 'dashboard' && (
        <nav style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-light)',
          padding: '0.5rem 0'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0 1rem'
          }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                style={{
                  whiteSpace: 'nowrap',
                  border: 'none',
                  background: 'transparent'
                }}
              >
                <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main style={{ flex: 1, padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
}

function DashboardHome({ menuItems, setCurrentPage, username }) {
  const stats = [
    { label: 'นักเรียนทั้งหมด', value: '150', icon: '👨‍🎓', color: 'var(--primary)' },
    { label: 'วิชาเรียน', value: '12', icon: '📖', color: 'var(--secondary)' },
    { label: 'เข้าเรียนวันนี้', value: '142', icon: '✅', color: 'var(--success)' },
    { label: 'ขาดเรียนวันนี้', value: '8', icon: '❌', color: 'var(--error)' }
  ];

  return (
    <div className="fade-in">
      {/* Welcome Section */}
      <div className="card mb-6" style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-light)'
      }}>
        <div className="flex items-center gap-4">
          <div style={{ fontSize: '3rem' }}>👋</div>
          <div>
            <h2 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
              ยินดีต้อนรับ, {username}!
            </h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              วันนี้เป็นวันที่ {new Date().toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="card slide-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}>
                  {stat.label}
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '2rem', 
                  fontWeight: '700',
                  color: stat.color
                }}>
                  {stat.value}
                </p>
              </div>
              <div style={{ 
                fontSize: '2.5rem',
                opacity: 0.7
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Menu Grid */}
      <div>
        <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>
          เมนูหลัก
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {menuItems.filter(item => item.id !== 'dashboard').map((item, index) => (
            <div
              key={item.id}
              className="card slide-in"
              onClick={() => setCurrentPage(item.id)}
              style={{
                cursor: 'pointer',
                animationDelay: `${index * 0.1}s`,
                transition: 'all 0.3s ease'
              }}
            >
              <div className="flex items-center gap-4">
                <div style={{
                  fontSize: '2.5rem',
                  padding: '1rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-light)'
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0',
                    color: 'var(--text-primary)',
                    fontSize: '1.125rem'
                  }}>
                    {item.name}
                  </h4>
                  <p style={{ 
                    margin: 0,
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem'
                  }}>
                    {item.description}
                  </p>
                </div>
                <div style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.25rem'
                }}>
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;