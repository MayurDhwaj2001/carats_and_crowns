import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import authContext from '../store/store';

function AdminRoute({ children }) {
  const authCtx = useContext(authContext);
  const isAdmin = authCtx.userRole === 'admin';
  const isLoggedIn = authCtx.token;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;