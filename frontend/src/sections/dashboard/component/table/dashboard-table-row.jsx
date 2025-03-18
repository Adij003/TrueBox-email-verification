import dayjs from 'dayjs';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

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
  Backdrop as MuiBackdrop,
} from '@mui/material';

import { checkBulkStatus, downloadBulkResults, startBulkVerification } from 'src/redux/slice/emailSlice';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { DashboardChart } from '../chart/dashboard-chart';

// Custom backdrop for transparent background
const CustomBackdrop = (props) => (
  <MuiBackdrop {...props} sx={{ backgroundColor: 'transparent' }} />
);

export function DashboardTableRow({
  onSelectRow,
  row,
  selected,
  dashboardTableIndex,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const csvfilesname = [{ name: row.emailListName, numberOfEmails: row.numberOfEmails }];
  const currentFile = csvfilesname[dashboardTableIndex % csvfilesname.length];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showAlert = (type, title, message) => {
    console.log(`Alert Type: ${type}, Title: ${title}, Message: ${message}`);
  };

  const handleAlertClose = () => {
    console.log('Alert closed');
  };

  const handleAction = () => {
    switch (row.status) {
      case 'pending':
      dispatch(startBulkVerification(row.jobId));
      setTimeout(() => {
        dispatch(checkBulkStatus(row.jobId));
      }, 1000);
        break;
      case 'completed':
        dispatch(downloadBulkResults(row.jobId));
        // setIsDrawerOpen(true);
        break;
      case 'verifying':
        dispatch(checkBulkStatus(row.jobId))
        break;
      case 'ready':
        // dispatch(startBulkVerification(row.jobId));
        dispatch(checkBulkStatus(row.jobId))

        break;
      case 'in-progress':
        dispatch(checkBulkStatus(row.jobId))
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
        return 'Start Verification';
      case 'pending':
        return 'Start Verification';
      case 'in-progress':
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
                row.status === 'processing'
                  ? ' Email list is currently under the verification process.'
                  : row.status === 'uploading'
                    ? 'Email list is currently being uploading.'
                    : row.status === 'Verified'
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
                {/* ({currentFile.numberOfEmails}) */}
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
            {/* <Tooltip
              title={<>Number of email addresses in the uploaded email list: ({currentFile.numberOfEmails})</>}
              arrow
              placement="top"
              disableInteractive
            > */}
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
                {row.creditsConsumed}  
              </Typography>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell width={300} align="right" sx={{ pr: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip
              title={
                row.status === 'processing'
                  ? 'Verification in progress. Please wait.'
                  : row.status === 'Verified'
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
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip
            title={
              row.status === 'processing' || row.status === 'uploading'
                ? 'Actions unavailable during verification'
                : 'Click for more options.'
            }
            arrow
            placement="top"
          />
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

        <DashboardChart
          showAlert={showAlert}
          handleAlertClose={handleAlertClose}
          title={currentFile.name}
          chart={{
            series: [
              { label: 'Deliverable Emails', value: 12244 },
              { label: 'Undeliverable Emails', value: 53345 },
              { label: 'Accept-all Emails', value: 44313 },
              { label: 'Unknown Emails', value: 78343 },
            ],
          }}
        />
      </Drawer>
    </>
  );

  return renderPrimary;
}
