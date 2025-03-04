import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Roles
const RolesManagementPage = lazy(() => import('src/pages/dashboard/roles/management'));
const RolesCreatePage = lazy(() => import('src/pages/dashboard/roles/create'));
const RolesEditPage = lazy(() => import('src/pages/dashboard/roles/edit'));
// Password Plolicy
const PasswordPolicyManagementPage = lazy(
  () => import('src/pages/dashboard/passwordPolicy/management')
);
// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const securityRoutes: RouteObject[] = [
  {
    path: 'security',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
      {
        path: 'users',
        children: [
          { index: true, element: <UserListPage /> },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
        ],
      },
      {
        path: 'roles',
        children: [
          { element: <RolesManagementPage />, index: true },
          { path: 'management', element: <RolesManagementPage /> },
          { path: 'create', element: <RolesCreatePage /> },
          { path: ':id/edit', element: <RolesEditPage /> },
        ],
      },
      {
        path: 'passwordPolicy',
        children: [
          { element: <PasswordPolicyManagementPage />, index: true },
          { path: 'management', element: <PasswordPolicyManagementPage /> },
        ],
      },
    ],
  },
];
