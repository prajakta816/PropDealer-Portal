import { useState, type FormEvent } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Add,
  ArrowBack,
  BadgeOutlined,
  Close,
  DeleteOutlined,
  EditOutlined,
  EmailOutlined,
  KeyOutlined,
  Person,
  PersonOutlined,
  Visibility,
  VisibilityOff,
  VisibilityOutlined,
} from '@mui/icons-material'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import { Link as RouterLink } from 'react-router-dom'
import {
  USERS_STORAGE_KEY,
  hashPassword,
  type User,
  type StoredUser,
} from '../context'
import { ROLES, type UserRole } from '../constants/roles'

const ROLE_COLORS: Record<UserRole, 'primary' | 'success' | 'secondary' | 'warning'> = {
  [ROLES.ADMIN]: 'primary',
  [ROLES.AGENT]: 'success',
  [ROLES.COMMISSION_MANAGER]: 'secondary',
  [ROLES.BUYER]: 'warning',
}

function loadUsers(): User[] {
  const rawData = localStorage.getItem(USERS_STORAGE_KEY)
  if (rawData) {
    try {
      return JSON.parse(rawData) as User[]
    } catch {
      return []
    }
  }
  return []
}

const ROLE_GRADIENTS: Record<UserRole, string> = {
  [ROLES.ADMIN]: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  [ROLES.AGENT]: 'linear-gradient(135deg, #10b981, #047857)',
  [ROLES.COMMISSION_MANAGER]: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  [ROLES.BUYER]: 'linear-gradient(135deg, #f59e0b, #d97706)',
}

type ModalMode = 'create' | 'edit' | 'view' | null

export function UserListPage() {
  const [users, setUsers] = useState<User[]>(loadUsers)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(ROLES.AGENT)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')

  const resetForm = () => {
    setName('')
    setEmail('')
    setRole(ROLES.AGENT)
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setErrorMessage(null)
  }

  const openCreate = () => {
    resetForm()
    setSelectedUser(null)
    setModalMode('create')
  }

  const openEdit = (user: User) => {
    setSelectedUser(user)
    setName(user.name)
    setEmail(user.email)
    setRole(user.role)
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setErrorMessage(null)
    setModalMode('edit')
  }

  const openView = (user: User) => {
    setSelectedUser(user)
    setModalMode('view')
  }

  const openDeleteConfirm = (user: User) => {
    setUserToDelete(user)
    setDeleteConfirmOpen(true)
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedUser(null)
    resetForm()
  }

  const handleDelete = () => {
    if (!userToDelete) return
    const rawData = localStorage.getItem(USERS_STORAGE_KEY)
    const existing: StoredUser[] = rawData ? JSON.parse(rawData) : []
    const updated = existing.filter((u) => u.id !== userToDelete.id)
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated))
    setUsers(loadUsers())
    setToastSeverity('success')
    setToastMessage(`${userToDelete.name} has been deleted.`)
    setDeleteConfirmOpen(false)
    setUserToDelete(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage('Full name is required.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (modalMode === 'create') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.')
        return
      }
    }

    if (modalMode === 'edit' && password && password.length < 6) {
      setErrorMessage('New password must be at least 6 characters.')
      return
    }

    if (modalMode === 'edit' && password && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const rawData = localStorage.getItem(USERS_STORAGE_KEY)
      const existingUsers: StoredUser[] = rawData ? JSON.parse(rawData) : []

      if (modalMode === 'create') {
        const emailExists = existingUsers.some(
          (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
        )
        if (emailExists) {
          setErrorMessage('A user with this email address already exists.')
          setIsSubmitting(false)
          return
        }

        const passwordHash = await hashPassword(password)
        const newUser: StoredUser = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: role,
          passwordHash: passwordHash,
          createdAt: new Date().toISOString(),
        }
        existingUsers.push(newUser)
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers))
        setToastSeverity('success')
        setToastMessage(`${newUser.name} has been registered successfully.`)
      }

      if (modalMode === 'edit' && selectedUser) {
        const emailExists = existingUsers.some(
          (u) =>
            u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
            u.id !== selectedUser.id
        )
        if (emailExists) {
          setErrorMessage('Another user with this email already exists.')
          setIsSubmitting(false)
          return
        }

        const updatedUsers = await Promise.all(
          existingUsers.map(async (u) => {
            if (u.id !== selectedUser.id) return u
            return {
              ...u,
              name: name.trim(),
              email: email.trim().toLowerCase(),
              role: role,
              passwordHash: password ? await hashPassword(password) : u.passwordHash,
            }
          })
        )
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers))
        setToastSeverity('success')
        setToastMessage(`${name.trim()} has been updated successfully.`)
      }

      setUsers(loadUsers())
      closeModal()
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'User',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box className="flex items-center gap-3 py-2">
          <Avatar
            sx={{
              width: 38,
              height: 38,
              background: ROLE_GRADIENTS[params.row.role as UserRole],
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            {(params.row.name as string).charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email Address',
      flex: 1.4,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
          {params.row.email}
        </Typography>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 190,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.role}
          size="small"
          sx={{
            background: ROLE_GRADIENTS[params.row.role as UserRole],
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.03em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: 'none',
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const isAdminUser = params.row.role === ROLES.ADMIN
        return (
          <Box className="flex items-center gap-1">
            <Tooltip title="View Details" arrow>
              <IconButton
                size="small"
                onClick={() => openView(params.row as User)}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: '#dbeafe', color: '#2563eb', transform: 'scale(1.15)' },
                }}
              >
                <VisibilityOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            {!isAdminUser && (
              <>
                <Tooltip title="Edit User" arrow>
                  <IconButton
                    size="small"
                    onClick={() => openEdit(params.row as User)}
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': { backgroundColor: '#d1fae5', color: '#059669', transform: 'scale(1.15)' },
                    }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete User" arrow>
                  <IconButton
                    size="small"
                    onClick={() => openDeleteConfirm(params.row as User)}
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': { backgroundColor: '#fee2e2', color: '#dc2626', transform: 'scale(1.15)' },
                    }}
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <Box
      className="flex-1 p-6 md:p-8"
      sx={{
        background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%)',
        minHeight: '100%',
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #2563eb 100%)',
            borderRadius: '20px',
            p: { xs: 3, md: 4 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(29, 78, 216, 0.35)',
          }}
        >
          <Box
            sx={{
              position: 'absolute', top: -40, right: -40,
              width: 220, height: 220,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute', bottom: -60, left: '40%',
              width: 180, height: 180,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            }}
          />

          <Box className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center" sx={{ position: 'relative', zIndex: 1 }}>
            <Box>
              <Button
                component={RouterLink}
                to="/dashboard"
                startIcon={<ArrowBack />}
                sx={{
                  mb: 1.5,
                  color: 'rgba(255,255,255,0.75)',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
                size="small"
              >
                Back to Dashboard
              </Button>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                User Management
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.5 }}>
                {users.length} registered accounts in the system
              </Typography>
            </Box>

            <Button
                onClick={openCreate}
                variant="contained"
                startIcon={<Add />}
                sx={{
                  background: '#fff',
                  color: '#1d4ed8',
                  fontWeight: 700,
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s',
                  '&:hover': { background: '#eff6ff', transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' },
                }}
              >
                Add New User
              </Button>
          </Box>
        </Box>

        <Box
          sx={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            mb: 2,
          }}
        >
          <Box
            sx={{
              '& .MuiDataGrid-root': { border: 'none', fontFamily: 'inherit' },
              '& .MuiDataGrid-columnHeaders': {
                background: 'linear-gradient(90deg, #f8fafc, #f1f5f9)',
                borderBottom: '2px solid #e2e8f0',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                color: '#374151',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              },
              '& .MuiDataGrid-row': {
                transition: 'all 0.18s ease',
                cursor: 'default',
              },
              '& .MuiDataGrid-row:hover': {
                background: 'linear-gradient(90deg, #eff6ff, #f8fafc)',
                transform: 'scale(1.001)',
                boxShadow: '0 2px 12px rgba(37, 99, 235, 0.08)',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9',
                alignItems: 'center',
              },
              '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
              '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid #e2e8f0',
                background: 'linear-gradient(90deg, #f8fafc, #f1f5f9)',
              },
              '& .MuiTablePagination-root': { color: '#64748b' },
              '& .MuiDataGrid-virtualScroller': { minHeight: '200px' },
            }}
          >
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              autoHeight
              disableRowSelectionOnClick
              rowHeight={72}
            />
          </Box>
        </Box>
      </Container>

      <Dialog
        open={modalMode === 'create' || modalMode === 'edit'}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { className: 'rounded-2xl' } }}
      >
        <DialogTitle className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <Box>
            <Typography variant="h6" className="!font-bold !text-slate-900">
              {modalMode === 'create' ? 'Create New User' : 'Edit User'}
            </Typography>
            <Typography variant="caption" className="!text-slate-500">
              {modalMode === 'create'
                ? 'Register an Agent, Commission Manager, or Buyer.'
                : 'Update user details. Leave password blank to keep existing.'}
            </Typography>
          </Box>
          <IconButton onClick={closeModal} size="small" className="text-slate-400 hover:text-slate-700">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="px-6 py-5">
          {errorMessage && (
            <Alert severity="error" className="!mb-5 !rounded-xl">
              {errorMessage}
            </Alert>
          )}

          <Box component="form" id="user-form" onSubmit={handleSubmit} noValidate className="space-y-4">
            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">Full Name</Typography>
              <TextField
                fullWidth
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined className="text-slate-400" fontSize="small" />
                      </InputAdornment>
                    ),
                    className: 'rounded-xl',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">Email Address</Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="name@propdealer.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined className="text-slate-400" fontSize="small" />
                      </InputAdornment>
                    ),
                    className: 'rounded-xl',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">Assigned Role</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="rounded-xl"
                  startAdornment={
                    <InputAdornment position="start">
                      <BadgeOutlined className="text-slate-400" fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value={ROLES.AGENT}>Real Estate Agent</MenuItem>
                  <MenuItem value={ROLES.COMMISSION_MANAGER}>Commission Manager</MenuItem>
                  <MenuItem value={ROLES.BUYER}>Buyer</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                {modalMode === 'edit' ? 'New Password (optional)' : 'Password'}
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder={modalMode === 'edit' ? 'Leave blank to keep existing' : 'Minimum 6 characters'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyOutlined className="text-slate-400" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                          {showPassword
                            ? <VisibilityOff fontSize="small" className="text-slate-400" />
                            : <Visibility fontSize="small" className="text-slate-400" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    className: 'rounded-xl',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                {modalMode === 'edit' ? 'Confirm New Password' : 'Confirm Password'}
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyOutlined className="text-slate-400" fontSize="small" />
                      </InputAdornment>
                    ),
                    className: 'rounded-xl',
                  },
                }}
              />
            </Box>

            <Box className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <Button onClick={closeModal} className="!normal-case !text-slate-600">
                Cancel
              </Button>
              <Box className="flex items-center gap-3">
                {isSubmitting && (
                  <CircularProgress size={24} thickness={4} className="!text-blue-600" />
                )}
                <Button
                  type="submit"
                  form="user-form"
                  variant="contained"
                  disabled={isSubmitting}
                  className="!rounded-xl !bg-blue-600 !px-6 !py-2 !normal-case !shadow-md !shadow-blue-600/20"
                >
                  {modalMode === 'create' ? 'Create User' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalMode === 'view'}
        onClose={closeModal}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { className: 'rounded-2xl' } }}
      >
        <DialogTitle className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <Typography variant="h6" className="!font-bold !text-slate-900">
            User Details
          </Typography>
          <IconButton onClick={closeModal} size="small" className="text-slate-400 hover:text-slate-700">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="px-6 py-6">
          {selectedUser && (
            <Box className="space-y-5">
              <Box className="flex flex-col items-center gap-3">
                <Avatar className="!h-16 !w-16 !bg-blue-100 !text-blue-700">
                  <Person />
                </Avatar>
                <Box className="text-center">
                  <Typography variant="h6" className="!font-bold !text-slate-900">
                    {selectedUser.name}
                  </Typography>
                  <Chip
                    label={selectedUser.role}
                    color={ROLE_COLORS[selectedUser.role] || 'default'}
                    size="small"
                    className="!mt-1 !font-semibold"
                  />
                </Box>
              </Box>

              <Box className="rounded-xl bg-slate-50 p-4 space-y-3">
                <Box className="flex justify-between">
                  <Typography variant="caption" className="!font-semibold !text-slate-500 uppercase tracking-wide">
                    Email
                  </Typography>
                  <Typography variant="body2" className="!text-slate-800">
                    {selectedUser.email}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="caption" className="!font-semibold !text-slate-500 uppercase tracking-wide">
                    Role
                  </Typography>
                  <Typography variant="body2" className="!text-slate-800">
                    {selectedUser.role}
                  </Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="caption" className="!font-semibold !text-slate-500 uppercase tracking-wide">
                    User ID
                  </Typography>
                  <Typography variant="body2" className="!font-mono !text-xs !text-slate-500">
                    {selectedUser.id}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                onClick={closeModal}
                variant="contained"
                className="!rounded-xl !bg-blue-600 !normal-case"
              >
                Close
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { className: 'rounded-2xl' } }}
      >
        <DialogTitle className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <Typography variant="h6" className="!font-bold !text-slate-900">
            Delete User
          </Typography>
          <IconButton onClick={() => setDeleteConfirmOpen(false)} size="small" className="text-slate-400">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="px-6 py-5">
          <Typography className="!mb-5 !text-slate-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-900">{userToDelete?.name}</span>?
            This action cannot be undone.
          </Typography>
          <Box className="flex justify-end gap-3">
            <Button onClick={() => setDeleteConfirmOpen(false)} className="!normal-case !text-slate-600">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              className="!rounded-xl !bg-red-600 !normal-case hover:!bg-red-700"
            >
              Yes, Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={toastSeverity} className="!rounded-xl !shadow-lg">
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
