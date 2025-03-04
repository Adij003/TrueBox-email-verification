import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import {
  Divider,
  Tooltip,
  TextField,
  Autocomplete,
  useMediaQuery,
  DialogContent,
} from '@mui/material';

export function MoveToFolderPopover({ title, content, action, open, onClose, ...other }) {
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));

  const [categoryList, setCategoryList] = useState('');
  const [categoryError, setCategoryError] = useState(false);

  const handleChangeCategoryList = useCallback((event, value) => {
    setCategoryList(value);
    if (value) {
      setCategoryError(false);
    }
  }, []);

  const folder = [
    'Home (0)',
    'Magnet Brains (2)',
    'Pabbly Hook (5)',
    'Pabbly Connect (10)',
    'Pabbly Subcription Billing (0)',
    'Pabbly Admin (50)',
    'Pabbly Chatflow (2)',
    'Pabbly Form Builder (0)',
    'Pabbly Email Marketing (2)',
    'Pabbly Plus (4)',
  ];

  const handleAdd = () => {
    if (!categoryList) {
      setCategoryError(true); // Show error if no folder is selected
      return;
    }

    onClose();
    toast.success(`The email list moved successfully.`, {
      style: {
        marginTop: '15px',
      },
    });
  };

  const handleDialogClose = () => {
    // Reset the Snackbar state when the dialog is closed
    setCategoryList(''); // Reset category list on close
    setCategoryError(false); // Reset error state on close
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      {...other}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle
        sx={{ fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}
        onClick={() => {}}
      >
        Move To Folder{' '}
      </DialogTitle>
      <Divider sx={{ mb: '16px', borderStyle: 'dashed' }} />

      <DialogContent>
        <Autocomplete
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '14px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
            },
            mt: 1.2,
          }}
          options={folder}
          value={categoryList} // Set the value of Autocomplete
          onChange={handleChangeCategoryList}
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                <Tooltip
                  title="Select folder to which the list needs to be moved."
                  arrow
                  placement="top"
                >
                  <span>Select Folder</span>
                </Tooltip>
              }
              helperText={
                <span>
                  {categoryError ? (
                    'Please select a required folder.'
                  ) : (
                    <>
                      Select the folder where you want to move the list.{' '}
                      <Link
                        href="https://forum.pabbly.com/threads/folders.20987/"
                        style={{ color: '#078DEE' }}
                        underline="always"
                      >
                        Learn more
                      </Link>
                    </>
                  )}
                </span>
              }
              error={categoryError}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        {action}
        <Button onClick={handleAdd} variant="contained" color="primary">
          Move
        </Button>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
