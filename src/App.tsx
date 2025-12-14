import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import InsightsChat from './pages/InsightsChat';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };

  return (
    <Routes>
      {/* Root route - redirect based on authentication */}
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to="/analytics" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login route */}
      <Route path="/login" element={<Login />} />

      {/* Protected dashboard routes */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <InsightsChat />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Transactions />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
