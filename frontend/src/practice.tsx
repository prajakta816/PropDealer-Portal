
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Buyer</DialogTitle>

      <DialogContent>
        {errorMessage && (
          <Alert severity="error" className="mb-4">
            {errorMessage}
          </Alert>
        )}

        <Box
          component="form"
          id="create-buyer-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 pt-2"
        >
          <TextField
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="create-buyer-form"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Buyer...' : 'Create Buyer'}
        </Button>
      </DialogActions>
    </Dialog>
  )
