import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const StyleThemeProvider = (props) => {
  const useTheme = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#B7202E',
        light: '#ED1C24',
      },
      secondary: {
        main: '#004a9c',
        light: '#006699',
        dark: '#004466',
      },
      background: {
        paper: '#f5e3e3',
        default: '#FFF2F2',
      },
      error: {
        main: '#f44336',
      },
      // divider: '#58595B',
      text: {
        primary: '#231F20',
        disabled: '#58595B',
        hint: 'rgba(88,89,91,0.7)',
        secondary: 'rgba(35,31,32,0.9)',
      },
    },
    typography: {
      fontFamily: 'Poppins',
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
      fontWeightBold: 900,
    },
    shape: {
      borderRadius: 20,
    },
    overrides: {
      MuiSwitch: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&$checked, &$colorPrimary$checked, &$colorSecondary$checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + $track': {
              opacity: 1,
              border: 'none',
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #bdbdbd',
          backgroundColor: '#fafafa',
          opacity: 1,
          transition:
            'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
  });

  return (
    <ThemeProvider theme={useTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};

export default StyleThemeProvider;
