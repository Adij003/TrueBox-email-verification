import { toast } from 'sonner';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Helmet } from 'react-helmet-async';

import {
  Box,
  Link,
  Grid,
  Button,
  Dialog,
  Popover,
  Tooltip,
  Divider,
  MenuList,
  MenuItem,
  Typography,
  DialogTitle,
  useMediaQuery,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/app';
import { listItems } from 'src/_mock/app-big-card/_dashboardBigCardListItems';

import { Iconify } from 'src/components/iconify';
import BigCard from 'src/components/app-big-card/big-card';
// import StatsCards from 'src/components/stats-card/stats-card';
import PageHeader from 'src/components/page-header/page-header';

import Upload from 'src/sections/dashboard/component/upload/upload-file';
import { DashboardTable } from 'src/sections/dashboard/component/table/dashboard-table';
import { FolderSection } from 'src/sections/dashboard/component/folder/dashboardfolder';
import CreditStatsCards from 'src/sections/dashboard/component/stats-cards/credit-stats-cards';
import VerifySingleEmail from 'src/sections/dashboard/component/verify-single-email/verify-single-email';
import { DashboardTrashTable } from 'src/sections/dashboard/component/dashboard-trash-table/dashboard-trash-table';

const metadata = { title: `Dashboard | Pabbly Email Verification` };
const { items, style } = listItems;

export default function Page() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [email, setEmail] = useState('');
  const [activeTable, setActiveTable] = useState('dashboard');
  const [selectedFolder, setSelectedFolder] = useState('Home');
  const [isFromSingleEmail, setIsFromSingleEmail] = useState(false);

  const [alertState, setAlertState] = useState({
    open: false,
    severity: 'success',
    title: '',
    message: '',
    status: '',
  });

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  const handleTrashClick = () => {
    setActiveTable('trash');
  };

  const handleHomeClick = () => {
    setActiveTable('dashboard');
    setSelectedFolder('Home');
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleVerify = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsFromSingleEmail(true);

    if (emailRegex.test(email)) {
      toast.success(`The email "${email}" is valid!`, {
        duration: Infinity,
        style: {
          marginTop: '15px',
        },
      });
    } else {
      toast.error(`The email "${email}" is invalid!`, {
        duration: Infinity,
        style: {
          marginTop: '15px',
        },
      });
    }
    setEmail('');
  };

  // function calculateStats(allottedCredits, consumedCredits) {
  //   const remainingCredits = allottedCredits - consumedCredits;
  //   return {
  //     allotted: allottedCredits,
  //     consumed: consumedCredits,
  //     remaining: remainingCredits,
  //   };
  // }

  // const allottedCredits = 10000;
  // const consumedCredits = 32;

  // const stats = calculateStats(allottedCredits, consumedCredits);

  const [dialogState, setDialogState] = useState({
    singleEmail: false,
    bulkEmail: false,
  });

  const handleMenuItemClick = (type) => {
    setDialogState((prev) => ({
      ...prev,
      [type]: true,
    }));
    if (type !== 'singleEmail') {
      setIsFromSingleEmail(false);
    }
    handlePopoverClose();
  };

  const handleDialogClose = (type) => {
    setDialogState((prev) => ({
      ...prev,
      [type]: false,
    }));
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardContent maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'flex-start', lg: 'center' },
            justifyContent: 'space-between',
            mb: 0,
          }}
        >
          <PageHeader
            title="Dashboard"
            Subheading="Verify and manage all your email lists in one place with the Pabbly Email Verification Dashboard. "
            link_added="https://forum.pabbly.com/threads/dashboard.26311/"
          />
          <Tooltip
            title="Click to verify single or bulk email addresses."
            arrow
            placement="top"
            disableInteractive
          >
            <Button
              sx={{ mt: { xs: 1, lg: 0 } }}
              startIcon={<Iconify icon="heroicons:plus-circle-16-solid" />}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={handlePopoverOpen}
              color="primary"
              variant="contained"
              size="large"
            >
              Verify Email
            </Button>
          </Tooltip>
        </Box>
        <Box marginTop={5}>
          <CreditStatsCards />
        </Box>
        {/* <Box
          width="100%"
          sx={{
            mt: '40px',
            mb: '24px',
            gap: 3,
            display: 'grid',
            flexWrap: 'wrap',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
          }}
        >
          <StatsCards
            cardtitle="Email Credits Consumed"
            cardstats={stats.consumed}
            icon_name="Processed.svg"
            icon_color="#10CBF3"
            bg_gradient="#10CBF3"
            tooltipTittle="Number of emails credits consumed by your account."
          />
          <StatsCards
            cardtitle="Email Credits Remaining"
            cardstats={stats.remaining}
            icon_name="Complete.svg"
            icon_color="#1D88FA"
            bg_gradient="#1D88FA"
            tooltipTittle="Number of emails credits remaining in your account."
          />
          <StatsCards
            cardtitle="Total Number of Email Lists"
            cardstats="100"
            icon_name="list.svg"
            icon_color="#28a645"
            bg_gradient="#28a645"
            tooltipTittle="Number of email lists uploaded in your account."
          />
        </Box> */}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <FolderSection onHomeClick={handleHomeClick} onTrashClick={handleTrashClick} />
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <BigCard
              tooltip="View file upload guidelines for email verification."
              getHelp={false}
              isVideo
              bigcardtitle="Verification Guidelines"
              bigcardsubtitle="Please adhere to the following guidelines when uploading your CSV file:"
              style={style}
              items={items}
              videoLink="https://www.youtube.com/embed/MIcaDmC_ngM?si=EJ1SGtn0tdF96b1y"
              thumbnailName="email-verication-video-thumbnail.jpg"
              keyword="Note:"
              learnMoreLink="https://forum.pabbly.com/threads/dashboard.26311/"
              bigcardNote="All data and reports older than 15 days will be permanently removed automatically. For reference, you can Download Sample File to guide you in formatting your data correctly."
              action={
                <Tooltip
                  title="Click to verify single or bulk email addresses."
                  arrow
                  placement="top"
                  disableInteractive
                >
                  <Button
                    startIcon={<Iconify icon="heroicons:plus-circle-16-solid" />}
                    endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    onClick={handlePopoverOpen}
                    color="primary"
                    variant="outlined"
                    size="large"
                  >
                    Verify Email
                  </Button>
                </Tooltip>
              }
            />
            <Box sx={{ mt: 3 }}>
              {activeTable === 'trash' ? (
                <DashboardTrashTable />
              ) : (
                <DashboardTable selectedFolder={selectedFolder} />
              )}
            </Box>
          </Grid>
        </Grid>
      </DashboardContent>

      <Dialog
        open={dialogState.singleEmail}
        onClose={() => handleDialogClose('singleEmail')}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 'sm',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <VerifySingleEmail
            onVerify={() => {
              handleVerify();
              handleDialogClose('singleEmail');
            }}
            email={email}
            setEmail={setEmail}
            onClose={() => handleDialogClose('singleEmail')}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogState.bulkEmail} onClose={() => handleDialogClose('bulkEmail')} fullWidth>
        <DialogTitle display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Verify Bulk Email List</Typography>
            <Typography mt="4px" fontSize="14px" color="text.secondary">
              Upload email list for bulk verification. Download{' '}
              <Link href="src/assets/sample-files/sample_csv.csv" download underline="always">
                sample file
              </Link>{' '}
              here.
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Upload setAlertState={setAlertState} />
        </DialogContent>
        <DialogActions>
          <Box
            sx={{
              mt: 1,
              pt: 0,
              gap: 1,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="contained" color="primary">
              Upload
            </Button>
            <Button onClick={() => handleDialogClose('bulkEmail')} variant="outlined">
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuList>
          <Tooltip
            title="Click to verify a single email."
            arrow
            placement="left"
            disableInteractive
          >
            <MenuItem onClick={() => handleMenuItemClick('singleEmail')}>
              Verify Single Email
            </MenuItem>
          </Tooltip>
          <Tooltip title="Click to verify bulk emails." arrow placement="left" disableInteractive>
            <MenuItem onClick={() => handleMenuItemClick('bulkEmail')}>Verify Bulk Emails</MenuItem>
          </Tooltip>
        </MenuList>
      </Popover>
    </>
  );
}
