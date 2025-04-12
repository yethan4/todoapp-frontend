import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? element : <Navigate to="/" />;
};

export { PrivateRoute, PublicRoute };
