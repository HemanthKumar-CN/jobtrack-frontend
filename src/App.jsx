import { useState } from "react";
import "./App.css";

import { MainRoutes } from "./Routes/MainRoutes";
import Sidebar from "./Components/Sidebar";
import { Route, Routes } from "react-router-dom";
import routes from "./Routes/routes";

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Always Visible */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-8 overflow-y-auto bg-[#f1f6fb]">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;
