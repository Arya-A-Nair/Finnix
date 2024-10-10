import { Box } from '@mui/material';
import React from 'react';
import LoginCard from '../../components/Login/LoginCard';
import axios from '../../config/axios';
import requests from '../../config/requests';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useSnackbar } from 'notistack';
import useIsAuth from '../../hooks/useIsAuth';

function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setToken, setUser, setUserRole } = React.useContext(AuthContext);
  useIsAuth();

  React.useEffect(() => {
    if (state?.isTokenExpired)
      enqueueSnackbar('Please login again', { variant: 'warn' });
  }, [enqueueSnackbar, state]);

  async function handelLogin(details) {
    const { email, password } = details;
    try {
      const response = await axios.post(requests.login, {
        email,
        password,
      });
      console.log(response.data.message);
      if (response.data.code && response.data.data.user !== null) {
        const { data } = response.data;
        enqueueSnackbar(response.data.message, { variant: 'success' });
        setToken(data.accessToken);
        setUser(data.user);
        setUserRole(data.user.role);
        navigate('/dashboard/upload-data');
      } else {
        enqueueSnackbar(response.data.message, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box display="flex" alignItems="center" flex="0.25" mt={5}>
        <img height="60px" src="./logo.svg" alt="" />
        <Box
          sx={{
            fontWeight: '800',
            textTransform: 'uppercase',
            pl: 2,
            fontSize: '2rem',
            color: 'primary.main',
            zIndex: '10',
          }}
        >
          Finix
        </Box>
      </Box>
      <Box
        id="home"
        component="section"
        className="container"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{
          xl: 'row',
          lg: 'row',
          md: 'row',
          sm: 'column',
          xs: 'column',
        }}
      >
        <img
          src="/stats-bg-gradient.png"
          alt=""
          style={{
            position: 'absolute',
            width: '90vw',
            zIndex: '0',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <img
          src="/Login-img.png"
          alt=""
          style={{ zIndex: '1', width: '45vw', mr: 2 }}
          className="display-none"
        />
        <LoginCard
          heading="Login"
          isRegister={false}
          alt="Register Here"
          onClick={handelLogin}
          route="/register"
        />
      </Box>
    </Box>
  );
}

export default Login;
