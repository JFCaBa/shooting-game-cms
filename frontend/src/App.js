import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <Layout onLogout={handleLogout} />;
}

export default App;