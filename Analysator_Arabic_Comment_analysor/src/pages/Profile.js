import { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../context/ApiContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { currentUser } = useAuth();
  const { apiEndpoint, updateApiEndpoint } = useApi();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    phone: '',
    bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    setEditing(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
      <Sidebar open={drawerOpen} toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: 'margin 0.3s ease-in-out',
          marginLeft: drawerOpen ? 0 : 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mr: 3,
                  bgcolor: 'primary.main',
                }}
              >
                {currentUser?.email?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {formData.displayName || 'User Profile'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {currentUser?.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!editing}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  {editing ? (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" gutterBottom>
                API Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="API Endpoint"
                    value={apiEndpoint}
                    onChange={(e) => updateApiEndpoint(e.target.value)}
                    helperText="API endpoint for processing links"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="h6" gutterBottom>
                Account Statistics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      42
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Processed Batches
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      156
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stream Sessions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      89%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
