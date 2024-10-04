import {
    Box,
    Divider,
    TextField,
    Typography,
    InputAdornment,
    Button,
  } from '@mui/material';
  import React, { useState } from 'react';
  
  const textFieldSx = {
    m: 2,
    minWidth: '30%',
    '@media (max-width: 700px)': { minWidth: '90%' },
  };
  function UserReport() {
    const [fraud, setFraud] = useState('');
  
    function handleSubmit() {
      console.log(fraud);
    }
  
    return (
      <Box
        sx={{
          display: 'flex',
          height: '90%',
          width: '100%',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Box
          sx={{
            bgcolor: '#F2F7FF',
            width: '95%',
            borderRadius: '1.5rem',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="700" color="primary">
            User Report
          </Typography>
          <Divider sx={{ my: '0.5rem' }}></Divider>
          <TextField
            label="User Account No."
            id="outlined-start-adornment"
            name="amount"
            value={fraud}
            onChange={(e) => {
              setFraud(e.target.value);
            }}
            sx={textFieldSx}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              marginBottom: '1.5rem',
              px: '3rem',
              my: '1rem',
            }}
            onClick={handleSubmit}
          >
            Generate Report
          </Button>
        </Box>
      </Box>
    );
  }
  
  export default UserReport;
  