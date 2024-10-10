import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NotFound from '../pages/NotFound/NotFound';
import LoadingScreen from './LoadingScreen';

import AuthContext from '../context/AuthContext';

import axios from '../config/axios';
import { menuList } from '../config/menuList';

const ProtectedRoute = ({ children }) => {
  const { user, token, getApiHeadersWithToken, userRole } =
    React.useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const verifyToken = async () => {
      if (!user || !token) {
        // Redirect to login if user or token is not available
        navigate('/login', {
          state: { from: location.pathname },
        });
        return;
      }

      try {
        // Verify if token is valid
        const { data } = await axios.get(
          '/verifyAccessToken',
          getApiHeadersWithToken()
        );

        if (data.error === 'invalid access token') {
          console.log('Invalid token');
          localStorage.clear();
          navigate('/login', {
            state: { isTokenExpired: true },
          });
        } else {
          // Check if the user is allowed to access the route based on role
          const isAllowedUserRole = menuList
            .find((menu) => menu.route === location.pathname)
            ?.allowedRoles?.includes(userRole);

          if (!isAllowedUserRole) {
            setLoading(null);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Token verification failed', error);
        navigate('/login', {
          state: { isTokenExpired: true },
        });
      }
    };

    verifyToken();
  }, [navigate, location, token, user, userRole, getApiHeadersWithToken]);

  if (loading === true) return <LoadingScreen />;
  if (loading === null) return <NotFound />;

  return <>{children}</>;
};

export default ProtectedRoute;
