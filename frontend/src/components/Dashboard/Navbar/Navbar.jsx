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
import { menuList } from '../../../utils/menuList';
import { FaArrowRightFromBracket } from 'react-icons/fa6';

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
    navigate('/login');
    window.location.reload();
  };

  const list = (
    <Box role="presentation" mx={2}>
      <List>
        <div
          style={{
            marginBottom: '1rem',
            cursor: 'pointer',
          }}
        >
          <ListItem onClick={() => navigate('/')}>
            <ListItemIcon>
              <img src="/logo.svg" alt="Logo" width="40" />
            </ListItemIcon>
            <ListItemText>
              <h3 style={{ color: '#10316B' }}>Dhanush</h3>
            </ListItemText>
          </ListItem>
          <Divider sx={{ marginLeft: '-20px' }} />
        </div>

        {/* Menu Items */}
        <Typography>Menu</Typography>
        {menuList.map((item, index) => {
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
              {index === 6 && <Typography mt={1}>Other</Typography>}
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
          backgroundColor: '#fff',
          color: '#10316B',
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
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {getRouteName()}
            </Typography>
          </Toolbar>
          <Button
            variant="outlined"
            startIcon={<FaArrowRightFromBracket />}
            color="error"
            onClick={handleLogOut}
          >
            Log Out
          </Button>
        </Box>
      </AppBar >
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
              bgcolor: '#F2F7FF',
              color: 'rgb(11, 64, 156, .7)',
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
              bgcolor: '#F2F7FF',
              color: 'rgb(11, 64, 156, .7)',
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
          // width: { sm: `calc(100% - 280px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box >
  );
}

export default Sidebar;
