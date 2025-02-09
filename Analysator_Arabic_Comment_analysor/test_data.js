const axios = require('axios');

// Test data that matches your example structure
const testData = {
  "scraped_data": [
    {
      "post_id": 1472532,
      "post_link": "https://www.hespress.com/example",
      "category": "سياسة",
      "title": "Test Article",
      "post_date": "29-11-2024 00:00",
      "comments": [
        {
          "comment_id": "1472532_19207745",
          "post_id": 1472532,
          "comment": "Test comment 1",
          "comment_reaction": 0,
          "comment_timestamp": "2024-11-29T02:38:00Z",
          "sentiment": {
            "label": "Negative",
            "score": -0.5,
            "probabilities": {
              "negative": 0.4988,
              "neutral": 0.4987,
              "positive": 0.0025
            }
          }
        }
      ],
      "sentiment_statistics": {
        "total_comments": 1,
        "positive_comments": 0,
        "negative_comments": 1,
        "neutral_comments": 0,
        "positive_percentage": 0.0,
        "negative_percentage": 1.0,
        "neutral_percentage": 0.0
      }
    }
  ],
  "scraped_at": "2024-12-05T15:53:51.301120Z"
};

// Function to test the storage
async function testStorage() {
  try {
    // Test storing data
    console.log('Testing data storage...');
    const response = await axios.post(
      `http://localhost:3001/assets/data/${testData.scraped_data[0].post_id}.json`,
      testData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('Storage response:', response.data);

    // Test retrieving data
    console.log('\nTesting data retrieval...');
    const getData = await axios.get(
      `http://localhost:3001/assets/data/${testData.scraped_data[0].post_id}.json`
    );
    console.log('Retrieved data:', getData.data);

    // Test listing files
    console.log('\nTesting file listing...');
    const listFiles = await axios.get('http://localhost:3001/assets/data');
    console.log('Available files:', listFiles.data);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testStorage();
