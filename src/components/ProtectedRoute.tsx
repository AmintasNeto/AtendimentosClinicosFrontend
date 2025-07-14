import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectRouteProps = {
    isAuthenticated: boolean;
    children: ReactNode;
}

const ProtectedRoute = (props: ProtectRouteProps) => {
  if (!props.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return props.children ? props.children : <Outlet />; // Render children or nested routes via Outlet
};

export default ProtectedRoute;