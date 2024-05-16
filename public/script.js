document.getElementById('find-restaurant').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        fetch(`/restaurant?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
          .then(response => response.json())
          .then(data => {
            document.getElementById('restaurant-info').innerText = data.name;
          })
          .catch(error => console.error('Error fetching restaurant:', error));
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  });