import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from 'react';

interface RouteProps {
  element: React.ReactNode;
}

const PrivateRoute = ({ element }: RouteProps): ReactElement => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <>{element}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ element }: RouteProps): ReactElement => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? <>{element}</> : <Navigate to="/" />;
};

export { PrivateRoute, PublicRoute };