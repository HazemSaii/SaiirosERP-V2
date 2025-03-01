
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
// import { Suspense } from 'react';
// import { MainLayout } from 'src/layouts/main';
// import { SplashScreen } from 'src/components/loading-screen';
import { Navigate } from 'react-router';

import { CONFIG } from 'src/global-config';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { humanResourseRoutes } from './hr';
import { securityRoutes } from './security';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

// const HomePage = lazy(() => import('src/pages/home'));
// const LoginPage = lazy(() => import('src/pages/auth/auth0/sign-in'));
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
  ...humanResourseRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
