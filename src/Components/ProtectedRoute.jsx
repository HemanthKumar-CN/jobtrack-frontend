import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FullScreenLoader from "./FullScreenLoader";

const ProtectedRoute = ({ children }) => {
  const { auth, roleName, checkAuthLoading, error } = useSelector(
    (state) => state.auth,
  );

  if (checkAuthLoading === null || checkAuthLoading === true) {
    return <FullScreenLoader />; // or a loading spinner
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
