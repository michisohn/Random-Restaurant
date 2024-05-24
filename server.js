// This is so we can access the env. variables, in this case the yelp API key
require('dotenv').config();

// Load the 'express' module to create the server and handle HTTP requests
const express = require('express');

// Load the 'axios' module to make HTTP requests to external APIs
const axios = require('axios');

// Create an instance of the Express application
const app = express();

// Define the port number to listen on, defaulting to 3000 if not specified in the environment variables
const PORT = process.env.PORT || 3000;

// Use Express's static middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route to handle GET requests to '/restaurant'
// This route expects 'lat' (latitude) and 'lon' (longitude) query parameters
app.get('/restaurant', async (req, res) => {
  // Log the received request with query parameters
  console.log('Received request for /restaurant with query:', req.query);

  // Destructure the latitude and longitude from the query parameters
  const { lat, lon } = req.query;

  // Get the Yelp API key from the environment variables
  const apiKey = process.env.YELP_API_KEY;

  // If the API key is missing, log the error and return a 500 status code with an error message
  if (!apiKey) {
    console.error('Yelp API key is missing');
    return res.status(500).send('Yelp API key is missing');
  }

  // Construct the URL for the Yelp API request
  const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&categories=restaurants&limit=50`;
  console.log('Constructed Yelp API URL:', url);

  try {
    // Make an HTTP GET request to the Yelp API with the constructed URL and authorization header
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    // Log the response received from Yelp API
    console.log('Response received from Yelp API:', response.data);

    // Extract the list of restaurants from the API response
    const restaurants = response.data.businesses;

    // Select a random restaurant from the list
    const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
    console.log('Selected random restaurant:', randomRestaurant.name);

    // HTTP response: Send the name and URL of the random restaurant as the JSON response
    res.json({ name: randomRestaurant.name, url: randomRestaurant.url });



    // Some error catching
  } catch (error) {
    // Log any errors that occur during the API request
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error('Error response from Yelp API:', error.response.data);
      res.status(500).send(`Error fetching data from Yelp API: ${error.response.data.error.description}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Yelp API:', error.request);
      res.status(500).send('No response received from Yelp API');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up Yelp API request:', error.message);
      res.status(500).send('Error setting up Yelp API request');
    }
  }
});

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
