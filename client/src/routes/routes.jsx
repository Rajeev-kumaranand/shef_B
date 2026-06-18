/**
 * routes.jsx
 * Scalable routing architecture mapped to layout components.
 */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import GlobalErrorBoundary from '../components/common/GlobalErrorBoundary.jsx';
import NotFound from '../pages/NotFound.jsx';

// Core Pages (Keep sync for immediate load)
import Home from '../pages/Home.jsx';

// Lazy Loaded Public Pages
const Shop = lazy(() => import('../pages/Shop.jsx'));
const ProductDetails = lazy(() => import('../pages/ProductDetails.jsx'));
const Discover = lazy(() => import('../pages/Discover.jsx'));
const TheLatest = lazy(() => import('../pages/TheLatest.jsx'));
const Community = lazy(() => import('../pages/Community.jsx'));
const Note = lazy(() => import('../pages/Note.jsx'));
const Contact = lazy(() => import('../pages/Contact.jsx'));
const Wishlist = lazy(() => import('../pages/Wishlist.jsx'));
const Checkout = lazy(() => import('../pages/Checkout.jsx'));
const OrderSuccess = lazy(() => import('../pages/OrderSuccess.jsx'));
const Magazine = lazy(() => import('../pages/Magazine.jsx'));
const ArticleDetails = lazy(() => import('../pages/ArticleDetails.jsx'));

// Lazy Loaded Customer Account Pages
const Login = lazy(() => import('../pages/account/Login.jsx'));
const Register = lazy(() => import('../pages/account/Register.jsx'));
const AccountDashboard = lazy(() => import('../pages/account/Dashboard.jsx'));
const OrderTracking = lazy(() => import('../pages/account/OrderTracking.jsx'));

// Lazy Loaded Admin Pages
const Dashboard = lazy(() => import('../pages/admin/Dashboard.jsx'));
const HomeContent = lazy(() => import('../pages/admin/HomeContent.jsx'));
const Slides = lazy(() => import('../pages/admin/Slides.jsx'));
const Navigation = lazy(() => import('../pages/admin/Navigation.jsx'));
const Company = lazy(() => import('../pages/admin/Company.jsx'));
const AdminContact = lazy(() => import('../pages/admin/Contact.jsx'));
// Settings removed
const DiscoverContent = lazy(() => import('../pages/admin/DiscoverContent.jsx'));
const ShopContent = lazy(() => import('../pages/admin/ShopContent.jsx'));
const ProductsPage = lazy(() => import('../pages/admin/ProductsPage.jsx'));
const OrdersPage = lazy(() => import('../pages/admin/OrdersPage.jsx'));
const CouponsPage = lazy(() => import('../pages/admin/CouponsPage.jsx'));
const ReviewsPage = lazy(() => import('../pages/admin/ReviewsPage.jsx'));
const LatestContent = lazy(() => import('../pages/admin/LatestContent.jsx'));
const CommunityContent = lazy(() => import('../pages/admin/CommunityContent.jsx'));
const NoteContent = lazy(() => import('../pages/admin/NoteContent.jsx'));
const MediaLibrary = lazy(() => import('../pages/admin/MediaLibrary.jsx'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin.jsx'));
const ProtectedRoute = lazy(() => import('../components/auth/ProtectedRoute.jsx'));
const CustomerProtectedRoute = lazy(() => import('../components/auth/CustomerProtectedRoute.jsx'));
const SEOPage = lazy(() => import('../pages/admin/SEOPage.jsx'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage.jsx'));
const InquiriesPage = lazy(() => import('../pages/admin/InquiriesPage.jsx'));
const ArticlesPage = lazy(() => import('../pages/admin/ArticlesPage.jsx'));
const AuthorsPage = lazy(() => import('../pages/admin/AuthorsPage.jsx'));

// Helper for Suspense wrapper
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const withCustomerAuth = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <CustomerProtectedRoute>
      <Component />
    </CustomerProtectedRoute>
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <GlobalErrorBoundary><NotFound /></GlobalErrorBoundary>,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: withSuspense(Shop) },
      { path: 'shop/:slug', element: withSuspense(ProductDetails) },
      { path: 'discover', element: withSuspense(Discover) },
      { path: 'latest', element: withSuspense(TheLatest) },
      { path: 'community', element: withSuspense(Community) },
      { path: 'note', element: withSuspense(Note) },
      { path: 'contact', element: withSuspense(Contact) },
      { path: 'wishlist', element: withCustomerAuth(Wishlist) },
      { path: 'checkout', element: withCustomerAuth(Checkout) },
      { path: 'order-success/:orderNumber', element: withCustomerAuth(OrderSuccess) },
      { path: 'magazine', element: withSuspense(Magazine) },
      { path: 'magazine/:slug', element: withSuspense(ArticleDetails) },
      
      // Customer Account Routes
      { path: 'account/login', element: withSuspense(Login) },
      { path: 'account/register', element: withSuspense(Register) },
      { path: 'account', element: withCustomerAuth(AccountDashboard) },
      { path: 'account/orders/:id', element: withCustomerAuth(OrderTracking) },

      { path: '*', element: <NotFound /> }
    ],
  },
  {
    path: '/admin/login',
    element: withSuspense(AdminLogin)
  },
  {
    path: '/admin',
    element: <Suspense fallback={<PageLoader />}><ProtectedRoute><AdminLayout /></ProtectedRoute></Suspense>,
    children: [
      { index: true, element: withSuspense(Dashboard) },
      { path: 'dashboard', element: withSuspense(Dashboard) },
      { path: 'home', element: withSuspense(HomeContent) },
      { path: 'slides', element: withSuspense(Slides) },
      { path: 'navigation', element: withSuspense(Navigation) },
      { path: 'company', element: withSuspense(Company) },
      { path: 'contact', element: withSuspense(AdminContact) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'discover', element: withSuspense(DiscoverContent) },
      { path: 'shop', element: withSuspense(ShopContent) },
      { path: 'products', element: withSuspense(ProductsPage) },
      { path: 'orders', element: withSuspense(OrdersPage) },
      { path: 'coupons', element: withSuspense(CouponsPage) },
      { path: 'reviews', element: withSuspense(ReviewsPage) },
      { path: 'latest', element: withSuspense(LatestContent) },
      { path: 'community', element: withSuspense(CommunityContent) },
      { path: 'note', element: withSuspense(NoteContent) },
      { path: 'media', element: withSuspense(MediaLibrary) },
      { path: 'seo', element: withSuspense(SEOPage) },
      { path: 'inquiries', element: withSuspense(InquiriesPage) },
      { path: 'magazine/articles', element: withSuspense(ArticlesPage) },
      { path: 'magazine/authors', element: withSuspense(AuthorsPage) },
      { path: '*', element: <NotFound /> }
    ],
  },
]);
