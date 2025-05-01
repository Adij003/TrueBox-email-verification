import dayjs from "dayjs";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function CreditTableRow({ row }) {

  const getStatusTooltip = (status) => {
    switch (status) {
      case 'Single Verification':
        return `Single email address was checked for verification.`;
      case 'Bulk Verification':
        return `Email list was uploaded and checked for verification.`;
      case 'Email Credits Purchased':
        return `Customer has purchased email credits for email verification`;
      default:
        return '';
    }
  };

  return (
    <TableRow hover>
      <TableCell width={300}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Tooltip
            arrow
            placement="top"
            disableInteractive
            title={getStatusTooltip(row.status, row.status)}
          >
            <Label variant="soft" color={row.credits === 'Alloted' ? 'success' : 'error'}>
              {row.status}
            </Label>
          </Tooltip>
        </Stack>
        <Stack spacing={2} direction="row" alignItems="center" mt="4px">
          <Tooltip
            arrow
            placement="top"
            disableInteractive
            title={`Action occurred at: ${row.createdAt}`}
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
               { row.amountAdded? ('Credits Added') : (row.email? row.email : row.emailListName)}
            </Box>
          </Tooltip>
        </Stack>
        <Stack spacing={2} direction="row" alignItems="center" mt="4px">
          <Tooltip
            arrow
            placement="top"
            disableInteractive
            title={`Created at  ${dayjs(row.createdAt).format("YYYY-MM-DD")}`}
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
               {row.createdAt ? dayjs(row.createdAt).format("YYYY-MM-DD") : dayjs(row.timestamp).format("YYYY-MM-DD")}
            </Box>
          </Tooltip>
        </Stack>
      </TableCell>
      <TableCell width={200}>
        <Stack spacing={1}>
          {' '}
          <Box
            component="span"
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title={
                (row.creditsConsumed >= 0)
                  ? 'Email credits alloted to the account.'
                  : `${row.type === 'single' ? 'Email address' : 'Email list'}: ${row.status}`
              }
            >
              {/* <span>{row.message}</span> */}
              <span>{row.amountAdded ? `Credits added` : row.message}</span>

            </Tooltip>
          </Box>
        </Stack>
        <Stack>
          <Box
            component="span"
            sx={{
              color: 'text.disabled',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
              fontSize: '0.875rem',
            }}
          >
            {(row.type === 'single') ? (
              <Tooltip arrow placement="top" disableInteractive title="Email address">
                <span>{row.result}</span>
              </Tooltip>
            ) : (
              <Tooltip
                arrow
                placement="top"
                disableInteractive
                title="Emails verified in this list"
              >
                <span>{row.amountAdded ? '' : `Emails verified: ${row.verified}`}</span>
              </Tooltip>
            )}
          </Box>
        </Stack>
      </TableCell>
      <TableCell width={140} align="right">
        <Tooltip
          arrow
          placement="top"
          disableInteractive
          title={`${row.credits === 'Alloted' ? `Email credits allotted to the account.` : `Email credits consumed for verifying email.`}`}
        >
          <Box
            component="span"
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
              display: 'inline-block',
            }}
          >
            {row.type === 'bulk' ? `-${row.verified}` : '-1'}
          </Box>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
