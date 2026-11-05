export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Full name is required.',
  NAME_MIN_LENGTH: (min: number) => `Name must contain at least ${min} characters.`,
  EMAIL_REQUIRED: 'Email address is required.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  REQUIRED_FIELD: (field: string) => `${field} is required.`,
} as const;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validateName(name: string, minLength = 2): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return VALIDATION_MESSAGES.NAME_REQUIRED;
  }
  if (trimmed.length < minLength) {
    return VALIDATION_MESSAGES.NAME_MIN_LENGTH(minLength);
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return VALIDATION_MESSAGES.EMAIL_REQUIRED;
  }
  if (!isValidEmail(trimmed)) {
    return VALIDATION_MESSAGES.EMAIL_INVALID;
  }
  return null;
}

