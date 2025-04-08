import { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./Components/Sidebar";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import routes from "./Routes/routes";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import ProtectedRoute from "./Components/ProtectedRoute";
import { checkAuth } from "./redux/slices/authSlice";
import { fetchEmployeeData } from "./redux/slices/employeeSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { auth, roleName, checkAuthLoading, error } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  // useEffect(() => {
  //   if (roleName === "EMPLOYEE") {
  //     dispatch(fetchEmployeeData());
  //   }
  // }, [roleName]);

  useEffect(() => {
    if (auth) {
      navigate(roleName === "ADMIN" ? "/dashboard" : "/mySchedule");
    }
  }, [auth]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex-grow flex flex-col">
                <Navbar />
                <div className="flex flex-grow">
                  <Sidebar />
                  <div className="flex-grow p-8 pt-5 overflow-y-auto bg-[#f1f6fb]">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      {routes.map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={<route.element />}
                        />
                      ))}
                      <Route path="*" element={<div>Not Found</div>} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
