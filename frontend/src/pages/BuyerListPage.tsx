import { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add,
  DeleteOutlined,
  EditOutlined,
  RestartAlt,
  Search,
  VisibilityOutlined,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';

import { useAuth } from '../context';
import { ROLES } from '../constants/roles';
import {
  BUYER_DIALOG_MODES,
  BUYER_MESSAGES,
  BUYER_TABLE_PAGE_SIZE_OPTIONS,
  BUYER_DEFAULT_PAGE_SIZE,
  type BuyerDialogMode,
} from '../constants/buyers';
import { getAllBuyersApi, type BuyerItem } from '../api/buyersApi';
import { BuyerDialog } from '../component/buyers/BuyerDialog';

export function BuyerListPage() {
  const { user } = useAuth();
  const isAgent = user?.role === ROLES.AGENT;

  const [buyers, setBuyers] = useState<BuyerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [dialogMode, setDialogMode] = useState<BuyerDialogMode | null>(null);
  const [selectedItem, setSelectedItem] = useState<BuyerItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    let isMounted = true;

    const fetchBuyers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllBuyersApi();
        if (isMounted) {
          setBuyers(data);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setToastSeverity('error');
          setToastMessage(
            error instanceof Error ? error.message : 'Failed to load buyers.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchBuyers();

    return () => {
      isMounted = false;
    };
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const filteredBuyers = buyers.filter((buyer) => {
    if (!query) return true;
    return (
      buyer.name.toLowerCase().includes(query) ||
      buyer.email.toLowerCase().includes(query)
    );
  });

  const openCreate = () => {
    setSelectedItem(null);
    setDialogMode(BUYER_DIALOG_MODES.CREATE);
  };

  const openView = (buyer: BuyerItem) => {
    setSelectedItem(buyer);
    setDialogMode(BUYER_DIALOG_MODES.VIEW);
  };

  const openEdit = (buyer: BuyerItem) => {
    setSelectedItem(buyer);
    setDialogMode(BUYER_DIALOG_MODES.EDIT);
  };

  const openDelete = (buyer: BuyerItem) => {
    setSelectedItem(buyer);
    setDialogMode(BUYER_DIALOG_MODES.DELETE);
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedItem(null);
  };

  const handleSuccess = (item?: BuyerItem) => {
    if (!item) return;

    if (dialogMode === BUYER_DIALOG_MODES.CREATE) {
      setBuyers((prev) => [item, ...prev]);
      setToastMessage(BUYER_MESSAGES.SUCCESS_CREATED(item.name));
    } else if (dialogMode === BUYER_DIALOG_MODES.EDIT) {
      setBuyers((prev) =>
        prev.map((b) => (b.id === item.id ? item : b)),
      );
      setToastMessage(BUYER_MESSAGES.SUCCESS_UPDATED(item.name));
    } else if (dialogMode === BUYER_DIALOG_MODES.DELETE) {
      setBuyers((prev) => prev.filter((b) => b.id !== item.id));
      setToastMessage(BUYER_MESSAGES.SUCCESS_DELETED(item.name));
    }

    setToastSeverity('success');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const columns: GridColDef<BuyerItem>[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: isAgent ? 140 : 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams<BuyerItem>) => (
        <Box className="flex items-center gap-1">

          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => openView(params.row)}
              sx={{
                color: '#64748b',
                '&:hover': { color: '#2563eb', backgroundColor: '#eff6ff' },
              }}
            >
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>


          {isAgent && (
            <>
              <Tooltip title="Edit Buyer">
                <IconButton
                  size="small"
                  onClick={() => openEdit(params.row)}
                  sx={{
                    color: 'primary.main',
                    '&:hover': { backgroundColor: '#eff6ff' },
                  }}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Buyer">
                <IconButton
                  size="small"
                  onClick={() => openDelete(params.row)}
                  sx={{
                    color: '#ef4444',
                    '&:hover': { backgroundColor: '#fef2f2' },
                  }}
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Full Name',
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: 'email',
      headerName: 'Email Address',
      flex: 2,
      minWidth: 220,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      flex: 1.2,
      minWidth: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams<BuyerItem>) => (
        <Typography variant="body2" className="!text-slate-600">
          {params.row.createdBy?.name ?? '—'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Registered Date',
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<BuyerItem>) => (
        <Typography variant="body2" className="!text-slate-500">
          {new Date(params.row.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Typography>
      ),
    },
  ];

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
              {BUYER_MESSAGES.TITLE}
            </Typography>
            <Typography variant="body1" className="!mt-1 !text-slate-500">
              {BUYER_MESSAGES.SUBTITLE}
            </Typography>
          </Box>

          {isAgent && (
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
              {BUYER_MESSAGES.ADD_BUTTON}
            </Button>
          )}
        </Box>

        <Box
          className="mb-6 rounded-xl border border-slate-200 bg-white p-4"
          sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <Box className="flex flex-wrap gap-3">
            <TextField
              size="small"
              placeholder={BUYER_MESSAGES.SEARCH_PLACEHOLDER}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-[260px] flex-1"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-slate-400" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RestartAlt />}
              onClick={handleClearSearch}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>


        <Box
          className="rounded-xl border border-slate-200 bg-white p-2"
          sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <DataGrid
            rows={filteredBuyers}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            pageSizeOptions={[...BUYER_TABLE_PAGE_SIZE_OPTIONS]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: BUYER_DEFAULT_PAGE_SIZE,
                },
              },
            }}
            autoHeight
            disableRowSelectionOnClick
            rowHeight={64}
          />
        </Box>
      </Container>


      <BuyerDialog
        open={dialogMode !== null}
        mode={dialogMode}
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
  );
}
