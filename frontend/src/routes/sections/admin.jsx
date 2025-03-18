import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { AdminLayout } from 'src/layouts/admin'; // You'll need to create this
import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const EmailLists = lazy(() => import('src/pages/admin/email-lists'));
const Settings = lazy(() => import('src/pages/admin/settings'));

const Activity = lazy(() => import('src/admin-sections/settings/activity-log'));

// ----------------------------------------------------------------------

const adminLayoutContent = (
  <AdminLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </AdminLayout>
);

export const adminRoutes = [
  {
    path: 'admin',
    element: CONFIG.auth.skip ? (
      <>{adminLayoutContent}</>
    ) : (
      <AuthGuard>{adminLayoutContent}</AuthGuard>
    ),
    children: [
      { element: <EmailLists />, index: true },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          { path: 'activity-log', element: <Activity /> },
        ],
      },
    ],
  },
];
