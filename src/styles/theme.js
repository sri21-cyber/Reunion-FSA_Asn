// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '8px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          padding: '16px',
        },
      },
    },
  },
});

export default theme;
