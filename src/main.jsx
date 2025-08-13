import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './components.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import Background from './components/ui/Background.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <Background>
        <RouterProvider router={router} />
      </Background>
    </AuthContextProvider>
  </StrictMode>
);
