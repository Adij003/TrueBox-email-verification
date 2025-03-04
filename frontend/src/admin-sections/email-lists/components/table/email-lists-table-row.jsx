import React, { useState } from 'react';

import {
  Box,
  Stack,
  Paper,
  Button,
  Drawer,
  Tooltip,
  TableRow,
  Checkbox,
  Collapse,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

import { DashboardChart } from '../chart/dashboard-chart';

export function EmailListTableRow({
  row,
  selected,
  onSelectRow,
  onOpenPopover,
  onEmailClick,
  onDownloadClick,
  onViewProcessingClick,
}) {
  const popover = usePopover();
  const collapse = useBoolean();
  const timezone = ', (UTC+05:30) Asia/Kolkata';
  const [dialog, setDialog] = useState({
    open: false,
    mode: '',
  });

  // Drawer functions
  const showAlert = (type, title, message) => {
    console.log(`Alert Type: ${type}, Title: ${title}, Message: ${message}`);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'unverified':
        return 'error';
      case 'processing':
        return 'info';
      // case 'canceled':
      // case 'canceled from admin panel':
      //   return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  const renderActionButtons = () => {
    switch (row.status) {
      case 'verified':
        return (
          <Tooltip title="Click here to download the report." arrow placement="top">
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              onClick={(e) => {
                e.stopPropagation();
                handleDrawerOpen();
                // onDownloadClick();
              }}
            >
              Download Report
            </Button>
          </Tooltip>
        );
      case 'processing':
        return (
          <Tooltip title="Click here to view details." arrow placement="top">
            <Button
              variant="outlined"
              // disabled
              color="primary"
              size="medium"
              sx={{ whiteSpace: 'nowrap' }}
              onClick={(e) => {
                e.stopPropagation();
                onViewProcessingClick();
              }}
            >
              Verification in Process
            </Button>
          </Tooltip>
        );
      default:
        return '-';
    }
  };

  const results = Object.entries(row.ListResult);

  const renderPrimary = (
    <>
      <TableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onChange={(event) => {
              event.stopPropagation();
              onSelectRow();
            }}
            inputProps={{ 'aria-labelledby': row.id }}
          />
        </TableCell>
        <TableCell>
          <Stack>
            <Box mb="5px">
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title="Status of the uploaded email list."
              >
                <Label
                  variant="soft"
                  color={getStatusColor(row.status)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {getStatusLabel(row.status)}
                </Label>
              </Tooltip>
            </Box>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Email List Uploaded at: ${row.Date}${timezone}.`}
            >
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px',
                  display: 'inline-block',
                }}
              >
                {row.Date}
              </Box>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" gap={2}>
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title={`Name of the email list uploaded by the Pabbly Customer: ${row.emailListName}.`}
              >
                <Box
                  component="span"
                  sx={{
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                    display: 'inline-block',
                  }}
                >
                  {row.emailListName}
                </Box>
              </Tooltip>
            </Box>
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`ID of the email list uploaded by the Pabbly Customer: ${row.id}.`}
            >
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100px',
                  display: 'inline-block',
                }}
              >
                {row.id}
              </Box>
            </Tooltip>
          </Box>
        </TableCell>
        <TableCell>
          <Tooltip
            arrow
            placement="top"
            disableInteractive
            title={`Email address of the Pabbly customer: ${row.accountEmail}.`}
          >
            <Box
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                onEmailClick(row);
              }}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '300px',
                display: 'inline-block',
              }}
            >
              {row.accountEmail}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Tooltip
            title="Name of the third-party email verification application whose API is used for verification of specific email list."
            placement="top"
            arrow
          >
            <Box
              component="span"
              sx={{
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '180px',
                display: 'inline-block',
              }}
            >
              {row.accountName === '' ? '-' : row.accountName}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
          {renderActionButtons()}
        </TableCell>
        <TableCell
          align="right"
          sx={{ px: 1, whiteSpace: 'nowrap' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Click to see options." arrow placement="top">
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={(event) => onOpenPopover(event)}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {/* <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: { xs: '100%', md: 600 }, p: 3 },
        }}
      >
        <Box>
          
          <DialogTitle sx={{ p: 2 }}>
            <Typography variant="h6">Download Verification Report</Typography>
            <Typography variant="body2" color="text.secondary" pb={3}>
              Verification details for <strong>{row.emailListName}</strong>
            </Typography>
            <IconButton
              onClick={handleDrawerClose}
              sx={{
                position: 'relative',
                right: 8,
                top: 8,
                color: 'text.secondary',
              }}
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </DialogTitle>
          <DashboardChart />
        </Box>
      </Drawer> */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: {
              xs: '100%',
              md: '600px',
            },
            p: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6">Verification Report</Typography>
            <Typography variant="h8">Check the full details of email verification here.</Typography>
          </Box>

          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <DashboardChart
          showAlert={showAlert}
          // handleAlertClose={handleAlertClose}
          title={row.emailListName}
          chart={{
            series: [
              { label: 'Deliverable Emails', value: 156454 },
              { label: 'Undeliverable Emails', value: 12244 },
              { label: 'Accept-all Emails', value: 43313 },
              { label: 'Unknown Emails', value: 53345 },
            ],
          }}
        />
      </Drawer>
    </>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {results.map(([key, value]) => (
              <Stack
                key={key}
                direction="row"
                gap={2}
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                  },
                }}
              >
                <Tooltip title="Access token of your WhatsApp Number" arrow placement="top">
                  <Box display="flex" gap="5px">
                    <Typography fontSize={14} fontWeight={600}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} Emails:
                    </Typography>
                    <Typography fontSize={14}>{value}</Typography>
                  </Box>
                </Tooltip>
              </Stack>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {renderSecondary}
    </>
  );
}

export default EmailListTableRow;
