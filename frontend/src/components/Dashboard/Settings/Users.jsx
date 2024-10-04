import React from 'react';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { BiSolidUser } from 'react-icons/bi';

function Users({ name }) {
  return (
    <ListItemButton
      style={{
        background: 'rgb(11, 64, 156, .1)',
        color: '#10316B',
        borderRadius: '12px',
        transition: 'all 0.5s ease-in-out',
        marginBottom: '1rem',
        paddingLeft: '1.5rem',
        width: '95%'
      }}
    >
      <>
        <ListItemIcon
          sx={{
            minWidth: '30px',
            color: 'rgb(166, 171, 200)',
            scale: '1.6',
          }}
          children={<BiSolidUser />}
        />
        <ListItemText primary={name} s />
      </>
    </ListItemButton>
  );
}

export default Users;
