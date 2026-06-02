import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute({ children }) {
  const { pseudo, token } = useUser();

  if (!pseudo || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
