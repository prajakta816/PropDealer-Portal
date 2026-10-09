import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

import type { UserRole } from '../../constants/roles'

interface AppLayoutProps {
  role: UserRole
    userName: string

}

function AppLayout({role, userName}: AppLayoutProps) 
{  
  return (
    <Box className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} />

      <Box className="flex min-w-0 flex-1 flex-col">
        <Header role={role} userName={userName} />
        <Box component="main" className="flex min-h-0 flex-1 flex-col" >
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