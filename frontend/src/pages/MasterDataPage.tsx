import { useState, useEffect } from 'react'

import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    FormControl,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'

import {
    Add,
    EditOutlined,
    RestartAlt,
    Search,
} from '@mui/icons-material'

import {
    DataGrid,
    type GridColDef,
    type GridRenderCellParams,
} from '@mui/x-data-grid'

import {
    MASTER_DATA_CATEGORY_OPTIONS,
    ALL_CATEGORIES_FILTER,
    type MasterDataCategory,
} from '../constants/masterData'

import {
    getAllMasterDataApi,
    type MasterDataItem,
} from '../api/masterDataApi'

import { MasterDataDialog } from '../component/masterData/MasterDataDialog'

const CATEGORY_COLORS: Record<
    MasterDataCategory,
    'primary' | 'success' | 'warning' | 'secondary'
> = {
    City: 'primary',
    PropertyType: 'success',
    FurnishingStatus: 'warning',
    DealLossReason: 'secondary',
}

export function MasterDataPage() {
    const [masterData, setMasterData] = useState<MasterDataItem[]>([])

    const [isLoading, setIsLoading] = useState(true)

    const [searchQuery, setSearchQuery] = useState('')

    const [categoryFilter, setCategoryFilter] = useState<
        MasterDataCategory | typeof ALL_CATEGORIES_FILTER
    >(ALL_CATEGORIES_FILTER)

    const [dialogMode, setDialogMode] = useState<
        'create' | 'edit' | null
    >(null)

    const [selectedItem, setSelectedItem] = useState<MasterDataItem | null>(null)

    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')

    useEffect(() => {
        let isMounted = true

        const fetchMasterData = async () => {
            setIsLoading(true)

            try {
                const data = await getAllMasterDataApi()

                if (isMounted) {
                    setMasterData(data)
                }
            } catch (error: unknown) {
                if (isMounted) {
                    setToastSeverity('error')

                    setToastMessage(
                        error instanceof Error
                            ? error.message
                            : 'Failed to load master data.',
                    )
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        void fetchMasterData()

        return () => {
            isMounted = false
        }
    }, [])

    const query = searchQuery.trim().toLowerCase()
    const filteredData = masterData.filter((item) => {
        const matchesCategory =
            categoryFilter === ALL_CATEGORIES_FILTER ||
            item.category === categoryFilter

        const matchesSearch =
            !query || item.value.toLowerCase().includes(query)

        return matchesCategory && matchesSearch
    })

    const openCreate = () => {
        setSelectedItem(null)
        setDialogMode('create')
    }

    const openEdit = (item: MasterDataItem) => {
        setSelectedItem(item)
        setDialogMode('edit')
    }

    const closeDialog = () => {
        setDialogMode(null)
        setSelectedItem(null)
    }

    const handleSuccess = (savedItem: MasterDataItem) => {
        if (dialogMode === 'create') {
            setMasterData((previousData) => [
                savedItem,
                ...previousData,
            ])

            setToastMessage(`"${savedItem.value}" added successfully.`)
        } else {
            setMasterData((previousData) =>
                previousData.map((item) =>
                    item.id === savedItem.id ? savedItem : item
                )
            )

            setToastMessage(`"${savedItem.value}" updated successfully.`)
        }

        setToastSeverity('success')
    }

    const handleClearFilters = () => {
        setSearchQuery('')
        setCategoryFilter(ALL_CATEGORIES_FILTER)
    }

    const columns: GridColDef<MasterDataItem>[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
            renderCell: (params: GridRenderCellParams<MasterDataItem>) => (
                <Tooltip title="Edit">
                    <IconButton
                        size="small"
                        onClick={() => openEdit(params.row)}
                        sx={{ color: 'primary.main' }}
                    >
                        <EditOutlined fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
        {
            field: 'category',
            headerName: 'Category',
            flex: 1,
            minWidth: 160,
            renderCell: (params: GridRenderCellParams<MasterDataItem>) => (
                <Chip
                    label={params.row.category}
                    color={CATEGORY_COLORS[params.row.category]}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
            ),
        },
        {
            field: 'value',
            headerName: 'Value',
            flex: 2,
            minWidth: 200,
        },
        {
            field: 'createdBy',
            headerName: 'Created By',
            flex: 1,
            minWidth: 140,
            sortable: false,
            renderCell: (params: GridRenderCellParams<MasterDataItem>) => (
                <Typography variant="body2" className="!text-slate-600">
                    {params.row.createdBy?.name ?? '—'}
                </Typography>
            ),
        },
        {
            field: 'updatedAt',
            headerName: 'Last Updated',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams<MasterDataItem>) => (
                <Typography variant="body2" className="!text-slate-500">
                    {new Date(params.row.updatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </Typography>
            ),
        },
    ]


    return (
        <Box className="flex-1 bg-slate-50 p-6 md:p-8">
            <Container maxWidth="xl" disableGutters>

                <Box className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            className="!font-bold !text-slate-900"
                        >
                            Master Data
                        </Typography>

                        <Typography
                            variant="body1"
                            className="!mt-1 !text-slate-500"
                        >
                            Manage lookup values used across the application.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={openCreate}
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Add Entry
                    </Button>
                </Box>

                <Box
                    className="mb-6 rounded-xl border border-slate-200 bg-white p-4"
                    sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                    <Box className="flex flex-wrap gap-3">

                        <TextField
                            size="small"
                            placeholder="Search by value..."
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            className="min-w-[220px] flex-1"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search className="text-slate-400" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl size="small" className="min-w-[200px]">
                            <Select
                                value={categoryFilter}
                                onChange={(event) =>
                                    setCategoryFilter(
                                        event.target.value as
                                        | MasterDataCategory
                                        | typeof ALL_CATEGORIES_FILTER
                                    )
                                }
                                displayEmpty
                            >
                                <MenuItem value={ALL_CATEGORIES_FILTER}>
                                    All Categories
                                </MenuItem>

                                {MASTER_DATA_CATEGORY_OPTIONS.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<RestartAlt />}
                            onClick={handleClearFilters}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                </Box>

                <Box
                    className="rounded-xl border border-slate-200 bg-white p-2"
                    sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                    <DataGrid
                        rows={filteredData}
                        columns={columns}
                        loading={isLoading}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        autoHeight
                        disableRowSelectionOnClick
                        rowHeight={64}
                    />
                </Box>

            </Container>

            <MasterDataDialog
                open={dialogMode !== null}
                mode={dialogMode ?? 'create'}
                item={selectedItem}
                onClose={closeDialog}
                onSuccess={handleSuccess}
            />

            <Snackbar
                open={toastMessage !== null}
                autoHideDuration={4000}
                onClose={() => setToastMessage(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    severity={toastSeverity}
                    onClose={() => setToastMessage(null)}
                    sx={{ borderRadius: 2 }}
                >
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    )

}
