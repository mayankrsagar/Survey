// src/components/ProtectedRoute.jsx
import React from "react";

import { Navigate, useLocation } from "react-router-dom";

import { clearAuth, getAuthPayload } from "../api";

/**
 * <ProtectedRoute>children</ProtectedRoute>
 * <ProtectedRoute role="admin">admin-only</ProtectedRoute>
 */
const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();
  const payload = getAuthPayload(); // null if no token or token expired

  // Not authenticated (no token or expired)
  if (!payload) {
    // ensure we don't keep a stale user in storage
    clearAuth();
    // send user to login and remember where they tried to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Role check (if a role is required)
  if (role && payload.role !== role) {
    // you can redirect to a 403 page instead if you prefer
    return <Navigate to="/login" replace />;
  }

  // allowed
  return <>{children}</>;
};

export default ProtectedRoute;
