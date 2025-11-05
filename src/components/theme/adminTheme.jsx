import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1e1e2f' },
    secondary: { main: '#ff6f61' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Afacad, Roboto, Arial, sans-serif',
    fontSize: 16,
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        rounded: {
          borderRadius: 4,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 4,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 4,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          // Ensure the toolbar remains visible and content has breathing room
          '& .MuiDataGrid-toolbarContainer': {
            padding: 8,
          },
          // When there are no columns/rows, keep some vertical space so actions remain accessible
          '& .MuiDataGrid-main': {
            minHeight: 80,
          },
          '& .MuiDataGrid-overlay': {
            padding: 16,
          },
        },
      },
    },
  },
});

export default theme;
export { ThemeProvider };
