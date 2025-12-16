import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUsername(user.fullname);
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user.fullname);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard username={username} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;