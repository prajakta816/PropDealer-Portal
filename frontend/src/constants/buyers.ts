export const BUYER_DIALOG_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
  DELETE: 'delete',
} as const;

export type BuyerDialogMode =
  (typeof BUYER_DIALOG_MODES)[keyof typeof BUYER_DIALOG_MODES];

export const BUYER_TABLE_PAGE_SIZE_OPTIONS = [5, 10, 25] as const;
export const BUYER_DEFAULT_PAGE_SIZE = 10;

export const BUYER_MESSAGES = {
  ADD_BUTTON: 'Add Buyer',
  TITLE: 'Buyer Management',
  SUBTITLE: 'Directory of prospective property buyers and active leads.',
  SEARCH_PLACEHOLDER: 'Search buyers by name or email...',
  EMPTY_TABLE: 'No buyers registered yet. Use Add Buyer to register one.',
  DELETE_CONFIRM_TITLE: 'Delete Buyer',
  DELETE_CONFIRM_WARNING: 'Are you sure you want to delete this buyer? This action cannot be undone.',
  SUCCESS_CREATED: (name: string) => `Buyer "${name}" created successfully.`,
  SUCCESS_UPDATED: (name: string) => `Buyer "${name}" updated successfully.`,
  SUCCESS_DELETED: (name: string) => `Buyer "${name}" deleted successfully.`,
} as const;