import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import Profile from "../Components/Profile/Profile";
import Dashboard from "../Pages/Dashboard";
import { useAuth } from "../context/AuthContext";
import NotFound from "../Pages/NotFound";
import ForgotPassword from "../Components/Auth/ForgotPassword";
import UpdateProfile from "../Components/Profile/UpdateProfile";

const AllRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      ForgotPassword
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
      />
      <Route
        path="/update"
        element={isAuthenticated ? <UpdateProfile /> : <Navigate to="/" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route path="/resetPassword" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
