import { useState } from 'react';
import { useDispatch } from 'react-redux';

// MUI imports
import {
  Box,
  Stack,
  Button,
  Tooltip,
  Popover,
  Divider,
  MenuItem,
  TextField,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';

// Hooks

import { toast } from 'sonner';

import { fetchEmailLists } from 'src/redux/slice/emailSlice';

// Components
import { Iconify } from 'src/components/iconify';

// Constants
const BUTTON_STYLES = (isBelow600px) => ({
  fontSize: '15px',
  height: '48px',
  textTransform: 'none',
  padding: isBelow600px ? '0px 10px 0px 10px' : '16px',
});

// Folder structure data
const FOLDER_STRUCTURE = [
  'None',
  'Home',
  'Organization 1',
  'Organization 2',
  'Organization 3',
  'Organization 4',
  'Organization 5',
  'Organization 6',
  'Organization 7',
  'Organization 8',
  'Organization 9',
];

export function DashboardTableToolbar({ filters, numSelected, onApplyFilter, rowsPerPage }) {

  const isBelow600px = useMediaQuery('(max-width:600px)');

  // States
  const [anchorEl, setAnchorEl] = useState(null);

  const [moveFolderOpen, setMoveFolderOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [search, setSearch] = useState("")


  // Computed values
  const isActionsOpen = Boolean(anchorEl);

  // Handlers
  const handleFilterName = (event) => {
    const newSearchValue = event.target.value;
    filters.setState({ name: newSearchValue });
    setSearch(newSearchValue)
    onApplyFilter({search: newSearchValue})
    }

  const handleActionsOpen = (event) => setAnchorEl(event.currentTarget);
  const handleActionsClose = () => setAnchorEl(null);

  const dispatch = useDispatch();

const handleRefreshEmailList = () => {
  const tabValue = filters.state.status;
    if( tabValue === 'all'){
      dispatch(fetchEmailLists({ type: "bulk",
        limit: rowsPerPage
      }))
      toast.success(`Page Refreshed`, {
      duration: 1000,
        style: {
          marginTop: '15px',
          width: '13rem',
          marginLeft: '14rem'
        },
      });
    } else {
      dispatch(fetchEmailLists({
        type: "bulk",
        limit: rowsPerPage,
        status: tabValue
      }))
      toast.success(`Page Refreshed`, {
      duration: 1000,
        style: {
          marginTop: '15px',
          width: '13rem',
          marginLeft: '14rem'
        },
      });
    }
      
}

  const handleMoveToFolder = () => {
    setMoveFolderOpen(true);
    handleActionsClose();
  };

  const handleDelete = () => {
    setDeleteOpen(true);
    handleActionsClose();
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    setDeleteOpen(false);

    toast.success(`Email list(s) deleted successfully.`, {
      style: {
        marginTop: '15px',
      },
    });
  };

  // Render functions
  const renderSearchField = () => (
    <TextField
      fullWidth
      value={filters.state.name}
      onChange={handleFilterName}
      placeholder="Search by email list name..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />
  );

  const renderActionButton = () =>
    numSelected > 0 && (
      
        <Popover
          open={isActionsOpen}
          anchorEl={anchorEl}
          onClose={handleActionsClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Tooltip title="Move to folder" arrow placement="left">
            <MenuItem onClick={handleMoveToFolder}>
              <Iconify icon="fluent:folder-move-16-filled" sx={{ mr: 1 }} />
              Move to Folder
            </MenuItem>
          </Tooltip>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Tooltip title="Delete email lists" arrow placement="left">
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Tooltip>
        </Popover>     
      
    );

  return (
    <Stack
      spacing={1}
      alignItems="center"
      direction={isBelow600px ? 'column' : 'row'}
      sx={{ p: 2.5, width: '100%', gap: 1 }}
    >
      <Stack
        spacing={1}
        alignItems={isBelow600px ? 'end' : 'center'}
        direction={isBelow600px ? 'column' : 'row'}
        sx={{ width: '100%', gap: 1 }}
      >
        {renderSearchField()}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',

            justifyContent: 'flex-end',
          }}
        >
          {renderActionButton()}
        </Box>
        <Tooltip title="Click here to refresh data." arrow placement="top">
          <Button
            sx={{
              // ...buttonStyle,
              whiteSpace: 'nowrap',
              // width: isBelow600px ? '188px' : '188px',
            }}
            size="large"
            color="primary"
            onClick={handleRefreshEmailList}
          >
            <Iconify
              icon="tabler:refresh"
              sx={{ width: '24px', height: '24px', color: 'primary' }}
              cursor="pointer"
            />
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
