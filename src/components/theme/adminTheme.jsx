import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1e1e2f' },
    secondary: { main: '#ff6f61' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Afacad, Roboto, Arial, sans-serif',
  },
});

export default theme;
export { ThemeProvider };
