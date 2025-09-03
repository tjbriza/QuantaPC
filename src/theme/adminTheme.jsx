import { createTheme } from '@mui/material/styles';

const adminTheme = createTheme({
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // ensure AppBar sits above other elements by default
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // ensure grid inputs pick up rounded corners from inputs
        },
      },
    },
  },
});

export default adminTheme;
