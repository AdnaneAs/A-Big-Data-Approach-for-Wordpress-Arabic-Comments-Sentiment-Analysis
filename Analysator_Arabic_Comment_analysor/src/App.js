import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ApiProvider } from './context/ApiContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import BatchProcessing from './pages/BatchProcessing';
import OnStream from './pages/OnStream';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ApiProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/about" element={<PrivateRoute><AboutUs /></PrivateRoute>} />
              <Route path="/batch-processing" element={<PrivateRoute><BatchProcessing /></PrivateRoute>} />
              <Route path="/on-stream" element={<PrivateRoute><OnStream /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ApiProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;