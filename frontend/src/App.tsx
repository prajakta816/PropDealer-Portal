import { Route, Routes } from 'react-router-dom'
import PublicLayout from './component/public/PublicLayout'
import HomePage from './pages/HomePage'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App
