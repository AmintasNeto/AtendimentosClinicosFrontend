import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginForm from './components/Login/LoginForm'
import RegisterForm from './components/Login/RegisterForm'
import HomePage from './components/Home/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/UseLogin';
import { ToastContainer } from 'react-toastify';

function App() {
  const context = useAuth();
  const session = context?.user;

  return (
    <>
    <ToastContainer />
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
    </>
  )
}

export default App
