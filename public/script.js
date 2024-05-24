// Add an event listener to the button with id 'find-restaurant'
// This event listener will trigger when the button is clicked
document.getElementById('find-restaurant').addEventListener('click', () => {
  console.log('Find Restaurant button clicked');

  // Check if the browser supports geolocation
  if (navigator.geolocation) {
    console.log('Geolocation is supported');

    // If geolocation is supported, get the current position of the user
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('Geolocation success:', position);

        // Fetch function sends an HTTP GET request to the server's /restaurant endpoint, 
        // including the latitude and longitude as query parameters.
        fetch(`/restaurant?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
          .then(response => {
            console.log('Response received from server:', response);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Convert the response to JSON
            return response.json();
          })
          .then(data => {
            console.log('Data received from server:', data);

            // Display the restaurant name as a link in the div with id 'restaurant-info'
            document.getElementById('restaurant-info').innerHTML = `<a href="${data.url}" target="_blank">${data.name}</a>`;
          })
          // Handle any errors that occur during the fetch operation
          .catch(error => {
            console.error('Error fetching restaurant:', error);
            document.getElementById('restaurant-info').innerText = 'Error fetching restaurant data.';
          });
      },
      error => {
        // Handle any errors that occur during geolocation fetching
        console.error('Geolocation error:', error);
        document.getElementById('restaurant-info').innerText = 'Error fetching location.';
      }
    );
  } else {
    // If geolocation is not supported, show an alert to the user
    console.error('Geolocation is not supported by your browser');
    alert('Geolocation is not supported by your browser');
  }
});
