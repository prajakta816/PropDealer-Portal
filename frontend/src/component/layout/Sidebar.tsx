import { useMemo } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, } from '@mui/material'
import { Apartment } from '@mui/icons-material'
import { navigationSections } from './Navigation'
import type { UserRole } from '../../constants/roles'

interface SidebarProps {
  role: UserRole
  isCollapsed?: boolean
}

// Sidebar width constants as per requirement
const EXPANDED_WIDTH = 240
const COLLAPSED_WIDTH = 64

function Sidebar({ role, isCollapsed = false }: SidebarProps) {
  const location = useLocation()

 
  const responsiveWidth = {
    xs: COLLAPSED_WIDTH,
    md: isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
  }

  const filteredSections = useMemo(
    () =>
      navigationSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            item.allowedRoles.includes(role),
          ),
        }))
        .filter((section) => section.items.length > 0),
    [role],
  )

  const drawerContent = (
    <Box className="flex h-full flex-col">
      <Toolbar
        className="flex items-center gap-3"
        sx={{
          px: isCollapsed ? 1.5 : { xs: 1.5, md: 2.5 },
          justifyContent: isCollapsed ? 'center' : { xs: 'center', md: 'flex-start' },
          minHeight: 64,
          transition: 'padding 200ms ease',
        }}
      >
        <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" sx={{ backgroundColor: 'primary.main', }} >
          <Apartment className="text-white" fontSize="small" />
        </Box>

        {/* Hide brand name and role badge when sidebar is collapsed OR on mobile/small screens */}
        <Box className="overflow-hidden whitespace-nowrap" sx={{ display: isCollapsed ? 'none' : { xs: 'none', md: 'block' }, }} >
          <Typography variant="subtitle1" className="font-bold leading-tight" >
            PropDealer
          </Typography>

          <Box className="flex items-center gap-1.5">
            <Typography variant="caption" color="text.secondary" >
              Portal
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                px: 0.8,
                py: 0.1,
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {role}
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      <Box className="flex-1 overflow-y-auto" sx={{ px: isCollapsed ? 1 : { xs: 1, md: 1.5 }, py: 2, }} >
        {filteredSections.map((section) => (
          <Box key={section.title} className="mb-5" >
            {/* Section title hidden when collapsed or on small screens */}
            <Typography
              variant="caption"
              color="text.secondary"
              className="mb-2 block px-3 font-semibold uppercase tracking-wider"
              sx={{
                display: isCollapsed ? 'none' : { xs: 'none', md: 'block' },
              }}
            >
              {section.title}
            </Typography>

            <List disablePadding>
              {section.items.map((item) => {
                const Icon = item.icon
                const isSelected = location.pathname === item.path

                // Button element rendering the menu item icon and conditional text
                const itemButton = (
                  <ListItemButton
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    selected={isSelected}
                    className="mb-1 rounded-lg"
                    sx={{
                      minHeight: 44,
                      px: isCollapsed ? 1 : { xs: 1, md: 2 },
                      justifyContent: isCollapsed ? 'center' : { xs: 'center', md: 'flex-start' },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        },
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: isCollapsed ? 0 : { xs: 0, md: 36 },
                        justifyContent: 'center',
                        color: 'inherit',
                      }}
                    >
                      <Icon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 14,
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          },
                        },
                      }}
                      sx={{
                        display: isCollapsed ? 'none' : { xs: 'none', md: 'block' },
                      }}
                    />
                  </ListItemButton>
                )

                return (
                  <Tooltip
                    key={item.path}
                    title={item.label}
                    placement="right"
                    arrow
                    disableHoverListener={!isCollapsed}
                    sx={{
                      '@media (min-width: 900px)': {
                        '&.MuiTooltip-popper': {
                          display: isCollapsed ? 'block' : 'none',
                        },
                      },
                    }}
                  >
                    {itemButton}
                  </Tooltip>
                )
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: responsiveWidth,
        flexShrink: 0,
        transition: 'width 200ms ease',
        '& .MuiDrawer-paper': {
          width: responsiveWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 200ms ease',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar