import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContext, useToastState } from './hooks/useToast';

function Root() {
  const toastValue = useToastState();
  return (
    <ToastContext.Provider value={toastValue}>
      <App />
    </ToastContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('No root element');

createRoot(root).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
