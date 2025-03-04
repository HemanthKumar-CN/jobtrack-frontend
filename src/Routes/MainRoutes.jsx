import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard";
import DefaultLayout from "../Components/DefaultLayout";

export const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/" element={<Dashboard />} /> */}
      <Route path="*" element={<DefaultLayout />} />
    </Routes>
  );
};
