import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginForm from './components/Login/LoginForm'
import RegisterForm from './components/Login/RegisterForm'
import HomePage from './components/Home/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/UseLogin';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useEffect } from 'react';
import type { UserSession } from './Interface/UserSessionData';

function App() {
  const context = useAuth();
  const session = context?.user;

  useEffect(() => {
    const storedSession = window.sessionStorage.getItem("userSession");

    if(storedSession !== null) context?.login(JSON.parse(window.sessionStorage.getItem("userSession") ?? "") as UserSession);
  },[]);

  return (
    <>
    <ToastContainer />
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registrar" element={<RegisterForm />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={session ? true : false}>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
    </>
  )
}

export default App
