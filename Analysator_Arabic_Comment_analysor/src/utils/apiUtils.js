import axios from 'axios';

// Function to store data in localStorage and file
const storeData = async (data) => {
  console.log('Storing data:', data);

  if (!data.scraped_data || !data.scraped_data[0] || !data.scraped_data[0].post_id) {
    throw new Error('Invalid data format: missing post_id');
  }

  const postId = data.scraped_data[0].post_id;
  
  // Store in localStorage with post ID as key
  localStorage.setItem(`post_${postId}`, JSON.stringify(data));

  try {
    const response = await fetch(`http://localhost:3001/assets/data/${postId}.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data, null, 2)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from server:', errorText);
      throw new Error(`Server responded with status: ${response.status}`);
    }

    console.log(`Data successfully saved to file for post ${postId}`);
  } catch (error) {
    console.error('Error saving data to file:', error);
    throw error;
  }
};

// Function to read stored data for a specific post
export const getStoredData = async (postId) => {
  try {
    const response = await fetch(`http://localhost:3001/assets/data/${postId}.json`);
    if (!response.ok) {
      throw new Error('Post data not found');
    }
    const data = await response.json();
    console.log('Retrieved stored data for post:', postId, data);
    return data;
  } catch (error) {
    console.error('Error reading stored data:', error);
    // Try to get from localStorage as fallback
    const localData = localStorage.getItem(`post_${postId}`);
    console.log('Fallback to localStorage for post:', postId, localData);
    return localData ? JSON.parse(localData) : null;
  }
};

// Function to list all stored posts
export const listStoredPosts = async () => {
  try {
    const response = await fetch('http://localhost:3001/assets/data');
    if (!response.ok) {
      throw new Error('Failed to list posts');
    }
    const files = await response.json();
    return files.map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error listing posts:', error);
    return [];
  }
};

export async function processLink(apiEndpoint, link) {
  try {
    const requestData = {
      "link": `${link}`,
      "condition": "False"
    };

    console.log('Sending request to API:', { apiEndpoint, requestData });

    const response = await axios.post(apiEndpoint, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', response.data);

    // Validate the response structure
    if (response.data && response.data.scraped_data && 
        response.data.scraped_data[0] && response.data.scraped_data[0].post_id) {
      // Store the data
      await storeData(response.data);

      return {
        success: true,
        data: response.data,
        postId: response.data.scraped_data[0].post_id
      };
    } else {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('Error in processLink:', error);
    if (error.response) {
      console.error('Error response from API:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
    }
    return {
      success: false,
      error: error.message
    };
  }
}
