import { Box, Button, Container, Typography } from '@mui/material'
import { Group, ArrowForward } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context'
import { ROLES } from '../constants/roles'

export function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN

  return (
    <Box className="flex-1 bg-slate-50 p-6 md:p-8">
      <Container maxWidth="xl" disableGutters>
        <Box className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Box>
            <Typography variant="h4" component="h1" className="!font-bold !text-slate-900">
              Dashboard
            </Typography>
            <Typography variant="body1" className="!mt-1 !text-slate-500">
              Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span>.
            </Typography>
          </Box>

          {isAdmin && (
            <Button
              component={RouterLink}
              to="/users"
              variant="contained"
              startIcon={<Group />}
              endIcon={<ArrowForward />}
              className="!rounded-xl !bg-blue-600 !px-5 !py-2.5 !normal-case !shadow-md !shadow-blue-600/20"
            >
              Manage Users
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  )
}
