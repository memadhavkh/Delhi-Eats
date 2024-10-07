import Login from './auth/Login.tsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Layout from './Layout.tsx'
import SignUp from './auth/SignUp.tsx';
import ForgotPassword from './auth/ForgotPassword.tsx';
import ResetPassword from './auth/ResetPassword.tsx';
import VerifyEmail from './auth/VerifyEmail.tsx';
import HeroSection from './components/HeroSection.tsx';
import Profile from './components/Profile.tsx';
import SearchPage from './components/SearchPage.tsx';
import RestaurantDetail from './components/RestaurantDetail.tsx';
import Cart from './components/Cart.tsx';
import Restaurant from './admin/Restaurant.tsx';
import AddMenu from './admin/AddMenu.tsx';
import Orders from './admin/Orders.tsx';
import Success from './components/Success.tsx';
import { useUserStore } from './store/useUserStore.ts';
import { useEffect } from 'react';
import Loading from './components/Loading.tsx';
import { useThemeStore } from './store/useThemeStore.ts';

const ProtectedRoutes = ({children}: {children: React.ReactNode}) => {
  const {isAuthenticated, user} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to={'/login'} replace />
  }
  if(!user?.isVerified){
    return <Navigate to={'/verify-email'} replace />
  }
  return children;
}

const AuthenticatedUsers = ({children}: {children: React.ReactNode}) => {
  const {isAuthenticated, user} = useUserStore();
  if(isAuthenticated && user?.isVerified){
    return <Navigate to={'/'} replace />
  }
  return children;
}

const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div style={{ padding: '20px', backgroundColor: 'lightgray' }}>
        You are seeing this message because you visited an undefined route.
      </div>
    </div>
  );
};

const AdminRoutes = ({children}: {children: React.ReactNode}) => {
  const {user, isAuthenticated} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to={'/login'} replace />
  }
  if(!user?.admin){
    return <Navigate to={'/'} replace />
  }
  return children;
}

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><Layout/></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <HeroSection />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: "/search/:id",
        element: <SearchPage/>
      },
      {
        path: '/restaurant/:id',
        element: <RestaurantDetail />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: "/order/status",
        element: <Success />
      },
      // admin routes
      {
        path: "/admin/restaurant",
        element: <AdminRoutes><Restaurant/></AdminRoutes>
      },
      {
        path: '/admin/menu',
        element: <AdminRoutes><AddMenu /></AdminRoutes>
      },
      {
        path: '/admin/orders',
        element: <AdminRoutes><Orders/></AdminRoutes>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <SignUp />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword/>
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />
  },
  {
    path: '/verify-email',
    element: <AuthenticatedUsers><VerifyEmail /></AuthenticatedUsers>
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const {checkAuthentication, isCheckingAuth} = useUserStore();
  useEffect(() => {
    checkAuthentication();
    initializeTheme();
  },[checkAuthentication, initializeTheme]);
  if(isCheckingAuth){
    return <Loading />
  }
  return (
    <>
    <RouterProvider router={appRouter}>
    </RouterProvider>
    </>
  )
}


export default App
