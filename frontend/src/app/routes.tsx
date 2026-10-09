import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from '../component/public/PublicLayout'
import HomePage from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import AppLayout from '../component/layout/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { UserListPage } from '../pages/UserListPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { PublicOnlyRoute } from './guards/PublicOnlyRoute'
import { ROLES } from '../constants/roles'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT, ROLES.COMMISSION_MANAGER, ROLES.BUYER]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agents"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PlaceholderPage
                  title="Agent Management"
                  description="Admin workspace to view, create, and manage registered agents."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyers"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <PlaceholderPage
                  title="Buyer Management"
                  description="Directory of prospective property buyers and active leads."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/commission-managers"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PlaceholderPage
                  title="Commission Managers"
                  description="Admin workspace to view and create commission management staff."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/properties"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT, ROLES.BUYER]}>
                <PlaceholderPage
                  title="Property Directory"
                  description="Listings, commercial units, and residential properties under management."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/commissions"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COMMISSION_MANAGER]}>
                <PlaceholderPage
                  title="Commission Tracking"
                  description="Payout schedules, calculations, and agent commission disbursement ledgers."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
                <PlaceholderPage
                  title="Invoices & Billing"
                  description="Generated property transaction receipts and customer billing."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/master-data"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PlaceholderPage
                  title="Master Data Configuration"
                  description="Property types, locations, commission rates, and taxonomy tables."
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/app-management"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PlaceholderPage
                  title="System Settings"
                  description="Platform configurations, audit trails, and security policies."
                />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes