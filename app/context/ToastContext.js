'use client';
import { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, variant = 'success', delay = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, delay);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map(t => (
          <Toast
            key={t.id}
            bg={t.variant}
            onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          >
            <Toast.Body>{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
