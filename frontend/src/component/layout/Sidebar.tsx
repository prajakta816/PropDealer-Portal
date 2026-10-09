import { useMemo } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import { Apartment } from '@mui/icons-material'
import { navigationSections } from './Navigation'
import type { UserRole } from '../../constants/roles'

interface SidebarProps {
  role: UserRole
}

const desktopDrawerWidth = 260
const miniDrawerWidth = 80

function Sidebar({ role }: SidebarProps) {
  const location = useLocation()

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
        className="flex items-center gap-3 px-5"
        sx={{
          '@media (max-width: 900px)': {
            justifyContent: 'center',
            px: 1,
          },
        }}
      >
        <Box
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          sx={{
            backgroundColor: 'primary.main',
          }}
        >
          <Apartment
            className="text-white"
            fontSize="small"
          />
        </Box>

        <Box
          sx={{
            '@media (max-width: 900px)': {
              display: 'none',
            },
          }}
        >
          <Typography
            variant="subtitle1"
            className="font-bold leading-tight"
          >
            PropDealer
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Portal
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <Box className="flex-1 overflow-y-auto px-3 py-4">
        {filteredSections.map((section) => (
          <Box
            key={section.title}
            className="mb-5"
          >
            <Typography
              variant="caption"
              color="text.secondary"
              className="mb-2 block px-3 font-semibold uppercase tracking-wider"
              sx={{
                '@media (max-width: 900px)': {
                  display: 'none',
                },
              }}
            >
              {section.title}
            </Typography>

            <List disablePadding>
              {section.items.map((item) => {
                const Icon = item.icon
                const isSelected = location.pathname === item.path

                return (
                  <ListItemButton
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    selected={isSelected}
                    className="mb-1 rounded-lg"
                    sx={{
                      minHeight: 44,
                      '@media (max-width: 900px)': {
                        justifyContent: 'center',
                        px: 1,
                      },
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
                        minWidth: 40,
                        color: 'inherit',
                        '@media (max-width: 900px)': {
                          minWidth: 0,
                          justifyContent: 'center',
                        },
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
                          },
                        },
                      }}
                      sx={{
                        '@media (max-width: 900px)': {
                          display: 'none',
                        },
                      }}
                    />
                  </ListItemButton>
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
        width: {
          xs: miniDrawerWidth,
          md: desktopDrawerWidth,
        },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: {
            xs: miniDrawerWidth,
            md: desktopDrawerWidth,
          },
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 200ms ease',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar