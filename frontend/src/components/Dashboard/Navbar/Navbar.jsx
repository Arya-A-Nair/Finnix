import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Typography,
  AppBar,
  Divider,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavLink from './NavLink';
import { HiMenuAlt2 } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuList } from '../../../config/menuList';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { enqueueSnackbar } from 'notistack';

function Sidebar({ children }) {
  const navigate = useNavigate();
  const currentRoute = useLocation().pathname;
  const getRouteName = () => {
    const routeName = menuList.find(
      (item) => currentRoute === item.route
    )?.text;
    return routeName || 'Dashboard';
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogOut = () => {
    localStorage.clear();
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
    navigate('/login');
    window.location.reload();
  };

  const list = (
    <Box role="presentation" mx={2}>
      <List>
        <Box
          sx={{
            marginBottom: '1rem',
            cursor: 'pointer',
          }}
        >
          <ListItem
            onClick={() => navigate('/dashboard/upload-data')}
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <ListItemIcon>
              <img src="/logo.svg" alt="Logo" width="40" />
            </ListItemIcon>
            <Typography
              color="primary"
              fontWeight="700"
              textTransform="uppercase"
              display="inline"
            >
              Finix Dashboard
            </Typography>
          </ListItem>
          <Divider sx={{ mb: 4 }} />
        </Box>

        {/* Menu Items */}
        {/* <Typography color="primary.main">Menu</Typography> */}
        {menuList.map((item, index) => {
          // eslint-disable-next-line array-callback-return
          if (!item.icon) return; // Menu items without icons are not rendered in the sidebar
          return (
            <div key={index}>
              <NavLink
                key={index}
                text={item.text}
                icon={item.icon}
                onClickNavigateTo={item.onClickNavigateTo}
                isActive={currentRoute === item.route}
              />
              {index === 6 && <Divider sx={{ my: 3 }} />}
            </div>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 280px)` },
          ml: { sm: `280px` },
          backgroundColor: 'background.paper',
          color: 'primary.main',
          borderLeft: 'none',
        }}
        variant="outlined"
        elevation={0}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingRight: '0.5rem',
          }}
        >
          <Toolbar alignItems="center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <HiMenuAlt2 />
            </IconButton>
            <IconButton sx={{ mr: 2 }} onClick={() => navigate(-1)}>
              <ArrowBackIcon color="primary" />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {getRouteName()}
            </Typography>
          </Toolbar>
          <Button
            variant="contained"
            startIcon={<FaArrowRightFromBracket />}
            color="primary"
            onClick={handleLogOut}
            sx={{
              borderRadius: '10px',
            }}
          >
            Log Out
          </Button>
        </Box>
      </AppBar>
      <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}>
        <Drawer
          open={isDrawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: 280,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              color: 'text.primary',
            },
          }}
          variant="permanent"
          anchor="left"
          classes={{ paper: 'awesome-bg-0' }}
        >
          {list}
        </Drawer>

        {/* Mobile Drawer */}
        <Drawer
          open={isDrawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            width: 280,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              display: { xs: 'block', sm: 'none' },
              bgcolor: 'background.paper',
              color: 'text.primary',
            },
          }}
          variant="temporary"
          anchor="left"
          classes={{ paper: 'awesome-bg-0' }}
        >
          {list}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          bgcolor: 'background.default',
          // width: { sm: `calc(100% - 280px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Sidebar;
