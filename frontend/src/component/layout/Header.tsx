import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { ROLES, type UserRole } from '../../constants/roles'
import { useAuth } from '../../context'

interface HeaderProps {
  role?: UserRole
  userName?: string
}

interface RoleVisualConfig {
  label: string
  Icon: typeof PersonIcon
  gradient: string
  ringColor: string
}

const ROLE_VISUALS: Record<UserRole, RoleVisualConfig> = {
  [ROLES.ADMIN]: {
    label: 'Admin',
    Icon: AdminPanelSettingsIcon,
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    ringColor: 'ring-blue-400/40',
  },
  [ROLES.AGENT]: {
    label: 'Agent',
    Icon: PersonIcon,
    gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
    ringColor: 'ring-emerald-400/40',
  },
  [ROLES.COMMISSION_MANAGER]: {
    label: 'Commission Manager',
    Icon: SupervisorAccountIcon,
    gradient: 'from-purple-600 via-indigo-600 to-violet-700',
    ringColor: 'ring-purple-400/40',
  },
  [ROLES.BUYER]: {
    label: 'Buyer',
    Icon: ShoppingBagOutlinedIcon,
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    ringColor: 'ring-amber-400/40',
  },
}

function Header({ role, userName }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const activeRole = role || user?.role || ROLES.AGENT
  const activeName = userName || user?.name || 'User'
  const activeEmail = user?.email || ''

  const menuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditProfile = () => {
    handleMenuClose()
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
    navigate('/', { replace: true })
  }

  const roleConfig = ROLE_VISUALS[activeRole] || ROLE_VISUALS[ROLES.AGENT]
  const RoleIcon = roleConfig.Icon

  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="border-b border-slate-200 bg-white/95 backdrop-blur-md"
    >
      <Toolbar className="flex min-h-[72px] justify-between px-4 sm:px-6">
        <Typography
          variant="h6"
          component="h1"
          className="font-extrabold tracking-tight text-slate-900"
          sx={{
            display: {
              xs: 'block',
              md: 'none',
            },
          }}
        >
          PropDealer
        </Typography>

        <Box sx={{ marginLeft: 'auto' }}>
          <ButtonBase
            onClick={handleMenuOpen}
            aria-label="open user menu"
            aria-controls={menuOpen ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            className="group flex items-center gap-2.5 rounded-2xl px-3 py-1.5 transition-all duration-200 hover:bg-slate-100"
          >
            <Box className="relative">
              <Avatar
                className={`h-10 w-10 bg-gradient-to-tr ${roleConfig.gradient} text-white shadow-md transition-transform duration-200 group-hover:scale-105 ring-2 ${roleConfig.ringColor}`}
              >
                <RoleIcon className="text-white" fontSize="small" />
              </Avatar>
            </Box>

            <Box className="flex flex-col items-start text-left">
              <Typography
                variant="body2"
                className="!max-w-[140px] !truncate !text-xs !font-bold !text-slate-800 group-hover:!text-blue-700"
              >
                {activeName}
              </Typography>
              <Typography
                variant="caption"
                className="!text-[10px] !font-semibold !text-slate-500 uppercase tracking-wider"
              >
                {roleConfig.label}
              </Typography>
            </Box>
          </ButtonBase>

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
            slotProps={{
              paper: {
                className: 'mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10',
              },
            }}
          >
            <Box className="flex flex-col items-center px-4 py-4 text-center">
              <Avatar
                className={`h-12 w-12 bg-gradient-to-tr ${roleConfig.gradient} text-white shadow-md ring-2 ${roleConfig.ringColor}`}
              >
                <RoleIcon fontSize="medium" />
              </Avatar>

              <Typography variant="subtitle2" className="!mt-2 !font-bold !text-slate-900">
                {activeName}
              </Typography>

              {activeEmail && (
                <Typography variant="caption" className="!text-slate-500">
                  {activeEmail}
                </Typography>
              )}

              <Box className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                {roleConfig.label}
              </Box>
            </Box>

            <Divider className="!my-1" />

            <MenuItem
              onClick={handleEditProfile}
              className="!mx-1 !my-0.5 !rounded-xl !py-2.5 !text-slate-700 hover:!bg-slate-100 hover:!text-slate-900"
            >
              <ListItemIcon className="!min-w-8 !text-slate-500">
                <EditOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Edit Profile"
                slotProps={{
                  primary: {
                    className: '!text-sm !font-semibold',
                  },
                }}
              />
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              className="!mx-1 !my-0.5 !rounded-xl !py-2.5 !text-rose-600 hover:!bg-rose-50"
            >
              <ListItemIcon className="!min-w-8 !text-rose-600">
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                slotProps={{
                  primary: {
                    className: '!text-sm !font-semibold',
                  },
                }}
              />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header