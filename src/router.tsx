import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuthContext } from './hooks/use-auth';
import { lazy } from 'react';

import { FullPageLoader } from './components/full-page-loader';

const Home = lazy(() => import('./pages/home'));
const Dashboard = lazy(() => import('./pages/dashboard'));

export const Router = () => {
  const { user } = useAuthContext();

  if (!user) {
    const router = createBrowserRouter([
      {
        path: '/',
        element: <Home />,
      },
    ]);

    return (
      <RouterProvider router={router} fallbackElement={<FullPageLoader />} />
    );
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />,
    },
  ]);
  return (
    <RouterProvider router={router} fallbackElement={<FullPageLoader />} />
  );
};
