import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Pages
import LoginPage from '@/pages/Login';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import DashboardPage from '@/pages/Dashboard';
import ProjectRequestsPage from '@/pages/ProjectRequests';
import ProjectsPage from '@/pages/Projects';
import TasksPage from '@/pages/Tasks';
import ChangeRequestsPage from '@/pages/ChangeRequests';
import ChangeRequestDetailPage from '@/pages/ChangeRequestDetail';
import ChangeAnalyticsPage from '@/pages/ChangeAnalytics';

import NotFoundPage from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/project-requests"
              element={
                <ProtectedRoute>
                  <ProjectRequestsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects/:id/tasks"
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-requests"
              element={
                <ProtectedRoute>
                  <ChangeRequestsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-requests/:id"
              element={
                <ProtectedRoute>
                  <ChangeRequestDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-analytics"
              element={
                <ProtectedRoute>
                  <ChangeAnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-requests"
              element={
                <ProtectedRoute>
                  <ChangeRequestsPage />
                </ProtectedRoute>
              }
            />

            // Add route
            <Route
              path="/change-requests/:id"
              element={
                <ProtectedRoute>
                  <ChangeRequestDetailPage />
                </ProtectedRoute>
              }
            />

            // Add route
            <Route
              path="/change-analytics"
              element={
                <ProtectedRoute>
                  <ChangeAnalyticsPage />
                </ProtectedRoute>
              }
            />


            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
