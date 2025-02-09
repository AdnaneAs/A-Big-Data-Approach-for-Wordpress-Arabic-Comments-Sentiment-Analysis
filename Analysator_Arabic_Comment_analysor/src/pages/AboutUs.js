import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AboutUs() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const features = [
    {
      title: 'Batch Processing',
      description: 'Process large amounts of data efficiently with our advanced batch processing system.',
      image: 'https://source.unsplash.com/random/400x300?tech',
    },
    {
      title: 'Real-time Streaming',
      description: 'Monitor and analyze data in real-time with our streaming capabilities.',
      image: 'https://source.unsplash.com/random/400x300?data',
    },
    {
      title: 'Interactive Dashboards',
      description: 'Visualize your data with beautiful and interactive charts and graphs.',
      image: 'https://source.unsplash.com/random/400x300?chart',
    },
  ];

  const team = [
    {
      name: 'John Doe',
      role: 'Lead Developer',
      image: 'https://source.unsplash.com/random/300x300?portrait1',
    },
    {
      name: 'Jane Smith',
      role: 'Data Scientist',
      image: 'https://source.unsplash.com/random/300x300?portrait2',
    },
    {
      name: 'Mike Johnson',
      role: 'UI/UX Designer',
      image: 'https://source.unsplash.com/random/300x300?portrait3',
    },
  ];

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
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <Paper
              sx={{
                position: 'relative',
                backgroundColor: 'grey.800',
                color: '#fff',
                mb: 4,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: 'url(https://source.unsplash.com/random/1600x900?technology)',
                p: 6,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  backgroundColor: 'rgba(0,0,0,.5)',
                }}
              />
              <Grid container>
                <Grid item md={6}>
                  <Box
                    sx={{
                      position: 'relative',
                      p: { xs: 3, md: 6 },
                      pr: { md: 0 },
                    }}
                  >
                    <Typography variant="h3" color="inherit" gutterBottom>
                      About Our Platform
                    </Typography>
                    <Typography variant="h5" color="inherit" paragraph>
                      We provide cutting-edge data processing and visualization solutions for your business needs.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Features Section */}
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              Our Features
            </Typography>
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={feature.image}
                        alt={feature.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Team Section */}
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              Our Team
            </Typography>
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {team.map((member, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={member.image}
                        alt={member.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.role}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Contact Section */}
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" paragraph>
                Have questions about our platform? We'd love to hear from you.
              </Typography>
              <Typography variant="body1" color="primary">
                contact@example.com
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
