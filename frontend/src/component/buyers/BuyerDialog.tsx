import { useState, useEffect, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Close, DeleteOutlined, WarningAmber } from '@mui/icons-material';

import {
  BUYER_DIALOG_MODES,
  BUYER_MESSAGES,
  type BuyerDialogMode,
} from '../../constants/buyers';
import {
  createBuyerApi,
  updateBuyerApi,
  deleteBuyerApi,
  type BuyerItem,
} from '../../api/buyersApi';
import { validateName, validateEmail } from '../../utils/validation';

interface BuyerDialogProps {
  open: boolean;
  mode: BuyerDialogMode | null;
  item: BuyerItem | null;
  onClose: () => void;
  onSuccess: (item?: BuyerItem) => void;
}

export function BuyerDialog({
  open,
  mode,
  item,
  onClose,
  onSuccess,
}: BuyerDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isViewMode = mode === BUYER_DIALOG_MODES.VIEW;
  const isDeleteMode = mode === BUYER_DIALOG_MODES.DELETE;

  useEffect(() => {
    if (!open) return;

    if (
      (mode === BUYER_DIALOG_MODES.EDIT ||
        mode === BUYER_DIALOG_MODES.VIEW ||
        mode === BUYER_DIALOG_MODES.DELETE) &&
      item
    ) {
      setName(item.name);
      setEmail(item.email);
    } else {
      setName('');
      setEmail('');
    }

    setNameError(null);
    setEmailError(null);
    setErrorMessage(null);
  }, [open, mode, item]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isViewMode) {
      onClose();
      return;
    }

    setNameError(null);
    setEmailError(null);
    setErrorMessage(null);

    if (isDeleteMode && item) {
      setIsSubmitting(true);
      try {
        await deleteBuyerApi(item.id);
        onSuccess(item);
        onClose();
      } catch (error: unknown) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to delete buyer.',
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const nameValidationError = validateName(name);
    const emailValidationError = validateEmail(email);

    if (nameValidationError || emailValidationError) {
      setNameError(nameValidationError);
      setEmailError(emailValidationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === BUYER_DIALOG_MODES.CREATE) {
        const created = await createBuyerApi({
          name: name.trim(),
          email: email.trim().toLowerCase(),
        });
        onSuccess(created);
      } else if (mode === BUYER_DIALOG_MODES.EDIT && item) {
        const updated = await updateBuyerApi(item.id, {
          name: name.trim(),
          email: email.trim().toLowerCase(),
        });
        onSuccess(updated);
      }
      onClose();
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    if (mode === BUYER_DIALOG_MODES.CREATE) return 'Add New Buyer';
    if (mode === BUYER_DIALOG_MODES.EDIT) return 'Edit Buyer';
    if (mode === BUYER_DIALOG_MODES.VIEW) return 'Buyer Details';
    return BUYER_MESSAGES.DELETE_CONFIRM_TITLE;
  };

  const getSubtitle = () => {
    if (mode === BUYER_DIALOG_MODES.CREATE) return 'Register a new property buyer lead.';
    if (mode === BUYER_DIALOG_MODES.EDIT) return 'Update contact details for this buyer.';
    if (mode === BUYER_DIALOG_MODES.VIEW) return 'Profile information and audit history.';
    return BUYER_MESSAGES.DELETE_CONFIRM_WARNING;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <Box>
          <Typography
            variant="h6"
            className={`!font-bold ${isDeleteMode ? '!text-rose-600' : '!text-slate-900'}`}
          >
            {getTitle()}
          </Typography>
          <Typography variant="caption" className="!text-slate-500">
            {getSubtitle()}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="px-6 py-5">
        {errorMessage && (
          <Alert severity="error" className="!mb-4 !rounded-xl">
            {errorMessage}
          </Alert>
        )}

        {isDeleteMode && item ? (
          <Box
            component="form"
            id="buyer-dialog-form"
            onSubmit={handleSubmit}
            className="pt-2"
          >
            <Box className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <WarningAmber className="text-rose-600" />
              <Box>
                <Typography variant="subtitle2" className="!font-bold !text-rose-900">
                  Delete {item.name}?
                </Typography>
                <Typography variant="body2" className="!mt-1 !text-rose-700">
                  Email: <strong>{item.email}</strong>
                </Typography>
                <Typography variant="caption" className="!mt-2 !block !text-rose-600">
                  This record will be permanently removed from the system.
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
         <Box
            component="form"
            id="buyer-dialog-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4 pt-2"
          >
            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                Full Name {!isViewMode && <span className="text-rose-500">*</span>}
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. name surname"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                  if (errorMessage) setErrorMessage(null);
                }}
                error={Boolean(nameError)}
                helperText={nameError}
                disabled={isSubmitting || isViewMode}
                slotProps={{
                  input: { className: 'rounded-xl' },
                }}
              />
            </Box>

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                Email Address {!isViewMode && <span className="text-rose-500">*</span>}
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                placeholder="name@google.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                  if (errorMessage) setErrorMessage(null);
                }}
                error={Boolean(emailError)}
                helperText={emailError}
                disabled={isSubmitting || isViewMode}
                slotProps={{
                  input: { className: 'rounded-xl' },
                }}
              />
            </Box>

            {isViewMode && item && (
              <Box className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <Box className="flex justify-between">
                  <Typography variant="caption" className="!font-semibold !text-slate-500 uppercase">
                    Created By
                  </Typography>
                  <Typography variant="body2" className="!text-slate-800">
                    {item.createdBy?.name ?? '—'}
                  </Typography>
                </Box>

                <Box className="flex justify-between">
                  <Typography variant="caption" className="!font-semibold !text-slate-500 uppercase">
                    Created Date
                  </Typography>
                  <Typography variant="body2" className="!text-slate-800">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>

                <Box className="flex justify-between">
                  <Typography variant="caption" className="!font-semibold !text-slate-500 uppercase">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" className="!text-slate-800">
                    {new Date(item.updatedAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {isViewMode ? (
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{ px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Close
          </Button>
        ) : isDeleteMode ? (
          <>
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="buyer-dialog-form"
              variant="contained"
              color="error"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <DeleteOutline />
                )
              }
              sx={{ px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Buyer'}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="buyer-dialog-form"
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
              sx={{ px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              {isSubmitting
                ? mode === BUYER_DIALOG_MODES.CREATE
                  ? 'Adding...'
                  : 'Saving...'
                : mode === BUYER_DIALOG_MODES.CREATE
                  ? 'Add Buyer'
                  : 'Save Changes'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

