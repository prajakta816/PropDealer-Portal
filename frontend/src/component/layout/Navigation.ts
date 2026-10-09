import {
  Assessment,
  Business,
  Dashboard,
  Group,
  ManageAccounts,
  ReceiptLong,
  Settings,
  Tune,
} from '@mui/icons-material'
import type { SvgIconComponent } from '@mui/icons-material'

import { ROLES, type UserRole } from '../../constants/roles'

export interface NavigationItem {
  label: string
  path: string
  icon: SvgIconComponent
  allowedRoles: UserRole[]
}

export interface NavigationSection {
  title: string
  items: NavigationItem[]
}

export const navigationSections: NavigationSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: Dashboard,
        allowedRoles: [
          ROLES.ADMIN,
          ROLES.AGENT,
          ROLES.COMMISSION_MANAGER,
          ROLES.BUYER,
        ],
      },
    ],
  },

  {
    title: 'Management',
    items: [
      {
        label: 'Users',
        path: '/users',
        icon: Group,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Agents',
        path: '/agents',
        icon: Group,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Buyers',
        path: '/buyers',
        icon: Group,
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
      },
      {
        label: 'Commission Managers',
        path: '/commission-managers',
        icon: ManageAccounts,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Properties',
        path: '/properties',
        icon: Business,
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.BUYER],
      },
      {
        label: 'Commission List',
        path: '/commissions',
        icon: Assessment,
        allowedRoles: [ROLES.COMMISSION_MANAGER],
      },
    ],
  },

  {
    title: 'Finance',
    items: [
      {
        label: 'Invoices',
        path: '/invoices',
        icon: ReceiptLong,
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
      },
    ],
  },

  {
    title: 'Configuration',
    items: [
      {
        label: 'Master Data Management',
        path: '/master-data',
        icon: Tune,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'App Management',
        path: '/app-management',
        icon: Settings,
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },

  // Account section removed because Edit Profile
  // should no longer appear in the Sidebar.
]