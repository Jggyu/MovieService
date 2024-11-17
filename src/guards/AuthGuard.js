// src/guards/AuthGuard.js
import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }) => {
  const isAuthenticated = localStorage.getItem('TMDb-Key') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};