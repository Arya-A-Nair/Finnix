import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
const NavLink = ({ text, icon, onClickNavigateTo, isActive }) => {
  return (
    <>
      {/* <ListItem key={text}> */}
      <Link
        to={onClickNavigateTo || '/'}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <ListItemButton
          sx={{
            bgcolor: isActive ? 'primary.light' : 'inherit',
            color: isActive ? 'primary.dark' : 'primary.main',
            borderRadius: '50px',
            transition: 'all 0.5s ease-in-out',
            marginTop: '0.3rem',
            paddingLeft: '2.5rem',
          }}
        >
          <>
            <ListItemIcon
              sx={{
                minWidth: '30px',
                color: isActive ? 'primary.dark' : 'primary.main',
                scale: '1.6',
              }}
              children={icon}
            />
            <ListItemText primary={text} />
          </>
        </ListItemButton>
      </Link>
      {/* </ListItem> */}
    </>
  );
};

export default NavLink;
