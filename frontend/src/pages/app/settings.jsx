import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/app';

import { Iconify } from 'src/components/iconify';
import CustomTabs from 'src/components/custom-tabs/custom-tabs';

// ----------------------------------------------------------------------
const metadata = { title: `Settings | ${CONFIG.site.name}` };

export default function Page() {
  const EXAMPLE_TABS = [
    {
      value: 'credits',
      path: '/app/settings/credits',
      icon: <Iconify icon="icons8:tasks" width={24} />,
      label: 'Credits Summary',
      tooltip: 'Click to view credit summary.',
      pageTitle: 'Credits Summary',
      pageSubheading: 'View a summary of your email verification credits. ',
      link: 'https://forum.pabbly.com/threads/credits-summary.26312/',
    },
    {
      value: 'team-members',
      path: '/app/settings/team-members',
      icon: <Iconify icon="fluent:people-team-28-filled" width={24} />,
      label: 'Team Members',
      tooltip: 'Add team members and share folder(s) access with them.',
      pageTitle: 'Team Members',
      pageSubheading: 'Add team members and share folder(s) access with them from here. ',
      link: 'https://forum.pabbly.com/threads/team-members.26323/',
    },

    {
      value: 'timzone',
      path: '/app/settings/timezone',
      icon: <Iconify icon="ri:time-zone-fill" width={24} />,
      label: 'Time Zone',
      tooltip: 'View and manage the time zone settings of your account.',
      pageTitle: 'Time Zone',
      pageSubheading: 'Manage your account time zone settings. ',
      link: 'https://forum.pabbly.com/threads/time-zone.26314/',
    },
  ];
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent maxWidth="xl">
        <CustomTabs
          tabs={EXAMPLE_TABS}
          defaultTab="timezone"
          defaultPath="/app/settings/timezone"
          dashboardContentProps={{ maxWidth: 'xl' }}
        />
      </DashboardContent>
    </>
  );
}
