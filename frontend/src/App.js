import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';

// Separate component for content that uses hooks
function AppContent() {
  const { token, login } = useAuth();

  if (!token) {
    return <Login onLogin={login} />;
  }

  return <Layout />;
}

// Main App component that provides context
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;