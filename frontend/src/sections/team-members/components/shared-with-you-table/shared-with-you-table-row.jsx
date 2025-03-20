import React, { useState } from 'react';

import {
  Box,
  Stack,
  Button,
  Tooltip,
  TableRow,
  Checkbox,
  MenuList,
  MenuItem,
  TableCell,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { AnimateLogo1 } from 'src/components/animate';
import { CustomPopover } from 'src/components/custom-popover';

export function SharedWithYouTeamMemberTableRow({ row, selected, onSelectRow, serialNumber }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleOpenConfirmDelete = () => {
    setConfirmDelete(true);
    handleClosePopover();
  };

  // Custom tooltips for specific rows
  const getFolderTooltip = (rowData) => {
    if (rowData.id === 'folder-0') {
      return `Folder Name: Client (A), ${rowData.folders_you_shared}`;
    }
    if (rowData.id === 'folder-4') {
      return `Folder Name: Main Folder' ${rowData.folders_you_shared}`;
    }

    return `Folder Name: ${rowData.folders_you_shared}`;
  };

  const getTooltip = (type, rowData) => {
    const tooltips = {
      folder: `Folder Name: ${rowData.folders_you_shared}`,
      sharedOn: `Folder Shared On: ${rowData.updatedAt} (UTC+05:30) Asia/Kolkata`,
      permission:
        row.permission === 'Write Access'
          ? 'Team members can upload email lists, start verification, and download verification reports. They cannot create new folders, delete folders, or remove email lists.'
          : 'Team members can only download verification reports.',
    };
    return tooltips[type];
  };

  /* Delete Success Snackbar */

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCloseConfirmDelete = () => {
    setConfirmDelete(false);
  };

  // LoadingButton
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <>
      {isAnimating && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#f1f7fb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999999999, // High z-index to cover the entire page
          }}
        >
          <AnimateLogo1
            sx={{
              zIndex: 99999999999, // High z-index to cover the entire page
            }}
          />
        </Box>
      )}
      <TableRow
        hover
        selected={selected}
        sx={{
          '&:hover .copy-button': {
            opacity: 1,
          },
        }}
      >
        {/* checkbox */}
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Select" arrow placement="top">
            <Checkbox
              checked={selected}
              onClick={onSelectRow}
              inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
            />
          </Tooltip>
        </TableCell>

        {/* Shared On */}
        <TableCell align="left">
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              width: '200px',
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Tooltip title={getTooltip('sharedOn', row)} arrow placement="top" disableInteractive>
              {row.createdAt}
            </Tooltip>
          </Stack>
        </TableCell>

        {/* Folders Shared By  */}
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack
              sx={{
                // color: '#078dee',
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
              }}
            >
              <Box
                component="span"
                sx={{
                  maxWidth: { xs: '530px', md: '800px' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Tooltip title={`Email: ${row.email}`} placement="top" arrow>
                  {row.email}
                </Tooltip>
              </Box>
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  maxWidth: {
                    xs: '250px', // For extra small screens
                    sm: '650px', // For small screens
                    md: '700px', // For medium screens
                    lg: '750px', // For large screens
                    xl: '950px', // For extra large screens
                  },
                  display: 'inline-block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <Tooltip title={getFolderTooltip(row)} placement="bottom" arrow>
                  {row.folders_you_shared}
                </Tooltip>
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        {/* Permission */}
        <TableCell align="left">
          <Stack sx={{ width: '200px' }}>
            <Box>
              <Tooltip
                title={getTooltip('permission', row)}
                arrow
                placement="top"
                disableInteractive
              >
                {row.permission}
              </Tooltip>
            </Box>
          </Stack>
        </TableCell>

        {/* Shared On */}
        <TableCell align="right">
          <Stack
            spacing={2}
            direction="row"
            justifyContent="flex-end" // Aligns content to the right
            sx={{ width: { xs: '200px', lg: '100%' } }} // Ensure Stack spans the full cell width
          >
            <Tooltip
              title="Click here to access folder(s) shared with you."
              arrow
              placement="top"
              disableInteractive
            >
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={isAnimating} // Optionally disable button during animation
                >
                  Access Now
                </Button>
              </Box>
            </Tooltip>
          </Stack>
        </TableCell>

      </TableRow>
      <CustomPopover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClosePopover}>
        <MenuList>
          <Tooltip title="Remove access to shared folders." arrow placement="left">
            <MenuItem onClick={handleOpenConfirmDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Remove Access
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>
    </>
  );
}
