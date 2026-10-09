import { useState } from 'react'

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import PersonIcon from '@mui/icons-material/Person'

import { ROLES, type UserRole } from '../../constants/roles'

interface HeaderProps {
  role: UserRole
  userName: string
}

function Header({role, userName,}: HeaderProps) {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null)

  const menuOpen = Boolean(anchorEl)

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditProfile = () => {
    console.log('Edit Profile clicked')
    handleMenuClose()
  }

  const handleLogout = () => {
    console.log('Logout clicked')
    handleMenuClose()
  }

  const getRoleIcon = () => {
    switch (role) {
      case ROLES.ADMIN:
        return <AdminPanelSettingsIcon />

      case ROLES.COMMISSION_MANAGER:
        return <SupervisorAccountIcon />

      case ROLES.AGENT:
        return <PersonIcon />

      default:
        return <PersonIcon />
    }
  }

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar className="flex">

        {/* Header title - visible only on smaller screens */}
        <Typography
          variant="h6"
          component="h1"
          className="font-semibold"
          sx={{
            display: {
              xs: 'block',
              md: 'none',
            },
          }}
        >
          PropDealer Portal
        </Typography>

        {/* User profile section */}
        <Box sx={{ marginLeft: 'auto' }}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="open user menu"
            aria-controls={menuOpen ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
              }}
            >
              {getRoleIcon()}
            </Avatar>

            <Typography
              variant="body2"
              sx={{
                ml: 1,
                display: {
                  xs: 'none',
                  sm: 'block',
                },
              }}
            >
              {userName}
            </Typography>
          </IconButton>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleEditProfile}>
              Edit Profile
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header