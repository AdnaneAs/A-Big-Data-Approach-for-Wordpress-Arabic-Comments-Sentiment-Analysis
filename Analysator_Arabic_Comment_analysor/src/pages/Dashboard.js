import { useState, useEffect } from 'react';
import { Box, Grid, Typography, styled, Paper, Card } from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainContent = styled(Box)(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingTop: '88px',
  minHeight: '100vh',
  transition: 'margin 0.3s ease-in-out',
  marginLeft: open ? '220px' : 0,
  width: `calc(100% - ${open ? '240px' : '0px'})`,
}));

const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  padding: '20px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, #f3f4f6 0%, #fff 100%)',
    animation: 'gradient 15s ease infinite',
    zIndex: -1,
    filter: 'blur(10px)',
  },
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(2),
  height: '100%',
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 48px rgba(31, 38, 135, 0.25)',
  },
}));

const PostCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
});

const NewsCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px rgba(31, 38, 135, 0.25)',
    '& .image-zoom': {
      transform: 'scale(1.1)',
    }
  },
}));

const NewsImage = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '200px',
  overflow: 'hidden',
  borderRadius: '20px 20px 0 0',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease-in-out',
  }
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  color: '#353535',
  fontSize: '1.1rem',
  lineHeight: 1.4,
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: 'rgb(13 122 239 / 70%);',
  fontSize: '0.875rem',
  fontWeight: 500,
}));

const CategoryChip = styled(Box)({
  display: 'inline-block',
  padding: '4px 8px',
  margin: '0 4px 4px 0',
  borderRadius: '16px',
  fontSize: '0.75rem',
  backgroundColor: 'rgba(113, 141, 171, 0.1)',
  color: '#718DAB',
  fontWeight: 500,
});

const CategoriesContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  marginTop: '8px',
});

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://www.hespress.com/feed');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, 'text/xml');
        
        // Define namespace resolver for media content
        const nsResolver = (prefix) => {
          const ns = {
            'media': 'http://search.yahoo.com/mrss/',
            'content': 'http://purl.org/rss/1.0/modules/content/'
          };
          return ns[prefix] || null;
        };
        
        // Get all items
        const items = xmlDoc.getElementsByTagName('item');
        
        const parsedPosts = Array.from(items).map(item => {
          // Get media content using namespace
          let imageUrl = '';
          const mediaContents = item.getElementsByTagNameNS(nsResolver('media'), 'content');
          if (mediaContents && mediaContents.length > 0) {
            imageUrl = mediaContents[0].getAttribute('url');
          }
          
          // Parse date
          const pubDateStr = item.getElementsByTagName('pubDate')[0]?.textContent;
          const pubDate = new Date(pubDateStr);
          
          // Format date in Arabic with custom formatting
          const weekday = new Intl.DateTimeFormat('ar-MA', { weekday: 'long' }).format(pubDate);
          const day = pubDate.getDate();
          const month = new Intl.DateTimeFormat('ar-MA', { month: 'long' }).format(pubDate);
          const year = pubDate.getFullYear();
          const time = new Intl.DateTimeFormat('ar-MA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }).format(pubDate);

          const formattedDate = `${weekday} ${day} ${month} ${year} - ${time}`;

          // Get categories
          const categories = Array.from(item.getElementsByTagName('category'))
            .map(cat => cat.textContent)
            .filter(Boolean); // Remove empty categories

          // Get description and clean HTML tags
          const description = item.getElementsByTagName('description')[0]?.textContent || '';
          const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, '')
            .replace(/The post.*Hespress.*\./g, '')
            .trim();

          return {
            title: item.getElementsByTagName('title')[0]?.textContent || '',
            link: item.getElementsByTagName('link')[0]?.textContent || '',
            description: cleanDescription,
            pubDate: formattedDate,
            imageUrl: imageUrl || 'https://www.hespress.com/wp-content/themes/hespress-theme/assets/images/hespress-logo.svg',
            categories: categories
          };
        });

        console.log('Parsed posts:', parsedPosts); // For debugging
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <DashboardContainer>
      <Navbar toggleDrawer={() => setDrawerOpen(!drawerOpen)} open={drawerOpen} />
      <Sidebar open={drawerOpen} toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
      
      <MainContent open={drawerOpen}>
        <Typography 
          variant="h4" 
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
        >
          Latest News
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Loading latest news...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {posts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <PostCard>
                  <NewsCard onClick={() => window.open(post.link, '_blank')}>
                    <NewsImage>
                      <img 
                        src={post.imageUrl || 'https://via.placeholder.com/300x200'} 
                        alt={post.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200';
                        }}
                      />
                    </NewsImage>
                    <ContentContainer>
                      <StyledTitle variant="h6">
                        {post.title}
                      </StyledTitle>
                      <DateText>
                        {post.pubDate}
                      </DateText>
                      <CategoriesContainer>
                        {post.categories.map((category, index) => (
                          <CategoryChip key={index}>
                            {category}
                          </CategoryChip>
                        ))}
                      </CategoriesContainer>
                    </ContentContainer>
                  </NewsCard>
                </PostCard>
              </Grid>
            ))}
          </Grid>
        )}
      </MainContent>
    </DashboardContainer>
  );
}