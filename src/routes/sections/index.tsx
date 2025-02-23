import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';
import { securityRoutes } from './security';
import { Navigate } from 'react-router';
import { CONFIG } from 'src/global-config';
// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));
const LoginPage = lazy(() => import('src/pages/auth/auth0/sign-in'));
const Page404 = lazy(() => import('src/pages/error/404'));
console.log(securityRoutes);
export const routesSection: RouteObject[] = [
  {
    path: '/',
    /**
     * @skip homepage
     * import { Navigate } from "react-router";
     * import { CONFIG } from 'src/global-config';
     *
     * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
     * and remove the element below:
     */
    element: <Navigate to={CONFIG.auth.redirectPath} replace />,
    // element: (
    //   <Suspense fallback={<SplashScreen />}>
    //     <MainLayout>
    //       <LoginPage />
    //     </MainLayout>
    //   </Suspense>
    // ),
  },

  // Auth
  ...authRoutes,
  ...authDemoRoutes,
  ...securityRoutes,

  // Dashboard
  ...dashboardRoutes,
  // ...securityRoutes,

  // Main
  ...mainRoutes,

  // Components
  ...componentsRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
