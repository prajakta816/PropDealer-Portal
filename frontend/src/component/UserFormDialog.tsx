
import { useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

import {
  USERS_STORAGE_KEY,
  hashPassword,
  type StoredUser,
  type User,
} from '../context/authConstants'

import { ROLES } from '../constants/roles'

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  onUserCreated: (user: User) => void
}

export default function UserFormDialog({ open, onClose, onUserCreated, }: UserFormDialogProps)
 {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setName('')
    setEmail('')
    // setPassword('')
    // setConfirmPassword('')
    setErrorMessage('')
  }

  const handleClose = () => {
    if (isSubmitting) return

    resetForm()
    onClose()
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setErrorMessage('')

    const trimmedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    //  !password || !confirmPassword checks were here.
    // if (!trimmedName || !normalizedEmail || !password || !confirmPassword) {
    if (!trimmedName || !normalizedEmail) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    // if (password.length < 6) {
    //   setErrorMessage('Password must contain at least 6 characters.')
    //   return
    // }
    // if (password !== confirmPassword) {
    //   setErrorMessage('Passwords do not match.')
    //   return
    // }

    setIsSubmitting(true)

    try {
      // Read every registered user, regardless of role.
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY)
      const storedUsers: StoredUser[] = rawUsers
        ? JSON.parse(rawUsers)
        : []

      if (!Array.isArray(storedUsers)) {
        setErrorMessage('Unable to read registered users. Please try again.')
        return
      }

      // Prevent duplicate emails across Admin, Agent, Buyer and other roles.
      const emailExists = storedUsers.some(
        (storedUser) =>
          typeof storedUser.email === 'string' &&
          storedUser.email.trim().toLowerCase() === normalizedEmail,
      )

      if (emailExists) {
        setErrorMessage(
          'This email is already registered. Select the existing Buyer if they have the Buyer role.',
        )
        return
      }

      // Auto-generate a placeholder hash from the email (no password set by agent).
      const passwordHash = await hashPassword(normalizedEmail + '_buyer_placeholder')

      const newUser: StoredUser = {
        id: `usr_${Date.now()}`,
        name: trimmedName,
        email: normalizedEmail,
        role: ROLES.BUYER,
        passwordHash,
        createdAt: new Date().toISOString(),
      }

      // Persist the Buyer using the shared storage key.
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([...storedUsers, newUser]),
      )

      // Do not expose the password hash to the parent component.
      const createdUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      }

      // Update the parent dropdown and select the new Buyer.
      onUserCreated(createdUser)

      resetForm()
      onClose()
    } catch (error) {
      console.error('Failed to create Buyer:', error)
      setErrorMessage(
        'Unable to create the Buyer. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        Add New Buyer
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: '#eff6ff',
            border: '1px solid #dbeafe',
          }}
        >
          <Box
            component="p"
            sx={{
              m: 0,
              fontWeight: 700,
              color: '#1e40af',
            }}
          >
            Register a Buyer
          </Box>

          <Box
            component="p"
            sx={{
              mt: 0.5,
              mb: 0,
              fontSize: 14,
              color: '#475569',
            }}
          >
            Enter the Buyer's details. If the email is already registered,
            select the existing Buyer instead.
          </Box>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box
          component="form"
          id="create-buyer-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 pt-1"
        >
          <TextField
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
            fullWidth
            disabled={isSubmitting}
          />

          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            fullWidth
            disabled={isSubmitting}
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="create-buyer-form"
          variant="contained"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <></>
            )
          }
          sx={{
            px: 3,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
          }}
        >
          {isSubmitting ? 'Creating Buyer...' : 'Create Buyer'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
