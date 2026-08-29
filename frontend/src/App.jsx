import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';

/**
 * StudyLoop Main Application Entry
 * Modular Architecture with Code Splitting & Lazy Loading
 */
export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
