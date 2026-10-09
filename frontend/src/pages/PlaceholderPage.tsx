import { Box, Button, Card, Container, Typography } from '@mui/material'
import { ArrowBack, Construction } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Box className="flex-1 bg-slate-50 p-6 md:p-8">
      <Container maxWidth="lg" disableGutters>
        <Card elevation={0} className="rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-14">
          <Box className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Construction fontSize="large" />
          </Box>
          <Typography variant="h4" component="h1" className="!font-extrabold !text-slate-900">
            {title}
          </Typography>
          <Typography variant="body1" className="!mx-auto !mt-3 !max-w-md !text-slate-500">
            {description || 'This module is scheduled for implementation in the next phase.'}
          </Typography>
          <Box className="mt-8 flex justify-center">
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              startIcon={<ArrowBack />}
              className="!rounded-xl !bg-blue-600 !px-6 !py-2.5 !normal-case !shadow-md !shadow-blue-600/20"
            >
              Return to Dashboard
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
