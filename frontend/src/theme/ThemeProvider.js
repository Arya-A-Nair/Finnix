import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const StyleThemeProvider = (props) => {
  const useTheme = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#10316B',
        light: '#0B409C',
      },
      secondary: {
        main: '#ff9800',
      },
      background: {
        default: '#ffffff',
        paper: '#F2F7FF',
      },
      text: {
        primary: '#7C7C7C',
        // secondary: 'rgba(72,71,71,0.54)',
        // disabled: 'rgba(67,66,66,0.38)',
        // hint: 'rgba(76,75,75,0.38)',
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
      borderRadius: 10,
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
