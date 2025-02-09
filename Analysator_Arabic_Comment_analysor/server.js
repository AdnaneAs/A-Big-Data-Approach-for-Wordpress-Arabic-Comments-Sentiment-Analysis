const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, 'src', 'assets', 'data');
  try {
    await fs.access(dataDir);
  } catch {
    console.log('Creating data directory:', dataDir);
    await fs.mkdir(dataDir, { recursive: true });
  }
  return dataDir;
};

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Route to save data for a specific post
app.post('/assets/data/:postId.json', async (req, res) => {
  try {
    console.log(`Received POST request for post ${req.params.postId}:`, req.body);
    
    const dataDir = await ensureDataDir();
    const filePath = path.join(dataDir, `${req.params.postId}.json`);
    
    console.log('Writing to file:', filePath);
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
    
    console.log('Data successfully written to file');
    res.json({ success: true });
  } catch (error) {
    console.error('Error in POST route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to read data for a specific post
app.get('/assets/data/:postId.json', async (req, res) => {
  try {
    console.log(`Received GET request for post ${req.params.postId}`);
    
    const dataDir = await ensureDataDir();
    const filePath = path.join(dataDir, `${req.params.postId}.json`);
    
    console.log('Reading from file:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    console.log('Successfully read data from file');
    
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error in GET route:', error);
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Post data not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Route to list all post files
app.get('/assets/data', async (req, res) => {
  try {
    const dataDir = await ensureDataDir();
    const files = await fs.readdir(dataDir);
    const postFiles = files.filter(file => file.endsWith('.json'));
    res.json(postFiles);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: error.message });
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create data directory on startup
ensureDataDir().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to create data directory:', error);
  process.exit(1);
});
