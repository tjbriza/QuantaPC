import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from '@mui/material/styles';
import adminTheme from './theme/adminTheme.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ThemeProvider theme={adminTheme}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ThemeProvider>
    </AuthContextProvider>
  </StrictMode>,
);
