import { Box, Typography } from '@mui/material'

function Footer() {
  return (
    <Box
      component="footer"
      className="flex items-center justify-center border-t bg-white px-4 py-3"
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} PropDealer Portal
      </Typography>
    </Box>
  )
}

export default Footer