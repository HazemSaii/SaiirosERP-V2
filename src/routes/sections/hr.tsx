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
// locations
const LocationsManagementPage = lazy(() => import('src/pages/hr/locations/management'));
const LocationsEditpage = lazy(() => import('src/pages/hr/locations/edit'));
const LocationsCreatepage = lazy(() => import('src/pages/hr/locations/create'));
// job families
const JobFamiliesManagementPage = lazy(() => import('src/pages/hr/job families/management'));
const JobFamiliesCreatePage = lazy(() => import('src/pages/hr/job families/create'));
const JobesFamiliesEditView = lazy(() => import('src/pages/hr/job families/edit'));
// jobs
const JobsManagementPage = lazy(() => import('src/pages/hr/jobs/management'));
const JobsCreatePage = lazy(() => import('src/pages/hr/jobs/create'));
const JobsEditPage = lazy(() => import('src/pages/hr/jobs/edit'));

// Organizations
const OrganizationsManagementPage = lazy(() => import('src/pages/hr/organizations/management'));
const OrganizationsEditpage = lazy(() => import('src/pages/hr/organizations/edit'));
const OrganizationsCreatepage = lazy(() => import('src/pages/hr/organizations/create'));

// Grades
const GradesManagementPage = lazy(() => import('src/pages/hr/grades/management'));
const GradesCreatePage = lazy(() => import('src/pages/hr/grades/create'));
const GradesEditPage = lazy(() => import('src/pages/hr/grades/edit'));
// Positions
const PositionsManagementPage = lazy(() => import('src/pages/hr/positions/management'));
const PositionsCreatePage = lazy(() => import('src/pages/hr/positions/create'));
const PositionsEditPage = lazy(() => import('src/pages/hr/positions/edit'));
// Grade Rates
const GradeRatesManagementPage = lazy(() => import('src/pages/hr/gradeRates/management'));
const GradeRatesCreatePage = lazy(() => import('src/pages/hr/gradeRates/create'));
const GradeRatesEditPage = lazy(() => import('src/pages/hr/gradeRates/edit'));
// personManagement
const PersonManagementPage = lazy(() => import('src/pages/hr/personManagement/management'));
const PersonCreatePage = lazy(() => import('src/pages/hr/personManagement/create'));
const PersonNewPage = lazy(() => import('src/pages/hr/personManagement/new'));
const PersonCorrectPage = lazy(() => import('src/pages/hr/personManagement/correct'));
const PersonUpdatePage = lazy(() => import('src/pages/hr/personManagement/update'));
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

export const humanResourseRoutes: RouteObject[] = [
  {
    path: 'hr',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { path: '', element: <IndexPage />, index: true },
      {
        path: 'locations',
        children: [
          { element: <LocationsManagementPage />, index: true },
          { path: 'new', element: <LocationsCreatepage /> },
          { path: ':id/edit', element: <LocationsEditpage /> },
        ],
      },
      {
        path: 'jobFamilies',
        children: [
          { element: <JobFamiliesManagementPage />, index: true },
          { path: 'new', element: <JobFamiliesCreatePage /> },

          { path: ':id/edit', element: <JobesFamiliesEditView /> },
        ],
      },
      {
        path: 'jobs',
        children: [
          { element: <JobsManagementPage />, index: true },
          { path: 'new', element: <JobsCreatePage /> },

          { path: ':id/edit', element: <JobsEditPage /> },
        ],
      },
      {
        path: 'organizations',
        children: [
          { element: <OrganizationsManagementPage />, index: true },
          { path: 'new', element: <OrganizationsCreatepage /> },

          { path: ':id/edit', element: <OrganizationsEditpage /> },
        ],
      },
      {
        path: 'grades',
        children: [
          { element: <GradesManagementPage />, index: true },
          { path: 'new', element: <GradesCreatePage /> },
          { path: ':id/edit', element: <GradesEditPage /> },
        ],
      },
      {
        path: 'gradeRates',
        children: [
          { element: <GradeRatesManagementPage />, index: true },
          { path: 'new', element: <GradeRatesCreatePage /> },
          { path: ':id/edit', element: <GradeRatesEditPage /> },
        ],
      },
      {
        path: 'positions',
        children: [
          { element: <PositionsManagementPage />, index: true },
          { path: 'new', element: <PositionsCreatePage /> },
          { path: ':id/edit', element: <PositionsEditPage /> },
        ],
      },
      {
        path: 'personManagement',
        children: [
          { element: <PersonManagementPage />, index: true },
          { path: 'hire', element: <PersonCreatePage /> },
          { path: 'new', element: <PersonNewPage /> },
          { path: ':id/details', element: <PersonCorrectPage /> },
          { path: ':id/update', element: <PersonUpdatePage /> },
        ],
      },
    ],
  },
];
