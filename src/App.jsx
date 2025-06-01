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
  const [collapsed, setCollapsed] = useState(false);

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
      // navigate(roleName === "ADMIN" ? "/dashboard" : "/mySchedule");

      // Only redirect to default dashboard if the user is at root ("/") or "/login"
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate(roleName === "ADMIN" ? "/dashboard" : "/mySchedule");
      }
      // Otherwise, stay on the current route
    }
  }, [auth]);

  return (
    <div className=" h-screen bg-gray-100">
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            // <ProtectedRoute>
            //   <div className="flex-grow flex flex-col">
            //     <Navbar setCollapsed={setCollapsed} collapsed={collapsed} />
            //     <div className="flex flex-grow">
            //       <Sidebar setCollapsed={setCollapsed} collapsed={collapsed} />
            //       <div className="flex-grow p-8 pt-5 overflow-y-auto bg-[#f1f6fb]">
            //         <Routes>
            //           <Route path="/" element={<Navigate to="/dashboard" />} />
            //           {routes.map((route) => (
            //             <Route
            //               key={route.path}
            //               path={route.path}
            //               element={<route.element />}
            //             />
            //           ))}
            //           <Route path="*" element={<div>Not Found</div>} />
            //         </Routes>
            //       </div>
            //     </div>
            //   </div>
            // </ProtectedRoute>

            <ProtectedRoute>
              <div className="flex h-screen">
                {/* Sidebar on the left */}
                <Sidebar setCollapsed={setCollapsed} collapsed={collapsed} />

                {/* Right side: navbar on top and content below */}
                <div className="flex flex-col flex-grow">
                  <Navbar setCollapsed={setCollapsed} collapsed={collapsed} />

                  {/* Main content area */}
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
