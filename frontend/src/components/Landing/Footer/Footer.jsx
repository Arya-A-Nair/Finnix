import React from 'react';
import { Box, Typography } from '@mui/material';
function Footer() {
  return (
    <Box
      component={'footer'}
      sx={{
        width: '100%',
        height: '7vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'primary.main',
        mt: 4,
      }}
    >
      <Typography
        variant="body2"
        color="white"
        fontWeight={'900'}
        fontSize={'1.2rem'}
        align="center"
      >
        Made with ❤️ by Team Finix
      </Typography>
    </Box>
  );
}

export default Footer;
