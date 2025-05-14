import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

/**
 * ProtectedRoute Component
 * 
 * This component is used to protect routes that require authentication.
 * It will redirect unauthenticated users to the login page.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.allowedRoles - Optional array of roles allowed to access the route
 * @returns {React.ReactElement} The protected route or redirect
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if route requires specific roles
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => user.roles.includes(role));
    
    if (!hasRequiredRole) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and authorized, render the protected route
  return <Outlet />;
};

export default ProtectedRoute; 