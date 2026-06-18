import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import PageLoader from '../common/PageLoader.jsx';

export default function CustomerProtectedRoute({ children }) {
  const { customer, loading } = useCustomerAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (!customer) {
    // Redirect them to the /account/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={`/account/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
