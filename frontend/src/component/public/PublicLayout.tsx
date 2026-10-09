
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

import PublicHeader from './PublicHeader'

function PublicLayout() {
  return (
    <Box className="flex min-h-screen flex-col bg-white">
      <PublicHeader />

      <Box component="main" className="flex flex-1 flex-col">
        <Outlet />
      </Box>
    </Box>
  )
}

export default PublicLayout