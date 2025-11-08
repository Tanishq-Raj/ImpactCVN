import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Wraps routes that require authentication
 * Redirects to /login if user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
