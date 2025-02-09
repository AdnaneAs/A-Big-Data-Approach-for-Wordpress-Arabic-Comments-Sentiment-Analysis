# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY Analysator_Arabic_Comment_analysor/package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY Analysator_Arabic_Comment_analysor/. .

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
