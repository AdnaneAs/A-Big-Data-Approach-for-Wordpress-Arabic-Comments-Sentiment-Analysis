import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { 
  InputBase, 
  IconButton, 
  Box, 
  Badge, 
  Avatar,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const notifications = [
    { id: 1, title: 'New batch process completed', time: '5 min ago' },
    { id: 2, title: 'Stream processing alert', time: '10 min ago' },
    { id: 3, title: 'New post published', time: '1 hour ago' },
    { id: 4, title: 'System update', time: '2 hours ago' },
  ];

  return (
    <StyledWrapper>
      <div className="nav">
        <div className="container">
          <div className="left-section">
            <IconButton 
              className="menu-button"
              onClick={toggleSidebar}
              sx={{ color: '#fff' }}
            >
              <MenuIcon />
            </IconButton>
          </div>

          <div className="center-section">
            <form onSubmit={handleSearch} className="search-form">
              <SearchContainer>
                <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mx: 1 }} />
                <InputBase
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    color: '#fff', 
                    flex: 1,
                    '& input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1
                    }
                  }}
                />
              </SearchContainer>
            </form>
          </div>

          <div className="right-section">
            <Box className="nav-links">
              <div className="nav-link" onClick={() => handleNavigation('/dashboard')}>Last Posts</div>
              <div className="nav-link" onClick={() => handleNavigation('/batch-processing')}>Batch Processing</div>
              <div className="nav-link" onClick={() => handleNavigation('/on-stream')}>Stream Processing</div>
            </Box>
            <Box className="icons-section">
              <IconButton 
                sx={{ color: '#fff' }}
                onClick={(e) => setNotificationAnchor(e.currentTarget)}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={() => setNotificationAnchor(null)}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    width: 320,
                    maxHeight: 400,
                    background: 'rgba(30, 60, 114, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    '& .MuiMenuItem-root': {
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      py: 1.5,
                      px: 2,
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {notifications.map((notification) => (
                  <MenuItem key={notification.id} onClick={() => setNotificationAnchor(null)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">{notification.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {notification.time}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>

              <IconButton 
                sx={{ color: '#fff' }} 
                onClick={(e) => setProfileAnchor(e.currentTarget)}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    background: 'rgba(30, 60, 114, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => {
                  setProfileAnchor(null);
                  handleNavigation('/profile');
                }}>
                  <ListItemIcon>
                    <AccountCircleIcon sx={{ color: '#fff' }} />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => {
                  setProfileAnchor(null);
                  handleLogout();
                }}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: '#fff' }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 4px 8px;
  width: 400px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover, &:focus-within {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1201;

  .nav {
    height: 64px;
    background: rgba(30, 60, 114, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
  }

  .left-section {
    .menu-button {
      margin-right: 16px;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .center-section {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    
    .search-form {
      display: flex;
      justify-content: center;
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 32px;

    .nav-links {
      display: flex;
      gap: 24px;
    }

    .icons-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link {
      color: #fff;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 20px;
      transition: all 0.3s ease;
      font-weight: 500;
      position: relative;
      white-space: nowrap;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: #fff;
        transition: all 0.3s ease;
        transform: translateX(-50%);
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);

        &::after {
          width: 80%;
        }
      }
    }
  }
`;

export default Navbar;
