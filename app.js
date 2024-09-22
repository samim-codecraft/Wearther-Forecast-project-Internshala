const apiKey = '98740f4ebc0d63bc0f8ba70090e5a091'; // Replace with your OpenWeatherMap or WeatherAPI key

    // Fetch weather data based on the city name
    function getWeatherData(city) {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
          if (data.cod === 200) {
            updateCurrentWeather(data);
            return fetch(forecastUrl);
          } else {
            alert(data.message);
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.cod === '200') {
            updateForecast(data);
          }
        })
        .catch(error => console.error('Error:', error));
    }

    // Update the current weather section
    function updateCurrentWeather(data) {
      document.getElementById('current-weather').classList.remove('hidden');
      document.getElementById('location').textContent = `${data.name} (${new Date().toLocaleDateString()})`;
      document.getElementById('temperature').textContent = data.main.temp.toFixed(2);
      document.getElementById('wind').textContent = data.wind.speed;
      document.getElementById('humidity').textContent = data.main.humidity;
      document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      document.getElementById('weather-icon').classList.remove('hidden');
    }

    // Update the forecast section
    function updateForecast(data) {
      const forecastContainer = document.getElementById('forecast');
      forecastContainer.innerHTML = ''; // Clear previous forecasts

      const forecasts = data.list.filter(f => f.dt_txt.includes('12:00:00')); // Get daily forecasts at noon

      forecasts.forEach(forecast => {
        const card = document.createElement('div');
        card.className = 'bg-gray-700 text-white text-center p-4 rounded-lg';
        card.innerHTML = `
          <h2 class="font-semibold">${new Date(forecast.dt * 1000).toLocaleDateString()}</h2>
          <div class="my-2">
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon" class="w-16 mx-auto">
          </div>
          <p>Temp: <span class="font-bold">${forecast.main.temp.toFixed(2)}</span>&deg;C.</p>
          <p>Wind: <span class="font-bold">${forecast.wind.speed}</span> M/S</p>
          <p>Humidity: <span class="font-bold">${forecast.main.humidity}</span>%</p>
        `;
        forecastContainer.appendChild(card);
      });
    }

    // Get current location using Geolocation API
    function getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

          fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
              if (data.cod === 200) {
                updateCurrentWeather(data);
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
              }
            })
            .then(response => response.json())
            .then(data => {
              if (data.cod === '200') {
                updateForecast(data);
              }
            })
            .catch(error => console.error('Error:', error));
        }, () => {
          alert('Geolocation access denied. Please enter a city name.');
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    }

    // Event listeners
    document.getElementById('search-button').addEventListener('click', () => {
      const city = document.getElementById('city-input').value;
      getWeatherData(city);
    });

    document.getElementById('current-location').addEventListener('click', getCurrentLocation);

    // Automatically get current location on page load
    window.onload = getCurrentLocation;