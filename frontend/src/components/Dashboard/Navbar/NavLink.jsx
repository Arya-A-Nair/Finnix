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
          style={{
            background: isActive ? 'rgb(11, 64, 156, .1)' : 'inherit',
            color: isActive ? '#10316B' : 'rgb(16, 49, 107, 0.6)',
            borderRadius: '12px',
            transition: 'all 0.5s ease-in-out',
            marginTop: '0.3rem',
            paddingLeft: '2.5rem',
          }}
        >
          <>
            <ListItemIcon
              sx={{
                minWidth: '30px',
                color: isActive
                  ? 'rgb(166, 171, 200)'
                  : 'rgb(166, 171, 200, 0.6)',
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
