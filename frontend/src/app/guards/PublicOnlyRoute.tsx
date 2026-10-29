import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context'

interface PublicOnlyRouteProps {
  children?: ReactNode
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Checking session...</div>
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
