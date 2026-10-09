import { Typography } from '@mui/material'

import AppLayout from './component/layout/AppLayout'

function App() {
  return (
    <AppLayout>
      <div className="flex flex-1 flex-col p-6">
        <Typography variant="h4" component="h2">
          Dashboard
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-2"
        >
          Welcome to PropDealer Portal.
        </Typography>
      </div>
    </AppLayout>
  )
}

export default App
