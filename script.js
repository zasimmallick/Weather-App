// JavaScript for Weather API Integration
const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage = document.getElementById('errorMessage');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const location = document.getElementById('location');
const forecastContainer = document.getElementById('forecast');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();

    // Update UI with current weather
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    condition.textContent = data.weather[0].description;
    location.textContent = `${data.name}, ${data.sys.country}`;
    weatherDisplay.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    // Fetch forecast
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();
    updateForecast(forecastData.list);
  } catch (error) {
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.remove('hidden');
  }
}

function updateForecast(forecastList) {
  forecastContainer.innerHTML = '';
  const uniqueForecasts = forecastList.filter((item, index) => index % 8 === 0); // Get one forecast per day

  uniqueForecasts.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;

    const card = `
      <div class="flex items-center justify-between p-4 glass rounded-lg">
        <div>
          <p class="text-sm text-[#E2E8F0]">${date}</p>
          <p class="text-lg font-semibold">${temp}°C</p>
        </div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" class="w-10 h-10">
      </div>
    `;
    forecastContainer.insertAdjacentHTML('beforeend', card);
  });
}