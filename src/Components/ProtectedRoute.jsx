import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { auth, roleName, isLoading, error } = useSelector(
    (state) => state.auth,
  );

  return auth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
