import { useState } from 'react';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // เข้าสู่ระบบสำเร็จ
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          onLogin(data.user);
        } else {
          // สมัครสมาชิกสำเร็จ
          setMessage('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
          setIsLogin(true);
          setFormData({ username: '', password: '', fullname: '' });
        }
      } else {
        setMessage(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '28px'
        }}>
          {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </h2>

        <div style={{
          display: 'flex',
          marginBottom: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '5px'
        }}>
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage('');
              setFormData({ username: '', password: '', fullname: '' });
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: isLogin ? '#4a90e2' : 'transparent',
              color: isLogin ? 'white' : '#666',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage('');
              setFormData({ username: '', password: '', fullname: '' });
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: !isLogin ? '#4a90e2' : 'transparent',
              color: !isLogin ? 'white' : '#666',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            สมัครสมาชิก
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #4a90e2',
                borderRadius: '8px',
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
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #4a90e2',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: 'black'
              }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                ชื่อ-นามสกุล
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #4a90e2',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                  color: 'black'
                }}
              />
            </div>
          )}

          {message && (
            <div style={{
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '5px',
              backgroundColor: message.includes('สำเร็จ') ? '#d4edda' : '#f8d7da',
              color: message.includes('สำเร็จ') ? '#155724' : '#721c24',
              border: `1px solid ${message.includes('สำเร็จ') ? '#c3e6cb' : '#f5c6cb'}`,
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: isLoading ? '#ccc' : '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;