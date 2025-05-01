import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Button, Tooltip, Typography, useMediaQuery } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/app';
import { listItems } from 'src/_mock/app-big-card/_getHelpBigCardListItems';

import BigCard from 'src/components/app-big-card/big-card';
import PageHeader from 'src/components/page-header/page-header';

const { items, style } = listItems;

// ----------------------------------------------------------------------

const metadata = { title: `Get Help | TrueBox Email Verification` };

export default function GetHelp({ sx, icon, title, total, color = 'warning', ...other }) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dialog = useBoolean();
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <PageHeader
            title="Help!!"
            Subheading="Tell us about your problem, and we’ll find you a solution."
            link_added="https://forum.pabbly.com/threads/help-tutorials.26324/"
          />
        </Box>
        <BigCard
          getHelp={false}
          isVideo={false}
          bigcardtitle="Points To Remember!"
          style={style}
          items={items}
          thumbnailName="get-help-photo.png"
          learnMoreLink='https://forum.pabbly.com/threads/help-tutorials.26324/'
          keyword="Note:"
          action={
            <Tooltip
              title="If you have any questions, you can ask directly from here."
              arrow
              placement="top"
              disableInteractive
            >
              {/* <Button
                startIcon={
                  <Iconify
                    icon="heroicons:plus-circle-16-solid"
                    style={{ width: 18, height: 18 }}
                  />
                }
                sx={{ mt: 1 }}
                variant="outlined"
                color="primary"
                size="large"
                component="a"
                href="https://forum.pabbly.com/#pabbly-email-verification.38"
                target="_blank"
              >
                Ask Question
              </Button> */}
            </Tooltip>
          }
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            // justifyContent: 'space-between',
            mt: 3,
          }}
        >
          <Typography variant="h4" sx={{marginLeft: 2}}>Contact Us</Typography>
          <Tooltip
            title="Click here to directly mail TechBox support."
            arrow
            placement="top"
          >
            <Button
              component="a"
              href="mailto:jainadi1717@gmail.com?subject=Require assistance in TrueBox Email Verification"
              sx={{ mt: isMobile ? 2 : 0, marginLeft: 2}}
              size="large"
              variant="outlined"
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mail us
            </Button>

          </Tooltip>
        </Box>

        {/* Table */}
      </DashboardContent>
    </>
  );
}
