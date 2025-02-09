import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Box,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Stream as StreamIcon,
  BatchPrediction as BatchIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    background: 'rgba(23,0,75 ,1)',
    backdropFilter: 'blur(8px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    height: '100%',
    overflowX: 'hidden',
    '&:hover': {
      background: 'rgb(0 16 137)',
    },
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  minHeight: 64,
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  '& .MuiListItemIcon-root': {
    color: '#fff',
    minWidth: 0,
    marginRight: theme.spacing(3),
  },
}));

const StyledDivider = styled(Divider)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  margin: '16px 0',
});

const menuItems = [
  { text: 'Last Posts', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Batch Processing', icon: <BatchIcon />, path: '/batch-processing' },
  { text: 'Stream Processing', icon: <StreamIcon />, path: '/on-stream' },
];

const bottomMenuItems = [
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Sidebar = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <StyledDrawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        '& .MuiDrawer-paper': {
          top: 0,
          zIndex: 1099,
        },
      }}
    >
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ color: '#fff', ml: 2, fontWeight: 500 }}>
            Navigation
          </Box>
        </Box>
      </DrawerHeader>

      <Box sx={{ px: 2, py: 1 }}>
        <List>
          {menuItems.map((item) => (
            <Tooltip 
              key={item.text} 
              title={!open ? item.text : ''} 
              placement="right"
            >
              <StyledListItem
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2.5,
                  minHeight: 48,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: 1,
                    transition: 'opacity 0.3s ease',
                  }} 
                />
              </StyledListItem>
            </Tooltip>
          ))}
        </List>

        <StyledDivider />

        <List>
          {bottomMenuItems.map((item) => (
            <Tooltip 
              key={item.text} 
              title={!open ? item.text : ''} 
              placement="right"
            >
              <StyledListItem
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2.5,
                  minHeight: 48,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: 1,
                    transition: 'opacity 0.3s ease',
                  }} 
                />
              </StyledListItem>
            </Tooltip>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;