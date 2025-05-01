import dayjs from 'dayjs';
import { toast } from 'sonner';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  Box,
  Link,
  Drawer,
  Tooltip,
  Checkbox,
  IconButton,
  Typography,
} from '@mui/material';

import { fetchCredits } from 'src/redux/slice/creditSlice';
import { checkBulkStatus, fetchEmailLists, downloadBulkResults,  startBulkVerification } from 'src/redux/slice/emailSlice';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

export function DashboardTableRow({
  onSelectRow,
  row,
  selected,
  dashboardTableIndex,
}) {
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const csvfilesname = [{ name: row.emailListName, numberOfEmails: row.numberOfEmails }];
  const currentFile = csvfilesname[dashboardTableIndex % csvfilesname.length];
  const dispatch = useDispatch();

  const { isSuccess} = useSelector((state) => state.emailVerification);
  

  const handlePending = (jobId) => {
    dispatch(checkBulkStatus(jobId));

    dispatch(startBulkVerification(jobId));

      setTimeout(() => {
    dispatch(checkBulkStatus(jobId));
    dispatch(fetchEmailLists(
      { type: "bulk",
        limit: 5,
      }
    )
  )
    dispatch(fetchCredits())
  }, 2000); 
  if(isSuccess) {
  toast.success(`Bulk verification started, status will refresh automatically in 2 seconds`, {
    duration: 2000,
      style: {
        marginTop: '15px',
        width: '22rem',
        marginLeft: '2rem'
      },
    });
  }
  };
  
  const handleCompleted = (jobId) => {
    dispatch(downloadBulkResults(jobId));
  };
  
  const handleVerifying = (jobId) => {
    dispatch(checkBulkStatus(jobId));

    if(isSuccess) {
      toast.success(`Checking..`, {
        duration: 1000,
          style: {
            marginTop: '15px',
            width: '13rem',
            marginLeft: '14rem'
          },
        });
      }
      dispatch(fetchEmailLists(
        { type: "bulk",
          limit: 5,
          status: "verifying"
        }
      ))
      dispatch(fetchCredits())

  };
  
  const handleReady = (jobId) => {
    dispatch(checkBulkStatus(jobId));
    if(isSuccess) {
      toast.success(`Checking..`, {
        duration: 1000,
          style: {
            marginTop: '15px',
            width: '13rem',
            marginLeft: '14rem'
          },
        });
      }

    setTimeout(() => {
      dispatch(checkBulkStatus(jobId));
      dispatch(fetchEmailLists(
        { type: "bulk",
          limit: 5,
          status: "ready"
        }
      ))

    }, 1000); 
    
    dispatch(fetchCredits())

  };
  
  const handleInProgress = (jobId) => {
    dispatch(checkBulkStatus(jobId));
    if(isSuccess) {
      toast.success(`Checking..`, {
        duration: 1000,
          style: {
            marginTop: '15px',
            width: '13rem',
            marginLeft: '14rem'
          },
        });
      }
    setTimeout(() => {
      dispatch(checkBulkStatus(jobId));
      dispatch(fetchEmailLists(
        { type: "bulk",
          limit: 5
        }
      ))
    }, 1000); 
    dispatch(fetchCredits())
  };
  
  const handleAction = () => {
    switch (row.status) {
      case 'pending':
        handlePending(row.jobId);
        break;
      case 'completed':
        handleCompleted(row.jobId);
        break;
      case 'verifying':
        handleVerifying(row.jobId);
        break;
      case 'ready':
        handleReady(row.jobId);
        break;
      case 'in_progress':
        handleInProgress(row.jobId);
        break;
      default:
        break;
    }
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'ready':
        return 'info';
      case 'pending':
        return 'warning';
      case 'in-process':
        return 'error';
      default:
        return 'default';
    }
  };

  // Button text mapping
  const getButtonText = (status) => {
    switch (status) {
      case 'completed':
        return 'Download Report';
      case 'verifying':
        return 'Check Status';
      case 'ready':
        return 'Check Status';
      case 'pending':
        return 'Start Verification';
      case 'in_progress':
       return 'Check Status';
      default:
        return '';
    }
  };

  const renderPrimary = (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Select" arrow placement="top">
            <Checkbox
              checked={selected}
              onClick={onSelectRow}
              inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
            />
          </Tooltip>
        </TableCell>
        <TableCell width={400}>
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Tooltip
              title={
                row.status === 'verifying'
                  ? ' Email list is currently under the verification process.'
                  : row.status === 'pending'
                    ? 'Email list is uploaded but verification not started'
                    : row.status === 'completed'
                      ? 'Verification for the email list is done.'
                      : ' Email list has been uploaded but verification has not yet started.'
              }
              arrow
              placement="top"
              disableInteractive
            >
              <Label variant="soft" color={getStatusColor(row.status)}>
                {row.status} 
              </Label>
            </Tooltip>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            <Tooltip
              title={
                <>
                  Email List Name: {currentFile.name} 
                  {/* ({currentFile.numberOfEmails}) */}
                </>
              }
              arrow
              placement="top"
              disableInteractive
            >
              <Typography
                component="span"
                fontSize={14}
                sx={{
                  mt: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                }}
              >
                {currentFile.name} 
              </Typography>
            </Tooltip>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={`Email List Uploaded: ${dayjs(row.createdAt).format("YYYY-MM-DD")}`}
            >
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                  display: 'inline-block',
                }}
              >
                {dayjs(row.createdAt).format("YYYY-MM-DD")} 
              </Box>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell width={400}>
          <Stack spacing={2} direction="row" alignItems="center">
            <Tooltip title='Number of credits consumed' arrow placement='top' disableInteractive>
              <Typography
                component="span"
                fontSize={14}
                sx={{
                  mt: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                }}
              >
               Credits Consumed: {row.verified}  
              </Typography>
              
            </Tooltip>
          </Stack>
          <Stack spacing={2} direction="row" alignItems="center">
            <Tooltip
              title={
                <>
                  Contains {row.total} emails
                </>
              }
              arrow
              placement="top"
              disableInteractive
            >
              <Typography
                component="span"
                fontSize={14}
                sx={{
                  color: 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '300px',
                  display: 'inline-block',
                }}
              >
              {
                row.total
                  ? `Contains ${row.total} emails`
                  : "Click on Start Verification to get email count"
              }
              </Typography>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell width={300} align="right" sx={{ pr: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip
              title={
                row.status === 'verifying'
                  ? 'Verification in progress. Please wait.'
                  : row.status === 'completed'
                    ? 'Click to download report.'
                    : 'Click to start verification.'
              }
              arrow
              placement="top"
              disableInteractive
            >
      
                <Button variant="outlined" color="primary" onClick={handleAction}>
                  {getButtonText(row.status)}
                </Button>
             
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
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
            <Typography variant="h6">
              {/* {row.status === 'completed' ? 'Verification Report' : 'Verification Progress'} */}
              Verification Report
            </Typography>
            <Typography variant="h8">
              <span>
                Check the full details of email verification here.{' '}
                <Link
                  href="https://forum.pabbly.com/threads/verification-report.26340/"
                  style={{ color: '#078DEE' }}
                  underline="always"
                  target="_blank"
                >
                  Learn more
                </Link>
              </span>
            </Typography>
          </Box>

          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );

  return renderPrimary;
}
