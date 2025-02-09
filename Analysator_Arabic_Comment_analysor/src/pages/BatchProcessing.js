import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  LinearProgress,
  styled,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../context/ApiContext';
import { processLink } from '../utils/apiUtils';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SentimentVisualizations from '../components/SentimentVisualizations';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const MainContent = styled(Box)(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  paddingTop: '88px',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e0e8f5 100%)',
  minHeight: '100vh',
  transition: 'margin 0.3s ease-in-out',
  marginLeft: open ? 0: 0,
  width: 'calc(100% - ' + (open ? '240px' : '0px') + ')',
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
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
}));

const StyledButton = styled(Button)(({ theme, isActive }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
  background: isActive 
    ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)'
    : 'linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)',
  color: 'white',
  boxShadow: isActive 
    ? '0 3px 5px 2px rgba(76, 175, 80, .3)'
    : '0 3px 5px 2px rgba(158, 158, 158, .3)',
  '&:hover': {
    background: isActive 
      ? 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)'
      : 'linear-gradient(45deg, #757575 30%, #9E9E9E 90%)',
    transform: 'translateY(-2px)',
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(45deg, #9E9E9E 30%, #BDBDBD 90%)',
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: '100%',
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    borderRadius: 5,
  },
}));

export default function BatchProcessing() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showCharts, setShowCharts] = useState(false);
  const [link, setLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const { apiEndpoint } = useApi();
  const progressTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, []);

  const handleProcess = async () => {
    if (!link) return;

    setIsProcessing(true);
    setShowCharts(false);
    setProgress(0);
    setProcessedData(null);

    try {
      const result = await processLink(apiEndpoint, link);
      
      if (result.success) {
        setProcessedData(result.data);
        // Start progress bar animation for 3 seconds
        const startTime = Date.now();
        const duration = 3000; // 3 seconds

        progressTimer.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / duration) * 100, 100);
          
          setProgress(newProgress);
          
          if (newProgress === 100) {
            clearInterval(progressTimer.current);
            setShowCharts(true);
            setIsProcessing(false);
            setLink('');
          }
        }, 50); // Update every 50ms for smooth animation
      } else {
        setIsProcessing(false);
        setLink('');
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      setIsProcessing(false);
      setLink('');
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar toggleDrawer={() => setDrawerOpen(!drawerOpen)} open={drawerOpen} />
      <Sidebar open={drawerOpen} toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
      
      <MainContent open={drawerOpen}>
        <StyledTitle variant="h4" 
        sx={{ 
          mb: 5, 
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 800,
          fontSize: '2.5rem',
          background: 'linear-gradient(45deg, #0646f9 30%, #5174d7 60%, #ffaf7b 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '60px',
            height: '4px',
            background: 'linear-gradient(45deg, #3a1c71, #d76d77)',
            bottom: '-10px',
            borderRadius: '2px',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '30px',
            height: '4px',
            background: 'linear-gradient(45deg, #d76d77, #ffaf7b)',
            bottom: '-20px',
            borderRadius: '2px',
          },
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          letterSpacing: '1px',
          animation: 'fadeIn 0.8s ease-out',
          '@keyframes fadeIn': {
            from: {
              opacity: 0,
              transform: 'translateY(-20px)'
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
          >Batch Processing Analytics</StyledTitle>
        
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StyledPaper sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StyledTextField
                    fullWidth
                    label="Enter Processing Link"
                    variant="outlined"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    disabled={isProcessing}
                  />
                  <StyledButton
                    variant="contained"
                    onClick={handleProcess}
                    disabled={!link || isProcessing}
                    isActive={!!link}
                  >
                    {isProcessing ? 'Processing...' : 'Process'}
                  </StyledButton>
                </Box>
                {isProcessing && (
                  <Box sx={{ mt: 2 }}>
                    <StyledLinearProgress variant="determinate" value={progress} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      align="center"
                      sx={{ mt: 1 }}
                    >
                      Processing... {Math.round(progress)}%
                    </Typography>
                  </Box>
                )}
              </StyledPaper>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCharts && processedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SentimentVisualizations data={processedData} />
            </motion.div>
          )}
        </AnimatePresence>
      </MainContent>
    </Box>
  );
}
