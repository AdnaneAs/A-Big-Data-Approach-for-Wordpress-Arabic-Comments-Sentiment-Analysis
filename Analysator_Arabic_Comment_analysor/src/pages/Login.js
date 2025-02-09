import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  IconButton,
  styled,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import background1 from '../assets/images/background1.jpg';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import LoadingPage from './LoadingPage';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: `url(${background1}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
  },
}));

const GlassPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 1,
}));

const HeroText = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
  '& h1': {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  '& h2': {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '1.5rem',
    fontWeight: 500,
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    borderRadius: theme.spacing(1),
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: '#fff',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 0),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
  },
}));

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, googleSignIn, facebookSignIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Failed to login. Please check your credentials.');
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await googleSignIn();
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      await facebookSignIn();
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Failed to sign in with Facebook');
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return <LoadingPage />;
  }

  return (
    <StyledContainer maxWidth={false}>
      <HeroText>
        <Typography variant="h1">
          Hespress Sentiment Analysis
        </Typography>
        <Typography variant="h2">
          Insights never been easier
        </Typography>
      </HeroText>

      <GlassPaper elevation={6}>
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 4 }}>
          Welcome Back
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <StyledTextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
          />
          <StyledTextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
          >
            Login
          </SubmitButton>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <IconButton
              onClick={handleGoogleSignIn}
              sx={{
                backgroundColor: 'rgba(219, 68, 55, 0.8)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(219, 68, 55, 0.9)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <GoogleIcon />
            </IconButton>
            <IconButton
              onClick={handleFacebookSignIn}
              sx={{
                backgroundColor: 'rgba(66, 103, 178, 0.8)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(66, 103, 178, 0.9)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <FacebookIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  color: '#fff',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Don't have an account? Sign Up
            </Typography>
          </Link>
        </Box>
      </GlassPaper>
    </StyledContainer>
  );
}
