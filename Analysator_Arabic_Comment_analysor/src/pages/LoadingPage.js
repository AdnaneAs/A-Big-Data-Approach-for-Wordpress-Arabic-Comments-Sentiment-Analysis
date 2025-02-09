import React from 'react';
import styled from 'styled-components';
import Loader from '../components/Loader';

const LoadingPage = () => {
  return (
    <LoadingContainer>
      <Loader />
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
`;

export default LoadingPage;
