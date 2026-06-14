import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import PublicDashboard from './pages/PublicDashboard'
import DashboardPage from './pages/student/DashboardPage'
import PlantsPage from './pages/student/PlantsPage'
import PlantDetailPage from './pages/student/PlantDetailPage'
import ClassmatesPage from './pages/student/ClassmatesPage'
import RegisterPage from './pages/student/RegisterPage'
import ScoresPage from './pages/student/ScoresPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentsPage from './pages/admin/StudentsPage'
import AdminPlantsPage from './pages/admin/AdminPlantsPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/publico" element={<PublicDashboard />} />

      {/* Rutas de estudiante */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plants"
        element={
          <ProtectedRoute>
            <Layout><PlantsPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/companeros"
        element={
          <ProtectedRoute>
            <Layout><ClassmatesPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plants/:plantId"
        element={
          <ProtectedRoute>
            <Layout><PlantDetailPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute>
            <Layout><RegisterPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/scores"
        element={
          <ProtectedRoute>
            <Layout><ScoresPage /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Rutas de admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout><StudentsPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/plants"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout><AdminPlantsPage /></Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/metamorfosis">
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
