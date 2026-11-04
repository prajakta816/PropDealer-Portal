import { useState, useEffect, type FormEvent } from 'react'

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'

import { Close } from '@mui/icons-material'

import {
    MASTER_DATA_CATEGORY_OPTIONS,
    type MasterDataCategory,
} from '../../constants/masterData'

import {
    createMasterDataApi,
    updateMasterDataApi,
    type MasterDataItem,
} from '../../api/masterDataApi'

export type DialogMode = 'create' | 'edit' | 'view'

interface MasterDataDialogProps {
    open: boolean
    mode: DialogMode
    item: MasterDataItem | null
    onClose: () => void
    onSuccess: (item: MasterDataItem) => void
}

export function MasterDataDialog({
    open,
    mode,
    item,
    onClose,
    onSuccess,
}: MasterDataDialogProps) {
    const [category, setCategory] = useState<MasterDataCategory>(
        MASTER_DATA_CATEGORY_OPTIONS[0].value,
    )
    const [value, setValue] = useState('')

    const [valueError, setValueError] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isViewMode = mode === 'view'

    useEffect(() => {
        if (!open) return

        if ((mode === 'edit' || mode === 'view') && item) {
            setCategory(item.category)
            setValue(item.value)
        } else {
            setCategory(MASTER_DATA_CATEGORY_OPTIONS[0].value)
            setValue('')
        }

        setValueError(null)
        setErrorMessage(null)
    }, [open, mode, item])

    const handleClose = () => {
        if (isSubmitting) return
        onClose()
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isViewMode) {
            onClose()
            return
        }

        setValueError(null)
        setErrorMessage(null)

        if (!value.trim()) {
            setValueError('Value is required.')
            return
        }

        if (mode === 'edit' && !item) {
            setErrorMessage('No record selected to update.')
            return
        }

        setIsSubmitting(true)

        try {
            if (mode === 'create') {
                const created = await createMasterDataApi({
                    category,
                    value: value.trim(),
                })
                onSuccess(created)
            } else if (mode === 'edit' && item) {
                const updated = await updateMasterDataApi(item.id, {
                    category,
                    value: value.trim(),
                })
                onSuccess(updated)
            }
            onClose()
        } catch (error: unknown) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const getTitle = () => {
        if (mode === 'create') return 'Add Master Data'
        if (mode === 'edit') return 'Edit Master Data'
        return 'View Master Data'
    }

    const getSubtitle = () => {
        if (mode === 'create') return 'Add a new lookup value for the selected category.'
        if (mode === 'edit') return 'Update the category or value of this entry.'
        return 'Details of this master data entry.'
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <Box>
                    <Typography variant="h6" className="!font-bold !text-slate-900">
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

                <Box
                    component="form"
                    id="master-data-form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4 pt-2"
                >
                    <Box>
                        <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                            Category {!isViewMode && <span className="text-rose-500">*</span>}
                        </Typography>

                        <FormControl fullWidth size="small">
                            <InputLabel id="master-data-category-label">
                                Category
                            </InputLabel>

                            <Select
                                labelId="master-data-category-label"
                                value={category}
                                label="Category"
                                onChange={(e) =>
                                    setCategory(e.target.value as MasterDataCategory)
                                }
                                disabled={isSubmitting || isViewMode}
                            >
                                {MASTER_DATA_CATEGORY_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box>
                        <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                            Value {!isViewMode && <span className="text-rose-500">*</span>}
                        </Typography>

                        <TextField
                            fullWidth
                            size="small"
                            placeholder="e.g. Pune, Apartment, Semi Furnished"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value)

                                if (valueError) setValueError(null)
                                if (errorMessage) setErrorMessage(null)
                            }}
                            error={Boolean(valueError)}
                            helperText={valueError}
                            disabled={isSubmitting || isViewMode}
                            slotProps={{
                                htmlInput: { maxLength: 100 },
                                input: { className: 'rounded-xl' },
                            }}
                        />
                    </Box>

                    {isViewMode && item && (
                        <Box className="mt-4 rounded-xl bg-slate-50 p-4 space-y-2 border border-slate-200">
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
                            form="master-data-form"
                            variant="contained"
                            disabled={isSubmitting}
                            startIcon={
                                isSubmitting ? (
                                    <CircularProgress size={16} color="inherit" />
                                ) : undefined
                            }
                            sx={{
                                px: 3,
                                borderRadius: 2,
                                fontWeight: 700,
                                textTransform: 'none',
                            }}
                        >
                            {isSubmitting
                                ? mode === 'create' ? 'Adding...' : 'Saving...'
                                : mode === 'create' ? 'Add Entry' : 'Save Changes'}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    )
}
