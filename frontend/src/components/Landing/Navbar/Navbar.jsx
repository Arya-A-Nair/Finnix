import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';

const routes = [
  {
    name: 'Home',
    hash: '#home',
  },
  {
    name: 'Features',
    hash: '#features',
  },
  {
    name: 'Stats',
    hash: '#stats',
  },
  {
    name: 'Working',
    hash: '#working',
  },
];

function Navbar() {
  const route = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  console.log(route.hash);

  useEffect(() => {
    if (isNavOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflowY = 'auto';
  }, [isNavOpen]);

  return (
    <Box className="container" component="nav">
      <Box display="flex" alignItems="center" flex="0.25">
        <img height="46px" src="./logo.svg" alt="" />
        <Box
          sx={{
            fontWeight: '800',
            textTransform: 'uppercase',
            pl: 2,
            fontSize: '1.2rem',
            color: 'primary.main',
          }}
        >
          Finix
        </Box>
      </Box>
      <Box
        className={isNavOpen ? 'nav-links active' : 'nav-links'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: '0.75',
          zIndex: '10',
        }}
      >
        <Box
          component="ul"
          sx={{
            listStyleType: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '5vw',
          }}
        >
          {routes.map((r, i) => (
            <Box
              component={'li'}
              sx={{
                mx: 2,
              }}
              onClick={() => setIsNavOpen(false)}
              key={i}
            >
              <a
                className={route.hash === r.hash ? 'active' : ''}
                href={'/' + r.hash}
              >
                {r.name}
              </a>
            </Box>
          ))}
        </Box>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1rem',
          }}
          onClick={() => setIsNavOpen(false)}
        >
          <a href="/report-fraud">
            <Button
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'capitalize',
                mr: 2,
                fontSize: '1.1rem',
              }}
            >
              Report Fraud
            </Button>
          </a>
          {/* <a href="/login">
            <Button
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'capitalize',
              }}
            >
              Login
            </Button>
          </a> */}
        </Box>
      </Box>
      <IconButton
        className="hamburger"
        onClick={() => setIsNavOpen((prev) => !prev)}
      >
        {isNavOpen ? <IoClose /> : <GiHamburgerMenu />}
      </IconButton>
    </Box>
  );
}

export default Navbar;
