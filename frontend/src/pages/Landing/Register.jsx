import { Box } from '@mui/material';
import React from 'react';
import LoginCard from '../../components/Login/LoginCard';
import axios from '../../config/axios';
import requests from '../../config/requests';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function Register() {
  const navigate = useNavigate();
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const { enqueueSnackbar } = useSnackbar();

  async function handelRegister(details) {
    const { email, password, confirm_password } = details;
    // Validation
    if (password !== confirm_password) {
      return enqueueSnackbar('Password does not match', { variant: 'error' });
    }
    if (!regex.test(password)) {
      return enqueueSnackbar(
        'Password must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
        { variant: 'error' }
      );
    }
    const response = await axios.post(requests.register, { email, password });

    if (response.data.data !== null) {
      enqueueSnackbar(response.data.message, { variant: 'success' });
      navigate('/login');
    } else {
      enqueueSnackbar(response.data.message, { variant: 'error' });
    }
  }

  return (
    <>
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
          src="/stats-bg-gradient.svg"
          alt=""
          style={{ position: 'absolute', width: '60vw' }}
        />
        <LoginCard
          heading="Register"
          isRegister={true}
          alt="Login Here"
          onClick={handelRegister}
          route="/login"
        />
        <img
          src="/Login-img.svg"
          alt=""
          style={{ height: '70vh', zIndex: '1' }}
          className="display-none"
        />
      </Box>
    </>
  );
}

export default Register;
