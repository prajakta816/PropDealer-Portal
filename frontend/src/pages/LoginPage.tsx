import { useState, type FormEvent } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import {
  Apartment,
  ArrowBack,
  EmailOutlined,
  KeyOutlined,
  ShieldOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useAuth } from '../context'

interface LocationState {
  from?: {
    pathname: string
  }
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState(false)

  const validateEmail = (value: string): boolean => {
    const trimmed = value.trim()
    if (!trimmed) {
      setEmailError('Email address is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(null)
    return true
  }

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password is required')
      return false
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    setPasswordError(null)
    return true
  }

  const handleEmailChange = (val: string) => {
    setEmail(val)
    if (emailError) validateEmail(val)
    if (errorMessage) setErrorMessage(null)
  }

  const handlePasswordChange = (val: string) => {
    setPassword(val)
    if (passwordError) validatePassword(val)
    if (errorMessage) setErrorMessage(null)
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    try {
      const result = await login(email, password)
      if (result.success) {
        setSuccessToast(true)
        await new Promise((resolve) => setTimeout(resolve, 800))
        const state = location.state as LocationState | null
        const destination = state?.from?.pathname || '/dashboard'
        navigate(destination, { replace: true })
      } else {
        setErrorMessage(result.message || 'Authentication failed. Please verify your details.')
      }
    } catch {
      setErrorMessage('An unexpected error occurred while connecting. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Box className="flex min-h-[calc(100vh-69px)] w-full flex-col bg-slate-50 md:flex-row">
        <Box className="relative hidden w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 p-12 text-white md:flex md:w-5/12 lg:w-1/2">
          <Box
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
          />
          <Box
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
          />

          <Box className="relative z-10 flex items-center gap-3">
            <Box className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Apartment fontSize="medium" />
            </Box>
            <Typography variant="h5" className="!font-extrabold tracking-tight">
              PropDealer
            </Typography>
          </Box>

          <Box className="relative z-10 max-w-lg space-y-6">
            <Box className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur-md">
              <ShieldOutlined fontSize="small" /> Secure Role-Based Access
            </Box>
            <Typography
              variant="h3"
              className="!text-3xl !font-bold !leading-tight tracking-tight lg:!text-4xl"
            >
              Welcome back to your workspace.
            </Typography>
            <Typography className="!text-base !leading-relaxed !text-slate-300">
              Sign in to access property records, track commission disbursements, and manage your team operations with zero friction.
            </Typography>

            <Box className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <Typography variant="subtitle2" className="!font-semibold !text-blue-200">
                Configured Roles
              </Typography>
              <Typography variant="body2" className="!mt-1 !text-slate-300">
                Admin, Real Estate Agents, and Commission Managers are routed automatically to their designated views.
              </Typography>
            </Box>
          </Box>

          <Box className="relative z-10">
            <Typography variant="caption" className="text-slate-400">
              PropDealer Portal © {new Date().getFullYear()} — Secure Operations System
            </Typography>
          </Box>
        </Box>

        <Box className="flex flex-1 items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16">
          <Box className="w-full max-w-md space-y-8">
            <Box>
              <Button
                component={RouterLink}
                to="/"
                startIcon={<ArrowBack />}
                className="!normal-case !text-slate-600 hover:!text-blue-700"
                size="small"
              >
                Back to Home
              </Button>
            </Box>

            <Box>
              <Typography
                variant="h4"
                component="h1"
                className="!text-2xl !font-bold tracking-tight text-slate-900 sm:!text-3xl"
              >
                Sign in to PropDealer
              </Typography>
              <Typography variant="body2" className="!mt-2 !text-slate-500">
                Enter your corporate credentials to access your dashboard.
              </Typography>
            </Box>

            {errorMessage && (
              <Alert
                severity="error"
                className="!rounded-xl !border !border-rose-200 !bg-rose-50 !text-rose-900"
              >
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate className="space-y-5">
              <Box>
                <Typography
                  component="label"
                  htmlFor="user-email"
                  className="!mb-1.5 !block !text-sm !font-semibold !text-slate-700"
                >
                  Email Address
                </Typography>
                <TextField
                  id="user-email"
                  type="email"
                  fullWidth
                  placeholder="name@propdealer.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  error={Boolean(emailError)}
                  helperText={emailError}
                  autoComplete="email"
                  autoFocus
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined className="text-slate-400" fontSize="small" />
                        </InputAdornment>
                      ),
                      className: 'rounded-xl bg-white',
                    },
                  }}
                />
              </Box>

              <Box>
                <Box className="mb-1.5 flex items-center justify-between">
                  <Typography
                    component="label"
                    htmlFor="user-password"
                    className="!text-sm !font-semibold !text-slate-700"
                  >
                    Password
                  </Typography>
                </Box>
                <TextField
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  error={Boolean(passwordError)}
                  helperText={passwordError}
                  autoComplete="current-password"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyOutlined className="text-slate-400" fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            size="small"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="small" className="text-slate-500" />
                            ) : (
                              <Visibility fontSize="small" className="text-slate-500" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                      className: 'rounded-xl bg-white',
                    },
                  }}
                />
              </Box>

              <Box className="!mt-4 flex items-center gap-3">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  className="!rounded-xl !bg-blue-600 !py-3 !text-base !font-semibold !normal-case !shadow-md !shadow-blue-600/30 hover:!bg-blue-700"
                >
                  Sign In
                </Button>
                {isSubmitting && (
                  <CircularProgress size={28} thickness={4} className="!text-blue-600" />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={successToast}
        autoHideDuration={2000}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="success" className="!rounded-xl !shadow-lg">
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </>
  )
}
