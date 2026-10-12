import { useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Add,
  ArrowBack,
  Close,
  CurrencyRupee,
  EditOutlined,
  FilterList,
  HomeWorkOutlined,
  LocationOnOutlined,
  RestartAlt,
  Search,
  VisibilityOutlined,
} from '@mui/icons-material'
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context'
import { ROLES } from '../constants/roles'
import {
  PROPERTIES_STORAGE_KEY,
  PROPERTY_STATUS_CONFIG,
  type Property,
  type PropertyStatus,
} from '../constants/properties'

type ModalMode = 'create' | 'edit' | 'view' | null

// Fields the user can sort by.
type SortField = 'title' | 'address' | 'basePrice' | 'status'

// Direction in which the selected field will be sorted.
type SortDirection = 'asc' | 'desc'

function loadProperties(): Property[] {
  const rawData = localStorage.getItem(PROPERTIES_STORAGE_KEY)

  if (rawData) {
    try {
      return JSON.parse(rawData) as Property[]
    } catch {
      return []
    }
  }

  return []
}

export function PropertyListPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN

  const [properties, setProperties] = useState<Property[]>(loadProperties)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Sorting state.
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // STEP 1: Filter properties by search query (title/address) and status filter
  const query = searchQuery.trim().toLowerCase()

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      !query ||
      property.title.toLowerCase().includes(query) ||
      property.address.toLowerCase().includes(query)

    const matchesStatus =
      statusFilter === 'all' || property.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // STEP 2: Sort a copy of the filtered results.
  // We copy the array so the original properties state is not mutated.
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    let result = 0

    switch (sortField) {
      case 'title':
        result = a.title.localeCompare(b.title)
        break

      case 'address':
        result = a.address.localeCompare(b.address)
        break

      case 'basePrice':
        result = a.basePrice - b.basePrice
        break

      case 'status':
        result = a.status.localeCompare(b.status)
        break
    }

    return sortDirection === 'asc' ? result : -result
  })

  // Reset filters and sorting to defaults
  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSortField('title')
    setSortDirection('asc')
  }

  const resetForm = () => {
    setTitle('')
    setAddress('')
    setBasePrice('')
    setErrorMessage(null)
  }

  const openCreate = () => {
    resetForm()
    setSelectedProperty(null)
    setModalMode('create')
  }

  const openEdit = (property: Property) => {
    setSelectedProperty(property)
    setTitle(property.title)
    setAddress(property.address)
    setBasePrice(property.basePrice.toString())
    setErrorMessage(null)
    setModalMode('edit')
  }

  const openView = (property: Property) => {
    setSelectedProperty(property)
    setTitle(property.title)
    setAddress(property.address)
    setBasePrice(property.basePrice.toString())
    setErrorMessage(null)
    setModalMode('view')
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedProperty(null)
    resetForm()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!title.trim()) {
      setErrorMessage('Property title is required.')
      return
    }

    if (!address.trim()) {
      setErrorMessage('Property address is required.')
      return
    }

    const parsedPrice = Number(basePrice)

    if (!basePrice || isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage('Please enter a valid positive base price.')
      return
    }

    const rawData = localStorage.getItem(PROPERTIES_STORAGE_KEY)
    const existing: Property[] = rawData ? JSON.parse(rawData) : []

    if (modalMode === 'create') {
      const newProperty: Property = {
        id: `prop_${Date.now()}`,
        title: title.trim(),
        address: address.trim(),
        basePrice: parsedPrice,
        status: 'available',
        createdAt: new Date().toISOString(),
      }

      const updated = [newProperty, ...existing]

      localStorage.setItem(
        PROPERTIES_STORAGE_KEY,
        JSON.stringify(updated),
      )

      setProperties(updated)
      setToastMessage(
        'Property created successfully with Available status.',
      )
      closeModal()
      return
    }

    if (modalMode === 'edit' && selectedProperty) {
      const updated = existing.map((property) => {
        if (property.id !== selectedProperty.id) {
          return property
        }

        return {
          ...property,
          title: title.trim(),
          address: address.trim(),
          basePrice: parsedPrice,
        }
      })

      localStorage.setItem(
        PROPERTIES_STORAGE_KEY,
        JSON.stringify(updated),
      )

      setProperties(updated)
      setToastMessage('Property updated successfully.')
      closeModal()
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.2,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box className="flex items-center gap-2 py-2">
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: '#0f172a' }}
          >
            {params.row.title}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          sx={{ color: '#475569', fontSize: '0.85rem' }}
        >
          {params.row.address}
        </Typography>
      ),
    },
    {
      field: 'basePrice',
      headerName: 'Base Price',
      width: 170,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: '#0f172a' }}
        >
          ₹ {Number(params.row.basePrice).toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params: GridRenderCellParams) => {
        const currentStatus = params.row.status as PropertyStatus

        const statusConfig =
          PROPERTY_STATUS_CONFIG[currentStatus] ||
          PROPERTY_STATUS_CONFIG.available

        return (
          <Chip
            label={statusConfig.label}
            size="small"
            color={statusConfig.color}
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const property = params.row as Property

        return (
          <Box className="flex items-center gap-1">
            <Tooltip title="View Property" arrow>
              <IconButton
                size="small"
                onClick={() => openView(property)}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                  },
                }}
              >
                <VisibilityOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            {isAdmin && (
              <Tooltip title="Edit Property" arrow>
                <IconButton
                  size="small"
                  onClick={() => openEdit(property)}
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#d1fae5',
                      color: '#059669',
                    },
                  }}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      },
    },
  ]

  return (
    <Box
      className="flex-1 p-6 md:p-8"
      sx={{
        background:
          'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%)',
        minHeight: '100%',
      }}
    >
      <Container maxWidth="xl" disableGutters>
        {/* Page header */}
        <Box
          sx={{
            background:
              'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #2563eb 100%)',
            borderRadius: '20px',
            p: { xs: 3, md: 4 },
            mb: 4,
            boxShadow: '0 20px 60px rgba(29, 78, 216, 0.35)',
          }}
        >
          <Box className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Box>
              <Button
                component={RouterLink}
                to="/dashboard"
                startIcon={<ArrowBack />}
                sx={{
                  mb: 1.5,
                  color: 'rgba(255,255,255,0.75)',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
                size="small"
              >
                Back to Dashboard
              </Button>

              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 800, color: '#fff' }}
              >
                Property Management
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.5 }}
              >
                {properties.length} properties listed in the system
              </Typography>
            </Box>

            {isAdmin && (
              <Button
                onClick={openCreate}
                variant="contained"
                startIcon={<Add />}
                sx={{
                  background: '#fff',
                  color: '#1d4ed8',
                  fontWeight: 700,
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  '&:hover': { background: '#eff6ff' },
                }}
              >
                Add New Property
              </Button>
            )}
          </Box>
        </Box>

        {/* Search, Filter & Sort toolbar */}
        <Box
          sx={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            p: { xs: 2, md: 3 },
            mb: 3,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          {/* Search bar */}
          <Box className="mb-5">
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: '#0f172a',
                mb: 1.5,
              }}
            >
              Search Properties
            </Typography>

            <TextField
              fullWidth
              placeholder="Search properties by title or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        className="text-slate-400"
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),
                  className: 'rounded-xl',
                },
              }}
            />
          </Box>

          {/* Filter & Sort controls */}
          <Box
            sx={{
              borderTop: '1px solid #e2e8f0',
              pt: 2.5,
            }}
          >
            <Box className="mb-3 flex items-center gap-2">
              <FilterList sx={{ color: '#2563eb' }} />

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#0f172a' }}
              >
                Filter & Sort
              </Typography>
            </Box>

            <Box className="flex flex-col gap-3 md:flex-row md:items-center">
              <TextField
                select
                fullWidth
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="under_negotiation">Under Negotiation</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Sort by"
                value={sortField}
                onChange={(e) =>
                  setSortField(e.target.value as SortField)
                }
                size="small"
              >
                <MenuItem value="title">Property Name</MenuItem>
                <MenuItem value="address">Address</MenuItem>
                <MenuItem value="basePrice">Base Price</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label="Order"
                value={sortDirection}
                onChange={(e) =>
                  setSortDirection(
                    e.target.value as SortDirection,
                  )
                }
                size="small"
              >
                <MenuItem value="asc">
                  Ascending (A–Z / Low–High)
                </MenuItem>
                <MenuItem value="desc">
                  Descending (Z–A / High–Low)
                </MenuItem>
              </TextField>

              <Button
                onClick={handleClearFilters}
                variant="outlined"
                startIcon={<RestartAlt />}
                sx={{
                  minWidth: { xs: '100%', md: '160px' },
                  py: 1,
                  borderRadius: '10px',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Clear Filters
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1.5,
                color: '#64748b',
              }}
            >
              {/* Showing {sortedProperties.length} of {properties.length}{' '}
              properties */}
            </Typography>
          </Box>
        </Box>

        {/* Property table */}
        <Box
          sx={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            mb: 2,
          }}
        >
          <Box
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
                fontFamily: 'inherit',
              },
              '& .MuiDataGrid-columnHeaders': {
                background:
                  'linear-gradient(90deg, #f8fafc, #f1f5f9)',
                borderBottom: '2px solid #e2e8f0',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 700,
                color: '#374151',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9',
                alignItems: 'center',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid #e2e8f0',
                background:
                  'linear-gradient(90deg, #f8fafc, #f1f5f9)',
              },
            }}
          >
            <DataGrid
              rows={sortedProperties}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              autoHeight
              disableColumnMenu
              disableColumnSorting
              disableRowSelectionOnClick
              rowHeight={72}
            />
          </Box>
        </Box>
      </Container>

      {/* Create / Edit / View dialog */}
      <Dialog
        open={modalMode !== null}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { className: 'rounded-2xl' },
        }}
      >
        <DialogTitle className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <Box>
            <Typography
              variant="h6"
              className="!font-bold !text-slate-900"
            >
              {modalMode === 'create' && 'Create New Property'}
              {modalMode === 'edit' && 'Edit Property Details'}
              {modalMode === 'view' && 'Property Details'}
            </Typography>

            <Typography variant="caption" className="!text-slate-500">
              {modalMode === 'create' &&
                'Add a new property listing with default Available status.'}
              {modalMode === 'edit' &&
                'Update property title, address, and base price.'}
              {modalMode === 'view' &&
                'Read-only view of property details.'}
            </Typography>
          </Box>

          <IconButton
            onClick={closeModal}
            size="small"
            className="text-slate-400 hover:text-slate-700"
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="px-6 py-5">
          {errorMessage && (
            <Alert severity="error" className="!mb-5 !rounded-xl">
              {errorMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {selectedProperty && (
              <Box>
                <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                  Property ID
                </Typography>

                <TextField
                  fullWidth
                  disabled
                  value={selectedProperty.id}
                  size="small"
                  slotProps={{
                    input: { className: 'rounded-xl' },
                  }}
                />
              </Box>
            )}

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                Title
              </Typography>

              <TextField
                fullWidth
                disabled={modalMode === 'view'}
                placeholder="e.g. Skyline Luxury Apartment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeWorkOutlined
                          className="text-slate-400"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                    className: 'rounded-xl',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                Address
              </Typography>

              <TextField
                fullWidth
                disabled={modalMode === 'view'}
                placeholder="e.g. 42 Marine Drive, Mumbai"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnOutlined
                          className="text-slate-400"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                    className: 'rounded-xl',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                Base Price (₹)
              </Typography>

              <TextField
                fullWidth
                disabled={modalMode === 'view'}
                type="number"
                placeholder="e.g. 8500000"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupee
                          className="text-slate-400"
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                    className: 'rounded-xl',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography className="!mb-1.5 !text-sm !font-semibold !text-slate-700">
                Property Status
              </Typography>

              <Box className="flex items-center gap-2">
                <Chip
                  label={
                    modalMode === 'create'
                      ? 'Available (Default)'
                      : PROPERTY_STATUS_CONFIG[
                          selectedProperty?.status || 'available'
                        ].label
                  }
                  color={
                    modalMode === 'create'
                      ? 'success'
                      : PROPERTY_STATUS_CONFIG[
                          selectedProperty?.status || 'available'
                        ].color
                  }
                  size="medium"
                  sx={{ fontWeight: 600 }}
                />

                <Typography variant="caption" className="!text-slate-500">
                  Status cannot be manually edited. Updated via deal workflow.
                </Typography>
              </Box>
            </Box>

            <Box className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button
                onClick={closeModal}
                variant="outlined"
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                }}
              >
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </Button>

              {modalMode !== 'view' && (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                  }}
                >
                  {modalMode === 'create'
                    ? 'Create Property'
                    : 'Save Changes'}
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
    </Box>
  )
}