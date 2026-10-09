import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { DashboardOutlined, LoginOutlined } from '@mui/icons-material'
import { useAuth } from '../../context'

function PublicHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      className="border-b border-slate-200 bg-white/95 backdrop-blur-md"
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          className="flex justify-between gap-4 py-2"
        >
          <Box
            component={RouterLink}
            to="/"
            className="flex items-center gap-2 no-underline"
          >
            <Box className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md shadow-blue-700/20">
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: 800 }}
              >
                P
              </Typography>
            </Box>

            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: 800 }}
              className="text-slate-900"
            >
              PropDealer
            </Typography>
          </Box>

          <Box className="hidden items-center gap-8 md:flex">
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              className="font-medium hover:text-blue-600"
            >
              Home
            </Button>

            <Button
              component="a"
              href="/#features"
              color="inherit"
              className="font-medium hover:text-blue-600"
            >
              Features
            </Button>

            <Button
              component="a"
              href="/#about"
              color="inherit"
              className="font-medium hover:text-blue-600"
            >
              About
            </Button>
          </Box>

          {isAuthenticated ? (
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              startIcon={<DashboardOutlined />}
              className="rounded-xl bg-blue-600 px-5 py-2 font-semibold normal-case shadow-md shadow-blue-600/20 hover:bg-blue-700"
            >
              Dashboard
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              startIcon={<LoginOutlined />}
              className="rounded-xl bg-blue-600 px-5 py-2 font-semibold normal-case shadow-md shadow-blue-600/20 hover:bg-blue-700"
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default PublicHeader
