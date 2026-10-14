
import { useState, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  Add,
  ArrowBack,
  Close,
  CurrencyRupee,
  EditOutlined,
  FilterList,
  HandshakeOutlined,
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

import UserFormDialog from '../component/UserFormDialog'
import { useAuth } from '../context'
import {
  USERS_STORAGE_KEY,
  type User,
} from '../context/authConstants'
import { ROLES } from '../constants/roles'
import {
  PROPERTIES_STORAGE_KEY,
  PROPERTY_STATUS_CONFIG,
  type Property,
  type PropertyStatus,
} from '../constants/properties'

type ModalMode = 'create' | 'edit' | 'view' | null
type DealModalMode = 'create' | 'history' | null
type SortField = 'title' | 'address' | 'basePrice' | 'status'
type SortDirection = 'asc' | 'desc'
type DealStatus = 'Negotiation' | 'Closed' | 'Lost'

interface Deal {
  id: string
  propertyId: string
  propertyTitle: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  basePrice: number
  dealPrice: number
  status: DealStatus
  createdAt: string
  updatedAt: string
}

const DEALS_STORAGE_KEY = 'propdealer_deals'

// Read all users from the same storage key used by user management.
// Only users with the Buyer role appear in the deal dropdown.
function loadBuyers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    const users: User[] = raw ? JSON.parse(raw) : []

    if (!Array.isArray(users)) return []

    return users.filter(
      (user) =>
        typeof user?.role === 'string' &&
        user.role.trim().toLowerCase() ===
        ROLES.BUYER.toLowerCase(),
    )
  } catch (error) {
    console.error('Failed to load Buyers:', error)
    return []
  }
}

function loadProperties(): Property[] {
  try {
    const raw = localStorage.getItem(PROPERTIES_STORAGE_KEY)
    const properties: Property[] = raw ? JSON.parse(raw) : []
    return Array.isArray(properties) ? properties : []
  } catch (error) {
    console.error('Failed to load properties:', error)
    return []
  }
}

function loadDeals(): Deal[] {
  try {
    const raw = localStorage.getItem(DEALS_STORAGE_KEY)
    const deals: Deal[] = raw ? JSON.parse(raw) : []
    return Array.isArray(deals) ? deals : []
  } catch (error) {
    console.error('Failed to load deals:', error)
    return []
  }
}

function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

export function PropertyListPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const isAgent = user?.role === ROLES.AGENT

  // Property state
  const [properties, setProperties] = useState<Property[]>(loadProperties)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedProperty, setSelectedProperty] =
    useState<Property | null>(null)

  // Property form state
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [basePriceError, setBasePriceError] = useState<string | null>(null)

  // Deal state
  const [deals, setDeals] = useState<Deal[]>(loadDeals)
  const [dealModalMode, setDealModalMode] =
    useState<DealModalMode>(null)
  const [dealProperty, setDealProperty] = useState<Property | null>(null)
  const [dealPrice, setDealPrice] = useState('')
  const [selectedBuyerId, setSelectedBuyerId] = useState('')
  const [dealStatus, setDealStatus] =
    useState<DealStatus>('Negotiation')
  const [editingDealId, setEditingDealId] = useState<string | null>(null)
  const [dealPriceError, setDealPriceError] = useState<string | null>(null)
  const [buyerError, setBuyerError] = useState<string | null>(null)
  const [isSavingDeal, setIsSavingDeal] = useState(false)
  // Tracks whether the deal form was opened from the History view.
  // If true, Cancel goes back to History instead of closing the dialog.
  const [openedFromHistory, setOpenedFromHistory] = useState(false)

  // Buyer dialog and dropdown state
  const [buyerDialogOpen, setBuyerDialogOpen] = useState(false)
  const [buyers, setBuyers] = useState<User[]>(loadBuyers)

  // Search, filtering and sorting
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('title')
   const [sortDirection, setSortDirection] =
    useState<SortDirection>('asc')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const persistProperties = (updated: Property[]) => {
    localStorage.setItem(
      PROPERTIES_STORAGE_KEY,
      JSON.stringify(updated),
    )
    setProperties(updated)
  }

  const persistDeals = (updated: Deal[]) => {
    localStorage.setItem(DEALS_STORAGE_KEY, JSON.stringify(updated))
    setDeals(updated)
  }


  const clearErrors = () => {
    setErrorMessage(null)
    setTitleError(null)
    setAddressError(null)
    setBasePriceError(null)
  }

  const resetPropertyForm = () => {
    setTitle('')
    setAddress('')
    setBasePrice('')
    clearErrors()
  }

  const openCreate = () => {
    resetPropertyForm()
    setSelectedProperty(null)
    setModalMode('create')
  }

  const openEdit = (property: Property) => {
    setSelectedProperty(property)
    setTitle(property.title)
    setAddress(property.address)
    setBasePrice(String(property.basePrice))
    clearErrors()
    setModalMode('edit')
  }

  const openView = (property: Property) => {
    setSelectedProperty(property)
    setTitle(property.title)
    setAddress(property.address)
    setBasePrice(String(property.basePrice))
    clearErrors()
    setModalMode('view')
  }

  const closeModal = () => {
    setModalMode(null)
    setSelectedProperty(null)
    resetPropertyForm()
  }

  const handlePropertySubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    clearErrors()

    let hasError = false
    const parsedPrice = Number(basePrice)

    if (!title.trim()) {
      setTitleError('Property title is required.')
      hasError = true
    }

    if (!address.trim()) {
      setAddressError('Property address is required.')
      hasError = true
    }

    if (!basePrice.trim()) {
      setBasePriceError('Base price is required.')
      hasError = true
    } else if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setBasePriceError('Enter a valid positive base price.')
      hasError = true
    }

    if (hasError) return

    const existing = loadProperties()
    const normalizedTitle = title.trim().toLowerCase()
    const normalizedAddress = address.trim().toLowerCase()

    const duplicateTitle = existing.some(
      (property) =>
        property.id !== selectedProperty?.id &&
        property.title.trim().toLowerCase() === normalizedTitle,
    )

    const duplicateAddress = existing.some(
      (property) =>
        property.id !== selectedProperty?.id &&
        property.address.trim().toLowerCase() === normalizedAddress,
    )

    if (duplicateTitle || duplicateAddress) {
      if (duplicateTitle) {
        setTitleError('A property with this title already exists.')
      }

      if (duplicateAddress) {
        setAddressError('A property at this address already exists.')
      }

      setErrorMessage('Please resolve the duplicate property details.')
      return
    }

    if (modalMode === 'create') {
      const newProperty: Property = {
        id: `prop_${Date.now()}`,
        title: title.trim(),
        address: address.trim(),
        basePrice: parsedPrice,
        status: 'available',
        createdAt: new Date().toISOString(),
      }

      persistProperties([newProperty, ...existing])
      setToastMessage('Property created successfully.')
      closeModal()
      return
    }

    if (modalMode === 'edit' && selectedProperty) {
      const updated = existing.map((property) =>
        property.id === selectedProperty.id
          ? {
            ...property,
            title: title.trim(),
            address: address.trim(),
            basePrice: parsedPrice,
          }
          : property,
      )

      persistProperties(updated)
      setToastMessage('Property updated successfully.')
      closeModal()
    }
  }


  const openCreateDeal = (property: Property) => {
    setBuyers(loadBuyers())
    setDealProperty(property)
    setDealPrice('')
    setSelectedBuyerId('')
    setDealStatus('Negotiation')
    setEditingDealId(null)
    setDealPriceError(null)
    setBuyerError(null)
    setOpenedFromHistory(false) // came from the table icon, not from History
    setDealModalMode('create')
  }

  const openDealHistory = (property: Property) => {
    setDealProperty(property)
    setDealModalMode('history')
  }

  const closeDealModal = () => {
    if (isSavingDeal) return

    setDealModalMode(null)
    setDealProperty(null)
    setDealPrice('')
    setSelectedBuyerId('')
    setDealStatus('Negotiation')
    setEditingDealId(null)
    setDealPriceError(null)
    setBuyerError(null)
    setOpenedFromHistory(false)
  }

  // Called when the user clicks Cancel on the deal form.
  // If they came from History, go back to History instead of closing.
  const handleCancelDeal = () => {
    if (isSavingDeal) return

    if (openedFromHistory) {
      // Reset form fields but keep dealProperty so History renders correctly.
      setDealPrice('')
      setSelectedBuyerId('')
      setDealStatus('Negotiation')
      setEditingDealId(null)
      setDealPriceError(null)
      setBuyerError(null)
      setOpenedFromHistory(false)
      setDealModalMode('history') //  go back to History
    } else {
      closeDealModal() //  close everything
    }
  }

  const openEditDeal = (deal: Deal) => {
    const property = properties.find(
      (item) => item.id === deal.propertyId,
    )

    if (!property) {
      setToastMessage('The property for this deal could not be found.')
      return
    }

    setBuyers(loadBuyers())
    setDealProperty(property)
    setDealPrice(String(deal.dealPrice))
    setSelectedBuyerId(deal.buyerId)
    setDealStatus(deal.status)
    setEditingDealId(deal.id)
    setDealPriceError(null)
    setBuyerError(null)
    setOpenedFromHistory(true) // came from History — Cancel should go back
    setDealModalMode('create')
  }

  // Runs after UserFormDialog saves a Buyer successfully.
  const handleBuyerCreated = (newBuyer: User) => {
    const refreshedBuyers = loadBuyers()
    const alreadyIncluded = refreshedBuyers.some(
      (buyer) => buyer.id === newBuyer.id,
    )

    setBuyers(
      alreadyIncluded
        ? refreshedBuyers
        : [...refreshedBuyers, newBuyer],
    )
    setSelectedBuyerId(newBuyer.id)
    setBuyerError(null)
    setBuyerDialogOpen(false)
  }

  const handleCreateDealForm = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (isSavingDeal || !dealProperty) return

    setDealPriceError(null)
    setBuyerError(null)

    const parsedDealPrice = Number(dealPrice)
    const buyer = buyers.find(
      (item) => item.id === selectedBuyerId,
    )

    let hasError = false

    if (!dealPrice.trim()) {
      setDealPriceError('Deal price is required.')
      hasError = true
    } else if (
      !Number.isFinite(parsedDealPrice) ||
      parsedDealPrice <= 0
    ) {
      setDealPriceError('Enter a valid positive deal price.')
      hasError = true
    }

    if (!buyer) {
      setBuyerError('Please select a valid Buyer.')
      hasError = true
    }

    if (hasError || !buyer) return

    const previousDeal = deals.find(
      (deal) => deal.id === editingDealId,
    )

    if (
      previousDeal &&
      (previousDeal.status === 'Closed' ||
        previousDeal.status === 'Lost') &&
      previousDeal.buyerId !== buyer.id
    ) {
      setBuyerError(
        'The Buyer cannot be changed for a Closed or Lost deal.',
      )
      return
    }

    setIsSavingDeal(true)

    try {
      // Demo loading state. Replace with an API call when available.
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 2000),
      )

      const now = new Date().toISOString()

      const deal: Deal = {
        id: previousDeal?.id ?? `deal_${Date.now()}`,
        propertyId: dealProperty.id,
        propertyTitle: dealProperty.title,
        buyerId: buyer.id,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        basePrice: dealProperty.basePrice,
        dealPrice: parsedDealPrice,
        status: dealStatus,
        createdAt: previousDeal?.createdAt ?? now,
        updatedAt: now,
      }

      const updatedDeals = previousDeal
        ? deals.map((item) =>
          item.id === previousDeal.id ? deal : item,
        )
        : [deal, ...deals]

      persistDeals(updatedDeals)

      if (!previousDeal) {
        const latestProperties = loadProperties()

        const updatedProperties = latestProperties.map((property) =>
          property.id === dealProperty.id
            ? {
              ...property,
              status: 'under_negotiation' as PropertyStatus,
            }
            : property,
        )

        persistProperties(updatedProperties)
      }

      setToastMessage(
        previousDeal
          ? 'Deal updated successfully.'
          : 'Deal created successfully.',
      )

      setDealModalMode(null)
      setDealProperty(null)
      setDealPrice('')
      setSelectedBuyerId('')
      setDealStatus('Negotiation')
      setEditingDealId(null)
      setDealPriceError(null)
      setBuyerError(null)
    } catch (error) {
      console.error('Unable to save deal:', error)
      setToastMessage('Unable to save the deal. Please try again.')
    } finally {
      setIsSavingDeal(false)
    }
  }


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

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setSortField('title')
    setSortDirection('asc')
  }

  const propertyDeals = deals.filter(
    (deal) => deal.propertyId === dealProperty?.id,
  )

  const lockedBuyerDeal = deals.find(
    (deal) =>
      deal.id === editingDealId &&
      (deal.status === 'Closed' || deal.status === 'Lost'),
  )


  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.2,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.row.title}
        </Typography>
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ color: '#475569' }}>
          {params.row.address}
        </Typography>
      ),
    },
    {
      field: 'basePrice',
      headerName: 'Base Price',
      width: 170,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatPrice(Number(params.row.basePrice))}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params: GridRenderCellParams) => {
        const currentStatus = params.row.status as PropertyStatus
        const config =
          PROPERTY_STATUS_CONFIG[currentStatus] ??
          PROPERTY_STATUS_CONFIG.available

        return (
          <Chip
            label={config.label}
            color={config.color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
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
              >
                <VisibilityOutlined fontSize="small" />
              </IconButton>
            </Tooltip>

            {isAdmin && (
              <Tooltip title="Edit Property" arrow>
                <IconButton
                  size="small"
                  onClick={() => openEdit(property)}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {isAgent && (
              <Tooltip title="Create Deal" arrow>
                <IconButton
                  size="small"
                  onClick={() => openCreateDeal(property)}
                >
                  <HandshakeOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Deal History" arrow>
              <IconButton
                size="small"
                onClick={() => openDealHistory(property)}
              >
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
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
        {/* Page heading */}
        <Box
          sx={{
            background:
              'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #2563eb 100%)',
            borderRadius: '20px',
            p: { xs: 3, md: 4 },
            mb: 4,
            boxShadow: '0 20px 60px rgba(29, 78, 216, 0.2)',
          }}
        >
          <Box className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Box>
              <Button
                component={RouterLink}
                to="/dashboard"
                startIcon={<ArrowBack />}
                sx={{ mb: 1, color: '#fff', textTransform: 'none' }}
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
                sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}
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
                  '&:hover': { background: '#eff6ff' },
                }}
              >
                Add New Property
              </Button>
            )}
          </Box>
        </Box>

        {/* Search and filters */}
        <Box
          sx={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            p: { xs: 2, md: 3 },
            mb: 3,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 1.5 }}
          >
            Search Properties
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Search properties by title or address..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box className="mt-5 flex items-center gap-2">
            <FilterList color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Filter & Sort
            </Typography>
          </Box>

          <Box className="mt-3 flex flex-col gap-3 md:flex-row">
            <TextField
              select
              fullWidth
              size="small"
              label="Filter by Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="under_negotiation">
                Under Negotiation
              </MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              size="small"
              label="Sort by"
              value={sortField}
              onChange={(event) =>
                setSortField(event.target.value as SortField)
              }
            >
              <MenuItem value="title">Property Name</MenuItem>
              <MenuItem value="address">Address</MenuItem>
              <MenuItem value="basePrice">Base Price</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </TextField>

            {/* <TextField
              select
              fullWidth
              size="small"
              label="Order"
              value={sortDirection}
              onChange={(event) =>
                setSortDirection(event.target.value as SortDirection)
              }
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField> */}

            <Button
              onClick={handleClearFilters}
              variant="outlined"
              startIcon={<RestartAlt />}
              sx={{
                minWidth: { xs: '100%', md: 160 },
                textTransform: 'none',
              }}
            >
              Clear Filters
            </Button>
          </Box>

          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 1.5, color: '#64748b' }}
          >
            Showing {sortedProperties.length} of {properties.length}{' '}
            properties
          </Typography>
        </Box>

        {/* Property table */}
        <Box
          sx={{
            background: '#fff',
            borderRadius: '20px',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          <DataGrid
            rows={sortedProperties}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            autoHeight
            disableRowSelectionOnClick
            rowHeight={72}
          />
        </Box>
      </Container>

      {/* Create / Edit / View Property dialog */}
      <Dialog
        open={modalMode !== null}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center justify-between border-b border-slate-100">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {modalMode === 'create' && 'Create New Property'}
              {modalMode === 'edit' && 'Edit Property Details'}
              {modalMode === 'view' && 'Property Details'}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {modalMode === 'create'
                ? 'New properties start with Available status.'
                : modalMode === 'edit'
                  ? 'Update the property details.'
                  : 'Read-only property details.'}
            </Typography>
          </Box>

          <IconButton onClick={closeModal} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="!px-6 !py-5">
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box
            component="form"
            id="property-form"
            onSubmit={handlePropertySubmit}
            noValidate
            className="flex flex-col gap-4 pt-2"
          >
            {selectedProperty && (
              <TextField
                label="Property ID"
                disabled
                fullWidth
                value={selectedProperty.id}
                size="small"
              />
            )}

            <TextField
              label="Title"
              required
              fullWidth
              disabled={modalMode === 'view'}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setTitleError(null)
                setErrorMessage(null)
              }}
              error={Boolean(titleError)}
              helperText={titleError}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeWorkOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Address"
              required
              fullWidth
              disabled={modalMode === 'view'}
              value={address}
              onChange={(event) => {
                setAddress(event.target.value)
                setAddressError(null)
                setErrorMessage(null)
              }}
              error={Boolean(addressError)}
              helperText={addressError}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Base Price"
              type="number"
              required
              fullWidth
              disabled={modalMode === 'view'}
              value={basePrice}
              onChange={(event) => {
                setBasePrice(event.target.value)
                setBasePriceError(null)
                setErrorMessage(null)
              }}
              error={Boolean(basePriceError)}
              helperText={basePriceError}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupee fontSize="small" />
                    </InputAdornment>
                  ),
                  htmlInput: { min: 1, step: 1 },
                },
              }}
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Property Status
              </Typography>

              <Chip
                label={
                  modalMode === 'create'
                    ? 'Available (Default)'
                    : PROPERTY_STATUS_CONFIG[
                      selectedProperty?.status ?? 'available'
                    ].label
                }
                color={
                  modalMode === 'create'
                    ? 'success'
                    : PROPERTY_STATUS_CONFIG[
                      selectedProperty?.status ?? 'available'
                    ].color
                }
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions className="!px-6 !pb-5">
          <Button onClick={closeModal} variant="outlined">
            {modalMode === 'view' ? 'Close' : 'Cancel'}
          </Button>

          {modalMode !== 'view' && (
            <Button
              type="submit"
              form="property-form"
              variant="contained"
            >
              {modalMode === 'create' ? 'Create Property' : 'Save Changes'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Deal creation and history */}
      <Dialog
        open={dealModalMode !== null}
        onClose={closeDealModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center justify-between">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {dealModalMode === 'create'
                ? editingDealId
                  ? 'Edit Deal'
                  : 'Create Deal'
                : 'Property Deals History'}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {dealProperty?.title}
            </Typography>
          </Box>

          <IconButton
            onClick={closeDealModal}
            disabled={isSavingDeal}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {dealProperty ? (
            dealModalMode === 'create' ? (
              <Box className="flex flex-col gap-5 pt-2">
                {/* Attractive property summary */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    color: '#fff',
                    background:
                      'linear-gradient(135deg, #172554 0%, #2563eb 100%)',
                  }}
                >
                  <Box className="flex items-center gap-3">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(255,255,255,0.15)',
                      }}
                    >
                      <HomeWorkOutlined />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="overline" sx={{ opacity: 0.8 }}>
                        PROPERTY DEAL
                      </Typography>

                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {dealProperty.title}
                      </Typography>

                      <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        {dealProperty.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    className="mt-5 flex flex-wrap items-end justify-between gap-3"
                    sx={{
                      pt: 2,
                      borderTop: '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Base Price
                      </Typography>

                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {formatPrice(dealProperty.basePrice)}
                      </Typography>
                    </Box>

                    <Chip
                      label={editingDealId ? 'Editing Deal' : 'New Deal'}
                      sx={{
                        color: '#fff',
                        bgcolor: 'rgba(255,255,255,0.16)',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Deal Details
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Enter the agreed price and select a registered Buyer.
                  </Typography>
                </Box>

                <Box
                  component="form"
                  id="deal-form"
                  onSubmit={handleCreateDealForm}
                  className="flex flex-col gap-4"
                >
                  <TextField
                    label="Agreed Deal Price"
                    type="number"
                    fullWidth
                    required
                    disabled={isSavingDeal}
                    value={dealPrice}
                    onChange={(event) => {
                      setDealPrice(event.target.value)
                      setDealPriceError(null)
                    }}
                    error={Boolean(dealPriceError)}
                    helperText={
                      dealPriceError ?? 'Enter a positive amount in rupees.'
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyRupee />
                          </InputAdornment>
                        ),
                      },
                      htmlInput: { min: 1, step: 1 },
                    }}
                  />

                  <FormControl fullWidth error={Boolean(buyerError)}>
                    <InputLabel id="deal-buyer-label">
                      Select Buyer
                    </InputLabel>

                    <Select
                      labelId="deal-buyer-label"
                      label="Select Buyer"
                      value={selectedBuyerId}
                      disabled={isSavingDeal || Boolean(lockedBuyerDeal)}
                      onChange={(event) => {
                        setSelectedBuyerId(String(event.target.value))
                        setBuyerError(null)
                      }}
                    >
                      {buyers.map((buyer) => (
                        <MenuItem key={buyer.id} value={buyer.id}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                              {buyer.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.2 }}>
                              {buyer.email}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>

                    {buyerError && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1 }}
                      >
                        {buyerError}
                      </Typography>
                    )}

                    {buyers.length === 0 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        No Buyers registered yet. Use Add New Buyer.
                      </Typography>
                    )}
                  </FormControl>

                  {/* Add Buyer section */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #dbeafe',
                      bgcolor: '#eff6ff',
                    }}
                  >

                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<Add />}
                      disabled={isSavingDeal || Boolean(lockedBuyerDeal)}
                      onClick={() => {
                        setBuyers(loadBuyers())
                        setBuyerDialogOpen(true)
                      }}
                      sx={{
                        mt: 1.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                      }}
                    >
                      Add New Buyer
                    </Button>
                  </Box>

                  {editingDealId && (
                    <TextField
                      select
                      label="Deal Status"
                      value={dealStatus}
                      fullWidth
                      disabled={isSavingDeal}
                      onChange={(event) =>
                        setDealStatus(event.target.value as DealStatus)
                      }
                      helperText="Buyer changes are restricted for Closed or Lost deals."
                    >
                      <MenuItem value="Negotiation">Negotiation</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
                    </TextField>
                  )}
                </Box>
              </Box>
            ) : (
              <Box className="flex flex-col gap-3 pt-2">
                <Typography variant="body2">
                  <strong>Property ID:</strong> {dealProperty.id}
                </Typography>

                {propertyDeals.length === 0 ? (
                  <Alert severity="info">
                    No deals have been recorded for this property yet.
                  </Alert>
                ) : (
                  propertyDeals.map((deal) => (
                    <Box
                      key={deal.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <Box className="flex flex-col justify-between gap-2 sm:flex-row">
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {formatPrice(deal.dealPrice)}
                          </Typography>

                          <Typography variant="body2">
                            Buyer: {deal.buyerName}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {deal.buyerEmail}
                          </Typography>
                        </Box>

                        <Chip
                          label={deal.status}
                          color={
                            deal.status === 'Closed'
                              ? 'success'
                              : deal.status === 'Lost'
                                ? 'error'
                                : 'warning'
                          }
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        Created: {new Date(deal.createdAt).toLocaleString()}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        Updated: {new Date(deal.updatedAt).toLocaleString()}
                      </Typography>

                      {/* "View / Edit Deal" is shown only when the property is actively under negotiation.
                          Once the property is Sold or back to Available, editing is locked. */}
                      {properties.find((p) => p.id === deal.propertyId)?.status === 'under_negotiation' && (
                        <Button
                          size="small"
                          sx={{ mt: 1, textTransform: 'none' }}
                          onClick={() => openEditDeal(deal)}
                        >
                          View / Edit Deal
                        </Button>
                      )}
                    </Box>
                  ))
                )}
              </Box>
            )
          ) : (
            <Typography color="text.secondary">
              No property selected.
            </Typography>
          )}
        </DialogContent>

        {dealModalMode === 'create' && (
          <DialogActions className="!px-6 !py-4">
            <Button
              onClick={handleCancelDeal}
              disabled={isSavingDeal}
            >
              {openedFromHistory ? ' Back to History' : 'Cancel'}
            </Button>

            <Button
              type="submit"
              form="deal-form"
              variant="contained"
              disabled={isSavingDeal}
              startIcon={
                isSavingDeal ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <HandshakeOutlined />
                )
              }
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              {isSavingDeal
                ? 'Saving Deal...'
                : editingDealId
                  ? 'Save Changes'
                  : 'Create Deal'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Keep this as a sibling dialog so deal state is preserved. */}
      <UserFormDialog
        open={buyerDialogOpen}
        onClose={() => setBuyerDialogOpen(false)}
        onUserCreated={handleBuyerCreated}
      />

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
    </Box>
  )
}
