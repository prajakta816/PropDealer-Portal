import { useEffect, useState } from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography, } from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { DashboardOutlined, LoginOutlined } from '@mui/icons-material'
import { useAuth } from '../../context'

function PublicHeader() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Track the active section on the page: 'home' | 'features' | 'about'
  const [activeSection, setActiveSection] = useState<'home' | 'features' | 'about'>('home')

  // Detect which section is currently on screen while scrolling
  useEffect(() => {
    if (location.pathname !== '/') {
      return
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120

      const featuresEl = document.getElementById('features')
      const aboutEl = document.getElementById('about')

      const featuresTop = featuresEl ? featuresEl.offsetTop : Infinity
      const aboutTop = aboutEl ? aboutEl.offsetTop : Infinity

      if (scrollPosition >= aboutTop) {
        setActiveSection('about')
      } else if (scrollPosition >= featuresTop) {
        setActiveSection('features')
      } else {
        setActiveSection('home')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Run once on load/navigation

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [location.pathname])

  // Helper to scroll smoothly to a section on click
  const scrollToSection = (sectionId: 'home' | 'features' | 'about') => {
    setActiveSection(sectionId)

    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          const el = document.getElementById(sectionId)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }, 100)
      return
    }

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Hide the Login button if already on the /login page
  const isLoginPage = location.pathname === '/login'

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backgroundColor: '#ffffff !important',
        zIndex: 1100,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
      }}
      className="border-b border-slate-200"
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          className="flex justify-between gap-4 py-2"
        >
          {/* Project Logo & Name */}
          <Box
            component={RouterLink}
            to="/"
            onClick={() => scrollToSection('home')}
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
              sx={{ fontWeight: 800, color: '#0f172a' }}
              className="text-slate-900"
            >
              PropDealer
            </Typography>
          </Box>

          {/* Navigation items: Home, Features, About with active highlighting */}
          <Box className="hidden items-center gap-8 md:flex">
            <Button
              onClick={() => scrollToSection('home')}
              color="inherit"
              sx={{
                fontWeight: activeSection === 'home' && !isLoginPage ? 700 : 500,
                color: activeSection === 'home' && !isLoginPage ? '#1d4ed8' : '#475569',
                borderBottom: activeSection === 'home' && !isLoginPage ? '2px solid #1d4ed8' : '2px solid transparent',
                borderRadius: 0,
                px: 1,
                py: 1,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  color: '#1d4ed8',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Home
            </Button>

            <Button
              onClick={() => scrollToSection('features')}
              color="inherit"
              sx={{
                fontWeight: activeSection === 'features' && !isLoginPage ? 700 : 500,
                color: activeSection === 'features' && !isLoginPage ? '#1d4ed8' : '#475569',
                borderBottom: activeSection === 'features' && !isLoginPage ? '2px solid #1d4ed8' : '2px solid transparent',
                borderRadius: 0,
                px: 1,
                py: 1,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  color: '#1d4ed8',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Features
            </Button>

            <Button
              onClick={() => scrollToSection('about')}
              color="inherit"
              sx={{
                fontWeight: activeSection === 'about' && !isLoginPage ? 700 : 500,
                color: activeSection === 'about' && !isLoginPage ? '#1d4ed8' : '#475569',
                borderBottom: activeSection === 'about' && !isLoginPage ? '2px solid #1d4ed8' : '2px solid transparent',
                borderRadius: 0,
                px: 1,
                py: 1,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': {
                  color: '#1d4ed8',
                  backgroundColor: 'transparent',
                },
              }}
            >
              About
            </Button>
          </Box>

          {/* Login or Dashboard Button — hidden on /login */}
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
          ) : !isLoginPage ? (
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              startIcon={<LoginOutlined />}
              className="rounded-xl bg-blue-600 px-5 py-2 font-semibold normal-case shadow-md shadow-blue-600/20 hover:bg-blue-700"
            >
              Login
            </Button>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default PublicHeader