import { useState } from 'react'
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

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  // Function to toggle sidebar state on double clicking the main content area
  const handleDoubleClick = () => {
    setIsCollapsed((prevState) => !prevState)
  }

  return (
    <Box className="flex min-h-screen bg-slate-50">
      <Sidebar role={activeRole} isCollapsed={isCollapsed} />
      <Box
        className="flex min-w-0 flex-1 flex-col"
        onDoubleClick={handleDoubleClick}
        sx={{
          transition: 'all 200ms ease',
        }}

      >
        <Header role={activeRole} userName={activeName} isSidebarCollapsed={isCollapsed} />
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