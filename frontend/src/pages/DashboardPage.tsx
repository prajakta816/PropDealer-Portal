import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material'
import {
  Apartment,
  ArrowForward,
  Assessment,
  Group,
  ReceiptLong,
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context'
import { ROLES, type UserRole } from '../constants/roles'

interface QuickCard {
  title: string
  description: string
  icon: typeof Apartment
  path: string
  color: string
}

function getRoleCards(role?: UserRole): QuickCard[] {
  switch (role) {
    case ROLES.ADMIN:
      return [
        {
          title: 'User Management',
          description: 'Manage registered system users, roles, and access permissions.',
          icon: Group,
          path: '/users',
          color: '#2563eb',
        },
        {
          title: 'Agent Directory',
          description: 'View active real estate agents and team assignments.',
          icon: Group,
          path: '/agents',
          color: '#059669',
        },
        {
          title: 'Properties',
          description: 'Explore commercial and residential listings under management.',
          icon: Apartment,
          path: '/properties',
          color: '#7c3aed',
        },
        {
          title: 'Invoices & Billing',
          description: 'Monitor platform transaction billing and client receipts.',
          icon: ReceiptLong,
          path: '/invoices',
          color: '#ea580c',
        },
      ]

    case ROLES.AGENT:
      return [
        {
          title: 'Properties',
          description: 'Browse available listings, status, and client bookings.',
          icon: Apartment,
          path: '/properties',
          color: '#059669',
        },
        {
          title: 'Buyer Leads',
          description: 'Track prospective property buyers and active inquiries.',
          icon: Group,
          path: '/buyers',
          color: '#2563eb',
        },
        {
          title: 'Invoices & Billing',
          description: 'View completed transaction receipts and client invoices.',
          icon: ReceiptLong,
          path: '/invoices',
          color: '#ea580c',
        },
      ]

    case ROLES.BUYER:
      return [
        {
          title: 'Explore Properties',
          description: 'Discover available residential and commercial properties.',
          icon: Apartment,
          path: '/properties',
          color: '#d97706',
        },
        {
          title: 'Invoices & Receipts',
          description: 'Review transaction receipts, payment schedules, and billing.',
          icon: ReceiptLong,
          path: '/invoices',
          color: '#2563eb',
        },
      ]

    case ROLES.COMMISSION_MANAGER:
      return [
        {
          title: 'Commission Tracking',
          description: 'Track agent commission payout schedules and disbursement ledgers.',
          icon: Assessment,
          path: '/commissions',
          color: '#7c3aed',
        },
        {
          title: 'Invoices & Receipts',
          description: 'Audit property sale settlements and transaction payments.',
          icon: ReceiptLong,
          path: '/invoices',
          color: '#2563eb',
        },
      ]

    default:
      return []
  }
}

export function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const quickCards = getRoleCards(user?.role)

  return (
    <Box className="flex-1 bg-slate-50 p-6 md:p-8">
      <Container maxWidth="xl" disableGutters>
        <Box className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Box>
            <Typography variant="h4" component="h1" className="!font-bold !text-slate-900">
              Dashboard
            </Typography>
            <Typography variant="body1" className="!mt-1 !text-slate-500">
              Welcome back, <span className="font-semibold text-slate-800">{user?.name}</span> ({user?.role}).
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

        <Box className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {quickCards.map((card) => {
            const Icon = card.icon
            return (
              <Card
                key={card.title}
                component={RouterLink}
                to={card.path}
                elevation={0}
                className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 no-underline transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                <CardContent className="!p-0">
                  <Box
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    sx={{ backgroundColor: `${card.color}15`, color: card.color }}
                  >
                    <Icon />
                  </Box>
                  <Typography variant="h6" className="!font-bold !text-slate-900">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" className="!mt-1 !text-slate-500">
                    {card.description}
                  </Typography>
                  <Box className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:translate-x-1">
                    Open module <ArrowForward fontSize="small" />
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}
