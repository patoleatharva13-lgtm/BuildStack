import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import RoadmapPage from './pages/RoadmapPage'
import BugsPage from './pages/BugsPage'
import FeaturesPage from './pages/FeaturesPage'
import DocumentationPage from './pages/DocumentationPage'
import ReleasesPage from './pages/ReleasesPage'
import TeamPage from './pages/TeamPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AIToolsPage from './pages/AIToolsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/bugs" element={<BugsPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/releases" element={<ReleasesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai" element={<AIToolsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
