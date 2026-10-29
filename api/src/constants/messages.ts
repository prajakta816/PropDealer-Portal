export const MESSAGES = {
  SUCCESS: {
    SERVER_RUNNING: 'Server running successfully',
    USER_CREATED: 'User created successfully',
  },

  ERROR: {
    AUTHENTICATION_TOKEN_REQUIRED: 'Authentication token is required',
    INVALID_AUTHENTICATION_TOKEN: 'Invalid authentication token',
    AUTHENTICATION_REQUIRED: 'Authentication required.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
  },
} as const;