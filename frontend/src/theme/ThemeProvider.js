import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const StyleThemeProvider = (props) => {
  const useTheme = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#482880',
        light: '#ad96d6',
        dark: '#361e5e',
      },
      secondary: {
        main: '#8561c5',
      },
      text: {
        primary: '#161616',
        secondary: 'rgba(22,22,22,0.75)',
        disabled: 'rgba(22,22,22,0.5)',
        hint: 'rgba(22,22,22,0.65)',
      },
      background: {
        default: '#F8ECFD',
        paper: '#f0deff',
      },
      error: {
        main: '#f44336',
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
