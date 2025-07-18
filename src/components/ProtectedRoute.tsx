import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectRouteProps = {
    isAuthenticated: boolean;
    children: ReactNode;
}

const ProtectedRoute = (props: ProtectRouteProps) => {
  const storedSession = localStorage.getItem("userSession");

  if (!props.isAuthenticated && storedSession === null) {
    return <Navigate to="/login" replace />;
  }
  return props.children ? props.children : <Outlet />;
};

export default ProtectedRoute;