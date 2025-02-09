import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const SentimentCard = styled(Card)(({ theme, sentiment }) => ({
  minWidth: '200px',
  padding: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  marginBottom: theme.spacing(3),
  height: '100%',
}));

const SentimentValue = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '4px',
});

const SentimentPercentage = styled(Typography)({
  color: '#666',
  fontSize: '1.1rem',
});

const ArticleInfoCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  marginBottom: theme.spacing(3),
  overflow: 'hidden',
  '& *': {
    fontFamily: 'Noto Sans Arabic, sans-serif',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ArticleImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '300px',
  objectFit: 'cover',
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const CategoryChip = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '0.875rem',
  fontWeight: 500,
  marginRight: '8px',
  marginBottom: '8px',
  background: 'linear-gradient(45deg, #0646f9 30%, #5174d7 90%)',
  color: 'white',
  boxShadow: '0 2px 8px rgba(6, 70, 249, 0.25)',
  fontFamily: 'Noto Sans Arabic, sans-serif',
}));

export default function SentimentVisualizations({ data }) {
  const [articleImage, setArticleImage] = useState('');

  useEffect(() => {
    const fetchArticleImage = async () => {
      if (data?.scraped_data?.[0]?.post_link) {
        try {
          const response = await fetch(data.scraped_data[0].post_link);
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const imgElement = doc.querySelector('.ratio-medium img');
          if (imgElement) {
            const imgSrc = imgElement.getAttribute('src');
            if (imgSrc) {
              setArticleImage(imgSrc);
            }
          }
        } catch (error) {
          console.error('Error fetching article image:', error);
        }
      }
    };

    fetchArticleImage();
  }, [data]);

  if (!data || !data.scraped_data || !data.scraped_data[0]) {
    return null;
  }
  const post = data.scraped_data[0];
  const stats = post.sentiment_statistics;
  const comments = post.comments;

  const pieData = {
    labels: ['Negative', 'Positive', 'Neutral'],
    datasets: [{
      data: [
        stats.negative_percentage * 100,
        stats.positive_percentage * 100,
        stats.neutral_percentage * 100
      ],
      backgroundColor: ['#ef4444', '#22c55e', '#0087FF'],
    }]
  };

  const barData = {
    labels: comments.map(c => c.comment_id.split('_')[1]),
    datasets: [{
      label: 'Sentiment Score',
      data: comments.map(c => c.sentiment.score),
      backgroundColor: comments.map(c => {
        const score = c.sentiment.score;
        return score > 0 ? '#22c55e' :
               score < 0 ? '#ef4444' : '#6b7280';
      }),
    }]
  };

  const lineData = {
    labels: comments.map(c => new Date(c.comment_timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Sentiment Score Timeline',
      data: comments.map(c => c.sentiment.score),
      borderColor: '#3b82f6',
      tension: 0.4,
    }]
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Article Information Card */}
      <ArticleInfoCard>
        <Grid container spacing={2}>
          {articleImage && (
            <Grid item xs={12}>
              <Box sx={{ position: 'relative', width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden' }}>
                <ArticleImage
                  src={articleImage}
                  alt={post.title}
                  loading="lazy"
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #0646f9 30%, #5174d7 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              direction: 'rtl',
              textAlign: 'right',
              fontFamily: 'Noto Sans Arabic, sans-serif',
            }}>
              {post.title}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ order: { xs: 2, md: 2 } }}>
            <Typography variant="body2" sx={{ 
              mb: 1, 
              color: 'text.secondary', 
              direction: 'rtl',
              textAlign: 'right',
              fontFamily: 'Noto Sans Arabic, sans-serif',
            }}>
              نُشر في: {(() => {
                const [datePart, timePart] = post.post_date.split(' ');
                const [day, month, year] = datePart.split('-');
                const [hour, minute] = timePart.split(':');
                const date = new Date(year, month - 1, day, hour, minute);
                return new Intl.DateTimeFormat('ar-MA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }).format(date);
              })()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ 
              mt: 1, 
              direction: 'rtl',
              textAlign: 'right',
            }}>
              {post.category && (
                <CategoryChip>
                  {post.category}
                </CategoryChip>
              )}
            </Box>
          </Grid>
        </Grid>
      </ArticleInfoCard>

      {/* Sentiment Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <SentimentCard>
            <Typography variant="h6" color="success.main">Positive</Typography>
            <SentimentValue>{stats.positive_comments}</SentimentValue>
            <SentimentPercentage>
              {(stats.positive_percentage * 100).toFixed(1)}%
            </SentimentPercentage>
          </SentimentCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <SentimentCard>
            <Typography variant="h6" color="error.main">Negative</Typography>
            <SentimentValue>{stats.negative_comments}</SentimentValue>
            <SentimentPercentage>
              {(stats.negative_percentage * 100).toFixed(1)}%
            </SentimentPercentage>
          </SentimentCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <SentimentCard>
            <Typography variant="h6" color="info.main">Neutral</Typography>
            <SentimentValue>{stats.neutral_comments}</SentimentValue>
            <SentimentPercentage>
              {(stats.neutral_percentage * 100).toFixed(1)}%
            </SentimentPercentage>
          </SentimentCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <ChartContainer>
            <Typography variant="h6" gutterBottom>Sentiment Distribution</Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </Box>
          </ChartContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartContainer>
            <Typography variant="h6" gutterBottom>Comment Sentiment Scores</Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={barData} options={{ 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true }}
              }} />
            </Box>
          </ChartContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartContainer>
            <Typography variant="h6" gutterBottom>Sentiment Timeline</Typography>
            <Box sx={{ height: 300 }}>
              <Line data={lineData} options={{ 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true }}
              }} />
            </Box>
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Comments Table */}
      <ChartContainer>
        <Typography variant="h6" gutterBottom>Comments Analysis</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Sentiment</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.comment_id} hover>
                  <TableCell>{comment.comment_id.split('_')[1]}</TableCell>
                  <TableCell>{comment.comment}</TableCell>
                  <TableCell>{comment.sentiment.label}</TableCell>
                  <TableCell>{comment.sentiment.score.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(comment.comment_timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ChartContainer>
    </Box>
  );
}