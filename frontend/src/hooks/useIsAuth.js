import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from '../config/axios';

const useIsAuth = () => {
  const { user, token, getApiHeadersWithToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (!user || !token) return; // Don't redirect if user or token is missing

      try {
        // Call API to verify the access token
        const { data } = await axios.get(
          '/verifyAccessToken',
          getApiHeadersWithToken()
        );

        if (data.error === 'invalid access token') {
          // Token is invalid, so clear local storage and do not redirect
          console.log('Invalid token');
          localStorage.clear();
        } else {
          // Token is valid, redirect to dashboard
          navigate('/dashboard/upload-data');
        }
      } catch (error) {
        console.error('Error verifying token', error);
        if (error?.response?.data?.error === 'invalid access token') {
          console.log('Invalid token');
          localStorage.clear();
        }
      }
    };

    verifyToken();
  }, [user, token, getApiHeadersWithToken, navigate]);
};

export default useIsAuth;
