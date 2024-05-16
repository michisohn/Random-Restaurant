const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/restaurant', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.YELP_API_KEY; // Use the API key from the environment variable
  const url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&categories=restaurants&limit=50`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const restaurants = response.data.businesses;
    const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];

    res.json({ name: randomRestaurant.name });
  } catch (error) {
    console.error('Error fetching data from Yelp API:', error);
    res.status(500).send('Error fetching data from Yelp API');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});