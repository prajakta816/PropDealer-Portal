import { useState, useEffect, type FormEvent } from 'react'
import { Alert, Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Snackbar, TextField, Tooltip, Typography, CircularProgress, } from '@mui/material'
import { Add, ArrowBack, Close, CurrencyRupee, EditOutlined, FilterList, HandshakeOutlined, HomeWorkOutlined, LocationOnOutlined, RestartAlt, Search, VisibilityOutlined, } from '@mui/icons-material'
import { DataGrid, type GridColDef, type GridRenderCellParams, } from '@mui/x-data-grid'
import { Link as RouterLink } from 'react-router-dom'

import UserFormDialog from '../component/UserFormDialog'
import { useAuth } from '../context'
import { getAllBuyersApi, type BuyerItem } from '../api/buyersApi'
import {
  getAllPropertiesApi,
  createPropertyApi,
  updatePropertyApi,
} from '../api/propertiesApi'
import {
  getDealsByPropertyApi,
  createDealApi,
  updateDealApi,
} from '../api/dealsApi'

import { ROLES } from '../constants/roles'
import { PROPERTY_STATUS_CONFIG, type Property, type PropertyStatus } from '../constants/properties'
import { type Deal, type DealStatus } from '../constants/deals'

type ModalMode = 'create' | 'edit' | 'view' | null
type DealModalMode = 'create' | 'edit' | 'view' | 'history' | null
type SortField = 'title' | 'address' | 'basePrice' | 'status'
type SortDirection = 'asc' | 'desc'

function formatPrice(price: number): string {
  return `${price.toLocaleString('en-IN')}`
}

export function PropertyListPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const isAgent = user?.role === ROLES.AGENT

  // Property state
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(true)
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
  const [isSavingProperty, setIsSavingProperty] = useState(false)

  // Deal state
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoadingDeals, setIsLoadingDeals] = useState(true)
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
  const [confirmLostOpen, setConfirmLostOpen] = useState(false)

  // Buyer dialog and dropdown state
  const [buyerDialogOpen, setBuyerDialogOpen] = useState(false)
  const [buyers, setBuyers] = useState<BuyerItem[]>([])
  const [isLoadingBuyers, setIsLoadingBuyers] = useState(true)

  const fetchBuyers = async () => {
    try {
      setIsLoadingBuyers(true)
      const data = await getAllBuyersApi()
      setBuyers(data)
    } catch (err: unknown) {
      console.error('Failed to load buyers:', err)
    } finally {
      setIsLoadingBuyers(false)
    }
  }

  const fetchProperties = async () => {
    try {
      setIsLoadingProperties(true)
      const data = await getAllPropertiesApi()
      setProperties(data)
    } catch (err: unknown) {
      setToastMessage(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setIsLoadingProperties(false)
    }
  }

  const fetchDealsForProperty = async (propertyId: string) => {
    try {
      setIsLoadingDeals(true)
      const data = await getDealsByPropertyApi(propertyId)
      setDeals(data)
    } catch (err: unknown) {
      setToastMessage(err instanceof Error ? err.message : 'Failed to load deals.')
    } finally {
      setIsLoadingDeals(false)
    }
  }

  useEffect(() => {
    fetchProperties()
    fetchBuyers()
    setIsLoadingDeals(false)
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [toastMessage, setToastMessage] = useState<string | null>(null)


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

  const handlePropertySubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    if (hasError) {
      return
    }

    setIsSavingProperty(true)

    try {
      if (modalMode === 'create') {
        await createPropertyApi({
          title: title.trim(),
          address: address.trim(),
          basePrice: parsedPrice,
        })
        setToastMessage('Property created successfully.')
        closeModal()
        await fetchProperties()
      } else if (modalMode === 'edit' && selectedProperty) {
        await updatePropertyApi(selectedProperty.id, {
          title: title.trim(),
          address: address.trim(),
          basePrice: parsedPrice,
        })
        setToastMessage('Property updated successfully.')
        closeModal()
        await fetchProperties()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save property.'
      setErrorMessage(msg)
    } finally {
      setIsSavingProperty(false)
    }
  }

  const openCreateDeal = (property: Property, fromHistory = false) => {
    setDealProperty(property)
    setDealPrice('')
    setSelectedBuyerId('')
    setDealStatus('Negotiation')
    setEditingDealId(null)
    setDealPriceError(null)
    setBuyerError(null)
    setOpenedFromHistory(fromHistory)
    setDealModalMode('create')
  }

  const openDealHistory = (property: Property) => {
    setDealProperty(property)
    fetchDealsForProperty(property.id)
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

  const handleCancelDeal = () => {
    if (isSavingDeal) return

    if (openedFromHistory) {
      setDealPrice('')
      setSelectedBuyerId('')
      setDealStatus('Negotiation')
      setEditingDealId(null)
      setDealPriceError(null)
      setBuyerError(null)
      setOpenedFromHistory(false)
      setDealModalMode('history')
    } else {
      closeDealModal()
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

    setDealProperty(property)
    setDealPrice(deal.status === 'Lost' ? '' : String(deal.dealPrice))
    setSelectedBuyerId(deal.buyerId)
    setDealStatus(deal.status)
    setEditingDealId(deal.id)
    setDealPriceError(null)
    setBuyerError(null)
    setOpenedFromHistory(true)
    setDealModalMode('edit')
  }

  const openViewDeal = (deal: Deal) => {
    const property = properties.find(
      (item) => item.id === deal.propertyId,
    )

    if (!property) {
      setToastMessage('The property for this deal could not be found.')
      return
    }

    setDealProperty(property)
    setDealPrice(deal.status === 'Lost' ? '' : String(deal.dealPrice))
    setSelectedBuyerId(deal.buyerId)
    setDealStatus(deal.status)
    setEditingDealId(deal.id)
    setDealPriceError(null)
    setBuyerError(null)
    setOpenedFromHistory(true)
    setDealModalMode('view')
  }

  const handleBuyerCreated = (newBuyer: BuyerItem) => {
    setBuyers((prev) => {
      const alreadyIncluded = prev.some((b) => b.id === newBuyer.id)
      return alreadyIncluded ? prev : [newBuyer, ...prev]
    })
    setSelectedBuyerId(newBuyer.id)
    setBuyerError(null)
    setBuyerDialogOpen(false)
  }

  const performSaveDeal = async (statusToSave: DealStatus = dealStatus) => {
    if (!dealProperty) return

    const buyer = buyers.find((item) => item.id === selectedBuyerId)
    if (!buyer) return

    const previousDeal = deals.find((deal) => deal.id === editingDealId)
    const finalPrice = statusToSave === 'Lost' ? 0 : Number(dealPrice)

    setIsSavingDeal(true)

    try {
      if (previousDeal) {
        await updateDealApi(previousDeal.id, {
          buyerId: buyer.id,
          dealPrice: finalPrice,
          status: statusToSave,
        })
      } else {
        await createDealApi(dealProperty.id, {
          buyerId: buyer.id,
          dealPrice: finalPrice,
        })
      }

      setToastMessage(
        previousDeal
          ? statusToSave === 'Lost'
            ? 'Deal marked as Lost.'
            : statusToSave === 'Closed'
              ? 'Deal closed successfully.'
              : 'Deal updated successfully.'
          : 'Deal created successfully.',
      )

      await fetchProperties()
      await fetchDealsForProperty(dealProperty.id)

      if (openedFromHistory) {
        setOpenedFromHistory(false)
        setDealPrice('')
        setSelectedBuyerId('')
        setDealStatus('Negotiation')
        setEditingDealId(null)
        setDealPriceError(null)
        setBuyerError(null)
        setDealModalMode('history')
      } else {
        closeDealModal()
      }
    } catch (error: unknown) {
      console.error('Unable to save deal:', error)
      const msg = error instanceof Error ? error.message : 'Unable to save the deal. Please try again.'
      setToastMessage(msg)
    } finally {
      setIsSavingDeal(false)
    }
  }

  const handleConfirmLost = async () => {
    setConfirmLostOpen(false)
    await performSaveDeal('Lost')
  }

  const handleCreateDealForm = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (isSavingDeal || !dealProperty || isDealReadOnly) return

    setDealPriceError(null)
    setBuyerError(null)

    const parsedDealPrice = Number(dealPrice)
    const buyer = buyers.find((item) => item.id === selectedBuyerId)

    let hasError = false

    if (!buyer) {
      setBuyerError('Please select a valid Buyer.')
      hasError = true
    }

    if (dealStatus !== 'Lost') {
      if (!dealPrice.trim()) {
        setDealPriceError('Selling price is required.')
        hasError = true
      } else if (!Number.isFinite(parsedDealPrice) || parsedDealPrice <= 0) {
        setDealPriceError('Enter a valid positive selling price.')
        hasError = true
      } else if (parsedDealPrice < dealProperty.basePrice) {
        setDealPriceError(
          `Selling price must be greater than or equal to base price (${formatPrice(dealProperty.basePrice)}).`,
        )
        hasError = true
      }
    }

    if (hasError || !buyer) return

    const previousDeal = deals.find((deal) => deal.id === editingDealId)

    if (!previousDeal && dealProperty.status === 'sold') {
      setBuyerError('This property is already sold. No further deals can be added.')
      return
    }

    if (
      previousDeal &&
      (previousDeal.status === 'Closed' || previousDeal.status === 'Lost') &&
      previousDeal.buyerId !== buyer.id
    ) {
      setBuyerError('The Buyer cannot be changed for a Closed or Lost deal.')
      return
    }

    if (dealStatus === 'Lost') {
      setConfirmLostOpen(true)
      return
    }

    await performSaveDeal(dealStatus)
  }


  const query = searchQuery.trim().toLowerCase()

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = !query || property.title.toLowerCase().includes(query) || property.address.toLowerCase().includes(query)

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

  const currentEditingDeal = deals.find((deal) => deal.id === editingDealId);

  const lockedBuyerDeal = currentEditingDeal && (currentEditingDeal.status === 'Closed' || currentEditingDeal.status === 'Lost');

  const isDealReadOnly = Boolean(dealModalMode === 'view' || lockedBuyerDeal);

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        const property = params.row as Property

        return (
          <Box className="flex items-center gap-1.5">
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

            {isAgent && (<Button
              size="small"
              variant="outlined"
              startIcon={<HandshakeOutlined />}
              onClick={() => openDealHistory(property)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              Create/View Deals
            </Button>
            )}

            {isAdmin && (<Button
              size="small"
              variant="outlined"
              startIcon={<HandshakeOutlined />}
              onClick={() => openDealHistory(property)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              View Deals
            </Button>
            )}

          </Box>
        )
      },
    },
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
    }
  ]

  return (
    <Box className="flex-1 p-6 md:p-8" sx={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%)', minHeight: '100%', }} >
      <Container maxWidth="xl" disableGutters>
        {/* Page heading */}
        <Box sx={{ background: 'linear-gradient(135deg, #5f1e42 0%, #1d4ed8 50%, #2563eb 100%)', borderRadius: '20px', p: { xs: 3, md: 4 }, mb: 4, boxShadow: '0 20px 60px rgba(216, 29, 35, 0.2)', }} >
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

              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#fff' }} >
                Property Management
              </Typography>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }} >
                {properties.length} properties listed in the system
              </Typography>
            </Box>
            {/* Page heading end  */}


            {isAdmin && (
              <Button
                onClick={openCreate}
                variant="contained"
                startIcon={<Add />}
                sx={{ background: '#fff', color: '#1d4ed8', fontWeight: 700, borderRadius: '12px', px: 3, py: 1.5, textTransform: 'none', '&:hover': { background: '#eff6ff' }, }}
              >
                Add New Property
              </Button>
            )}
          </Box>
        </Box>

        {/* Search and filters */}
        <Box
          sx={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', p: { xs: 2, md: 3 }, mb: 3, }} >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }} >
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
              <MenuItem value="under_negotiation"> Under Negotiation </MenuItem>
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

            <Button
              onClick={handleClearFilters}
              variant="outlined"
              startIcon={<RestartAlt />}
              sx={{ minWidth: { xs: '100%', md: 160 }, textTransform: 'none', }}
            >
              Clear Filters
            </Button>
          </Box>

          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#64748b' }} >
            Showing {sortedProperties.length} of {properties.length}{' '}
            properties
          </Typography>
        </Box>

        {/* Property table */}
        <Box sx={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', mb: 2, }} >
          <DataGrid
            rows={sortedProperties}
            columns={columns}
            loading={isLoadingProperties}
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
                },
                htmlInput: { min: 1, step: 1 },
              }}
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Property Status
              </Typography>

              <Chip
                label={
                  modalMode === 'create'
                    ? 'Available'
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
          <Button onClick={closeModal} variant="outlined" disabled={isSavingProperty}>
            {modalMode === 'view' ? 'Close' : 'Cancel'}
          </Button>

          {modalMode !== 'view' && (
            <Button
              type="submit"
              form="property-form"
              variant="contained"
              disabled={isSavingProperty}
              startIcon={
                isSavingProperty ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              {isSavingProperty
                ? 'Saving...'
                : modalMode === 'create'
                  ? 'Create Property'
                  : 'Save Changes'}
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
              {dealModalMode === 'history'
                ? 'Property Deals'
                : dealModalMode === 'view'
                  ? 'View Deal'
                  : dealModalMode === 'edit'
                    ? 'Edit Deal'
                    : 'Create New Deal'}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {dealProperty?.title}
            </Typography>
          </Box>

          <IconButton onClick={closeDealModal} disabled={isSavingDeal} >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {dealProperty ? (
            dealModalMode !== 'history' ? (
              <Box className="flex flex-col gap-5 pt-2">
                {lockedBuyerDeal && (
                  <Alert severity="warning">
                    This deal is {currentEditingDeal?.status.toLowerCase()} and is permanently
                    locked in read-only mode.
                  </Alert>
                )}

                <Box sx={{ p: 3, borderRadius: 3, color: '#fff', background: 'linear-gradient(135deg, #172554 0%, #2563eb 100%)', }} >
                  <Box className="flex items-center gap-3">
                    <Box sx={{ width: 48, height: 48, flexShrink: 0, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.15)', }} >
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

                  <Box className="mt-5 flex flex-wrap items-end justify-between gap-3" sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)', }} >
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Base Price
                      </Typography>

                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {formatPrice(dealProperty.basePrice)}
                      </Typography>
                    </Box>
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

                <Box component="form" id="deal-form" onSubmit={handleCreateDealForm} className="flex flex-col gap-4" >
                  <TextField
                    label={dealStatus === 'Closed' ? 'Agreed Selling Price' : 'Agreed Deal Price'}
                    type="number"
                    fullWidth
                    required={dealStatus !== 'Lost'}
                    disabled={isSavingDeal || isDealReadOnly || dealStatus === 'Lost'}
                    value={dealStatus === 'Lost' ? '' : dealPrice}
                    onChange={(event) => {
                      setDealPrice(event.target.value)
                      setDealPriceError(null)
                    }}
                    error={Boolean(dealPriceError)}
                    helperText={
                      dealStatus === 'Lost'
                        ? 'No selling price is allowed or recorded for lost deals.'
                        : dealPriceError ??
                        (dealStatus === 'Closed'
                          ? `Selling price must be greater than base price (₹${formatPrice(dealProperty.basePrice)}).`
                          : 'Enter a positive amount in rupees.')
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
                      disabled={isSavingDeal || Boolean(lockedBuyerDeal) || isLoadingBuyers || isDealReadOnly}
                      onChange={(event) => {
                        setSelectedBuyerId(String(event.target.value))
                        setBuyerError(null)
                      }}
                    >
                      {isLoadingBuyers ? (
                        <MenuItem disabled value="">
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Loading buyers...
                          </Typography>
                        </MenuItem>
                      ) : (
                        buyers.map((buyer) => (
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
                        ))
                      )}
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

                  <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #dbeafe', bgcolor: '#eff6ff', }} >

                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<Add />}
                      disabled={isSavingDeal || Boolean(lockedBuyerDeal) || isDealReadOnly}
                      onClick={() => {
                        fetchBuyers()
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
                      disabled={isSavingDeal || isDealReadOnly}
                      onChange={(event) => {
                        const nextStatus = event.target.value as DealStatus
                        setDealStatus(nextStatus)
                        setDealPriceError(null)
                        if (nextStatus === 'Lost') {
                          setDealPrice('')
                        }
                      }}
                      helperText={
                        isDealReadOnly
                          ? 'This deal is lost and permanently locked.'
                          : dealStatus === 'Lost'
                            ? 'Marking as Lost will lock this deal and clear the selling price.'
                            : 'Buyer changes are restricted for Closed or Lost deals.'
                      }
                    >
                      <MenuItem value="Negotiation">Negotiation</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
                    </TextField>
                  )}
                </Box>
              </Box>
            )
              :
              (
                <Box className="flex flex-col gap-3 pt-2">
                  <Box className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Base Price: ₹{formatPrice(dealProperty.basePrice)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Property Status: {PROPERTY_STATUS_CONFIG[dealProperty.status]?.label ?? dealProperty.status}
                      </Typography>
                    </Box>

                    {isAgent && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Add />}
                        disabled={dealProperty.status === 'sold' || propertyDeals.some((d) => d.status === 'Closed')}
                        onClick={() => openCreateDeal(dealProperty, true)}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                      >
                        Create New Deal
                      </Button>
                    )}
                  </Box>

                  {isLoadingDeals
                    ? (<Box className="flex justify-center py-4"> <CircularProgress size={28} /> </Box>)
                    : propertyDeals.length === 0
                      ? (<Alert severity="info"> No deals have been recorded for this property yet. </Alert>)
                      : (
                        propertyDeals.map((deal) => (
                          <Box
                            key={deal.id}
                            className="rounded-xl border border-slate-200 p-4"
                          >
                            <Box className="flex flex-col justify-between gap-2 sm:flex-row">
                              <Box>
                                <Typography sx={{ fontWeight: 700 }}>
                                  {deal.status === 'Lost' ? 'No Selling Price (Lost)' : formatPrice(deal.dealPrice)}
                                </Typography>

                                <Typography variant="body2">
                                  Buyer: {deal.buyer?.name ?? 'Unknown Buyer'}
                                </Typography>

                                <Typography variant="caption" color="text.secondary" >
                                  {deal.buyer?.email ?? ''}
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

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }} >
                              Created: {new Date(deal.createdAt).toLocaleString()}
                            </Typography>

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} >
                              Updated: {new Date(deal.updatedAt).toLocaleString()}
                            </Typography>

                            <Box className="flex items-center gap-2 mt-2">
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: 'none' }}
                                onClick={() => openViewDeal(deal)}
                              >
                                View Deal
                              </Button>

                              {isAgent && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  disabled={deal.status === 'Closed' || deal.status === 'Lost' || dealProperty.status === 'sold'}
                                  sx={{ textTransform: 'none' }}
                                  onClick={() => openEditDeal(deal)}
                                >
                                  Edit Deal
                                </Button>
                              )}
                            </Box>
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

        {dealModalMode !== 'history' && (
          <DialogActions className="!px-6 !py-4 flex flex-wrap justify-between gap-2">
            <Button
              onClick={handleCancelDeal}
              disabled={isSavingDeal}
            >
              {openedFromHistory ? 'Back to History' : 'Cancel'}
            </Button>

            {!isDealReadOnly && (
              <Box className="flex items-center gap-2">
                {dealModalMode === 'edit' && (
                  <>
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      disabled={isSavingDeal}
                      onClick={() => setConfirmLostOpen(true)}
                      sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                      Deal Lost
                    </Button>

                    <Button
                      type="button"
                      variant="contained"
                      color="success"
                      disabled={isSavingDeal}
                      onClick={() => performSaveDeal('Closed')}
                      sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                      Deal Closed
                    </Button>
                  </>
                )}

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
                    : dealModalMode === 'create'
                      ? 'Create Deal'
                      : 'Save Changes'}
                </Button>
              </Box>
            )}
          </DialogActions>
        )}
      </Dialog>

      <Dialog
        open={confirmLostOpen}
        onClose={() => setConfirmLostOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Confirm Deal as Lost
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to mark this deal as Lost? Once marked as Lost, no selling price will be recorded and this deal will become permanently read-only.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmLostOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLost}
            variant="contained"
            color="error"
            disabled={isSavingDeal}
          >
            Confirm & Mark as Lost
          </Button>
        </DialogActions>
      </Dialog>

      {/* Keep this as a  dialog so deal state is preserved. */}
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
