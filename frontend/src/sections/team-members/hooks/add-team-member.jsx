import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  useMediaQuery,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { addTeamMember, getTeamDetails } from 'src/redux/slice/userSlice';

export function TeamMemberDialog({ open, onClose, currentMember, ...other }) {
  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up('sm'));
  const [selectedFolders, setSelectedFolders] = useState([]); // this is for folder
  const [email, setEmail] = useState(''); // this is for email
  const [emailError, setEmailError] = useState(false);
  const [autocompleteError, setAutocompleteError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [permissionType, setPermissionType] = useState(null); // this is for selecting write or read access
  const [categoryError, setCategoryError] = useState(false);

  const dispatch = useDispatch(addTeamMember());

  const folder = ['read', 'write'];
  const folders = [
    'Select All Folders',
    'Main Folder',
    'Folder 1',
    'Folder 2',
    'Folder 3',
  ];
  const folderOptions = folders.slice(1); // All folders except "Select All Folders"

  // Set initial values when currentMember changes
  useEffect(() => {
    if (currentMember) {
      setEmail(currentMember.email || '');
      // Split the folders string into an array if it contains multiple folders
      const folderArray = currentMember.folders_you_shared
        ? currentMember.folders_you_shared.split(',').map((f) => f.trim())
        : [];
      setSelectedFolders(folderArray);
      setPermissionType(currentMember.permission || null);
    }
  }, [currentMember]);

  const handleClose = () => {
    if (!currentMember) {
      setEmail('');
      setSelectedFolders([]);
      setPermissionType(null);
    }
    setEmailError(false);
    setAutocompleteError(false);
    setCategoryError(false);
    onClose();
  };

  const ALLOWED_EMAILS = [
    'hardik@pabbly.com',
    'kamal@gmail.com',
    'anand@gmail.com',
    'adi@gmail.com'
  ];

  const commonBoxStyle = { ml: '9px' };
  const commonTypographyStyle = { fontSize: '14px', color: 'grey.800', mt: 1, mb: 1, ml: '5px' };
  const commonUlStyle = { paddingLeft: '20px', color: 'grey.600', fontSize: '12px' };
  const commonLiStyle = {
    marginBottom: '8px',
    fontWeight: '500',
    listStyleType: 'disc',
    listStylePosition: 'outside',
    color: '#637381',
  };

  const isEmailValid = (email1) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email1);
  };

  const handleChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
    setEmailError(!value || !isEmailValid(value));
  };

  const handleChangeCategoryList = (event, newValue) => {
    setPermissionType(newValue);
    setCategoryError(!newValue);
  };

  const handleFolderSelection = (event, newValue) => {
    setAutocompleteError(false);

    // Check if "Select All Folders" is being added
    if (newValue.includes('Select All Folders')) {
      setSelectedFolders(folderOptions);
    }
    // Check if "Select All Folders" is being removed
    else if (
      selectedFolders.length === folderOptions.length &&
      newValue.length < folderOptions.length
    ) {
      setSelectedFolders([]);
    }
    // Normal selection
    else {
      setSelectedFolders(newValue.filter((item) => item !== 'Select All Folders'));
    }
  };

  const handleAdd = () => {
    let hasError = false;
    // Skip email validation when updating
    if (!currentMember) {
      if (!email || !isEmailValid(email)) {
        setEmailError(true);
        hasError = true;
      }

      // Check if email is in allowed list (only for new members)
      if (!ALLOWED_EMAILS.includes(email)) {
        toast.error(`This email is not registered!`, {
          style: {
            marginTop: '15px',
          },
        });
        return;
      }
    }

    // Validate folder selection
    if (selectedFolders.length === 0) {
      setAutocompleteError(true);
      hasError = true;
    }

    // Validate permissions
    if (!permissionType) {
      setCategoryError(true);
      hasError = true;
    }

    const teamMemberData = {
      email, 
      folders: selectedFolders, 
      permissionType
    }
    dispatch(addTeamMember(teamMemberData))
    dispatch(getTeamDetails())

    if (hasError) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        `${currentMember ? 'Team member updated successfully!' : 'Team member added successfully!'}`,
        {
          style: {
            marginTop: '15px',
          },
        }
      );
      handleClose();
      setIsLoading(false);
    }, 1200);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      {...other}
      PaperProps={isWeb ? { style: { minWidth: '600px' } } : { style: { minWidth: '330px' } }}
    >
      <DialogTitle sx={{ fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}>
        {currentMember ? 'Update Team Member' : 'Add Team Member'}
      </DialogTitle>
      <Divider sx={{ mb: '16px', borderStyle: 'dashed' }} />

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            autoFocus={!currentMember}
            fullWidth
            type="email"
            margin="dense"
            variant="outlined"
            label="Pabbly Account Email Address"
            placeholder="sample@example.com"
            value={email}
            onChange={handleChangeEmail}
            error={emailError}
            disabled={Boolean(currentMember)}
            helperText={
              emailError ? (
                email ? (
                  'Please enter a valid email address.'
                ) : (
                  'Email address is required.'
                )
              ) : (
                <span>
                  Ensure that the email address is already registered {' '}
                 
                </span>
              )
            }
          />

          <Autocomplete
            multiple
            options={folders}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Folder"
                placeholder="Select"
                error={autocompleteError}
                helperText={
                  autocompleteError ? (
                    'Please select at least one folder.'
                  ) : (
                    <span>
                      Select folders to be shared. Use &quot;Select All Folders&quot; to select all
                      at once.{' '}
                    </span>
                  )
                }
              />
            )}
            renderTags={(selected, getTagProps) =>
              selected.map(
                (option, index) =>
                  option !== 'Select All Folders' && (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      variant="soft"
                      color="primary"
                    />
                  )
              )
            }
            value={selectedFolders}
            onChange={handleFolderSelection}
          />

          <Autocomplete
            options={folder}
            value={permissionType}
            onChange={handleChangeCategoryList}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Access Type"
                error={categoryError}
                helperText={
                  categoryError ? (
                    'Please select a permission level.'
                  ) : (
                    <span>
                      Select the team member access type.{' '}
                      
                    </span>
                  )
                }
              />
            )}
          />

          {/* Points to Remember Section */}
          <Box sx={commonBoxStyle}>
            <Typography variant="subtitle1" sx={commonTypographyStyle}>
              Points To Remember
            </Typography>
            <ul style={commonUlStyle}>
              <li style={commonLiStyle}>
                <span>You can share multiple folders with team members.</span>
              </li>
              <li style={commonLiStyle}>
                <span>
                  Team members can be granted either &apos;Write&apos; or &apos;Read&apos; access.
                </span>
              </li>
              <li style={commonLiStyle}>
                <span>
                  &apos;Write&apos; access allows uploading email lists, starting verification, and
                  downloading reports but restricts folder and list management, while
                  &apos;Read&apos; access permits downloading reports only.
                </span>
              </li>
            </ul>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleAdd} disabled={isLoading} variant="contained" color="primary">
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : currentMember ? (
            'Update'
          ) : (
            'Add'
          )}
        </Button>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
