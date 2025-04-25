import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RouteProps {
  element: React.ReactNode;
}

const PrivateRoute = ({ element }: RouteProps) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }: RouteProps) => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? element : <Navigate to="/" />;
};

export { PrivateRoute, PublicRoute };
