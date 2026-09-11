import {
    Navigate,
    Route,
    Routes,
  } from 'react-router-dom';
  
  import LoginPage from '../pages/LoginPage';
  import RegisterPage from '../pages/RegisterPage';
  import FeedPage from '../pages/FeedPage';
  
  import ProtectedRoute from '../features/auth/components/ProtectedRoute';
  
  export default function AppRoutes() {
    return (
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />
  
        <Route
          path="/register"
          element={<RegisterPage />}
        />
  
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />
  
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    );
  }