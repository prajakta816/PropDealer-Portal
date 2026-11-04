export const MESSAGES = {
  SUCCESS: {
    SERVER_RUNNING: 'Server running successfully',
    USER_CREATED: 'User created successfully',
    BUYER_CREATED: 'Buyer created successfully',
    USERS_RETRIEVED: 'Users retrieved successfully',
    LOGIN_SUCCESS: 'Login successful',

    MASTER_DATA_CREATED: 'Master data created successfully',
    MASTER_DATA_UPDATED: 'Master data updated successfully',
    MASTER_DATA_RETRIEVED: 'Master data retrieved successfully',

    BUYER_UPDATED: 'Buyer updated successfully',
    BUYER_DELETED: 'Buyer deleted successfully',
    BUYER_RETRIEVED: 'Buyer retrieved successfully',
    BUYERS_RETRIEVED: 'Buyers retrieved successfully',
  },

  ERROR: {
    AUTHENTICATION_TOKEN_REQUIRED: 'Authentication token is required',
    INVALID_AUTHENTICATION_TOKEN: 'Invalid authentication token',
    AUTHENTICATION_REQUIRED: 'Authentication required.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired authentication token.',
    NOT_AUTHENTICATED: 'Not authenticated',
    USER_NOT_FOUND: 'User associated with this token was not found.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    AUTH_CONFIG_ERROR: 'Authentication is not configured correctly.',

    EMAIL_ALREADY_EXISTS: 'A record with this email already exists.',
    VALIDATION_FAILED: 'Validation failed',

    MASTER_DATA_NOT_FOUND: 'Master data record not found.',
    MASTER_DATA_ALREADY_EXISTS: 'A master data record with this category and value already exists.',

    BUYER_NOT_FOUND: 'Buyer not found.',
    BUYER_ALREADY_EXISTS: 'A buyer with this email already exists.',
  },
} as const;