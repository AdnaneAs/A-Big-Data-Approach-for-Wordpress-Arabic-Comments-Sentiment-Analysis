import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  styled,
  Paper,
} from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import background2 from '../assets/images/body-background.png';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `url(${background2}) no-repeat center center fixed`,
  backgroundSize: '100% 100%',
  padding: 0,
  margin: 0,
}));

const GlassBox = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  maxWidth: '400px',
  width: '100%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
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
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  '&.MuiButton-containedPrimary': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: theme.palette.text.primary,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      await signup(email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <StyledContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <GlassBox>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff' }}>
            Sign Up
          </Typography>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StyledTextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <StyledTextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <StyledTextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <StyledButton type="submit" variant="contained">
                Sign Up
              </StyledButton>
            </Box>
          </form>

          <Typography variant="body2" sx={{ color: '#fff', my: 2 }}>
            Or sign up with
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            <SocialButton startIcon={<GoogleIcon />} onClick={signInWithGoogle}>
              Continue with Google
            </SocialButton>
            <SocialButton startIcon={<FacebookIcon />} onClick={signInWithFacebook}>
              Continue with Facebook
            </SocialButton>
          </Box>

          <Typography variant="body2" sx={{ mt: 2, color: '#fff' }}>
            Already have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ color: '#2196F3' }}
            >
              Sign In
            </Link>
          </Typography>
        </GlassBox>
      </motion.div>
    </StyledContainer>
  );
}
