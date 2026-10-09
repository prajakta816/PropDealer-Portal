import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './component/public/PublicLayout'
import HomePage from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { PublicOnlyRoute } from './app/guards/PublicOnlyRoute'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
