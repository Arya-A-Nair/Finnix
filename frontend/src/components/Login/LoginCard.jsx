import {
  Box,
  Button,
  Card,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginCard({
  heading,
  isRegister,
  alt,
  onClick,
  route,
  isMagic = false,
  subheading,
}) {
  const [details, setDetails] = useState({
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleChangeForm = (name) => (event) => {
    setDetails((prev) => {
      return { ...prev, [name]: event.target.value };
    });
  };

  return (
    <Card
      sx={{
        width: '400px',
        textAlign: 'center',
        bgcolor: 'white',
        my: '2%',
        mx: '1%',
        zIndex: '0',
      }}
      elevation={0}
    >
      <Box px={5} py={4}>
        <Typography variant="h4" color="primary" fontWeight="700">
          {heading}
        </Typography>
        {isMagic && (
          <Typography variant="h6" color="primary" fontWeight="500" mt={1}>
            {subheading}
          </Typography>
        )}
        <FormControl fullWidth={true} sx={{ mt: 5 }}>
          {!isMagic && (
            <TextField
              required
              type="email"
              id="email"
              label="Email"
              placeholder="example@email.com"
              fullWidth={true}
              sx={{ marginBottom: '2rem' }}
              value={details.email}
              onChange={handleChangeForm('email')}
            />
          )}
          <TextField
            required
            type="password"
            id="password"
            label="Password"
            placeholder="Password"
            fullWidth={true}
            sx={{ marginBottom: '2rem' }}
            value={details.password}
            onChange={handleChangeForm('password')}
          />
          {isRegister && (
            <TextField
              required
              type="password"
              id="confirm_password"
              label="Confirm Password"
              placeholder="Confirm Password"
              fullWidth={true}
              sx={{ marginBottom: '2rem' }}
              value={details.confirm_password}
              onChange={handleChangeForm('confirm_password')}
            />
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'capitalize',
              fontSize: '1.3rem',
              marginBottom: '1.5rem',
            }}
            fullWidth={true}
            onClick={() => onClick(details)}
          >
            {heading}
          </Button>
        </FormControl>
      </Box>
    </Card>
  );
}

export default LoginCard;
