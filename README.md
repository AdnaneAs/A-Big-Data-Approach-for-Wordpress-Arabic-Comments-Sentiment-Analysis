# ANALYZATOR - WordPress Sentiment Analysis

## Project Overview
ANALYZATOR is an academic project focused on sentiment analysis for WordPress content, developed as part of the Big Data and Artificial Intelligence Master's program at the Polydisciplinary Faculty of Taroudant, Ibn Zohr University. The project specifically aims to analyze and categorize sentiments expressed in Arabic comments, providing insights into user opinions and emotions.


## Academic Context
- **Institution**: Ibn Zohr University - Polydisciplinary Faculty of Taroudant
- **Program**: Master's in Big Data and Artificial Intelligence
- **Academic Year**: 2024-2025

## Project Team
- **Student**: Asensouyis Adnane 
- **Student**: Maidine Hamza 
- **Student**: Boufrioua Aziz

- **Supervisors**: 
  - Dr. EL HAJJI Mohammed
  - Dr. ES-SAADI Youssef

## Features
- Sentiment analysis of WordPress content
- Real-time analysis capabilities
- Interactive dashboard for results visualization
- Data processing and analytics pipeline

## Technology Stack
- Frontend: React.js
- Docker containerization
- NPM package management
- Modern UI/UX design principles

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd analyzator
```

2. Using Docker (Recommended):
```bash
docker-compose up
```

3. Manual Installation:
```bash
npm install
npm run dev
```

## Big Data Architecture

To install and run the Docker containers for the Big Data architecture, follow these steps:

1. Navigate to the Big Data Architecture folder:
   ```bash
   cd path/to/big_data_architecture
   ```

2. Run the Docker containers:
   ```bash
   docker-compose up
   ```

This command will start all the necessary services for development.

## Architecture
The architecture of the project is designed to efficiently process and analyze Arabic comments. It consists of the following components:
1. **Data Ingestion**: A module that collects comments from various sources, such as social media or websites.
2. **Preprocessing**: This step involves cleaning and normalizing the text data, including tokenization, stopword removal, and stemming.
3. **Sentiment Analysis Model**: The core component that utilizes machine learning algorithms to classify sentiments into categories such as positive, negative, or neutral.
4. **Results Visualization**: A user interface that displays the analysis results in an intuitive manner, allowing users to explore sentiment trends over time.


## Development
```
The application will be available at `http://localhost:3000`

## Docker Support
The project includes Docker configuration for easy deployment and development. Use:
- `docker-compose up` to start all services
- `docker-compose down` to stop all services

## License
This project is part of academic research and is protected under applicable academic guidelines.
