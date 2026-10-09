import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useAuth } from '../../context'
import { ROLES, type UserRole } from '../../constants/roles'

interface AppLayoutProps {
  role?: UserRole
  userName?: string
}

function AppLayout({ role, userName }: AppLayoutProps) {
  const { user } = useAuth()
  const activeRole = role || user?.role || ROLES.AGENT
  const activeName = userName || user?.name || 'User'

  return (
    <Box className="flex min-h-screen bg-slate-50">
      <Sidebar role={activeRole} />
      <Box className="flex min-w-0 flex-1 flex-col">
        <Header role={activeRole} userName={activeName} />
        <Box component="main" className="flex min-h-0 flex-1 flex-col">
          <Box className="flex-1">
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  )
}

export default AppLayout