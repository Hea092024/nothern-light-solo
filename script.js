const citySearch = document.getElementById("city-search");
const searchButton = document.getElementById("search-button");
const historicalVisibility = document.getElementById("historical-visibility");
const forecastVisibility = document.getElementById("forecast-visibility");
const weatherConditions = document.getElementById("weather-conditions");
const searchError = document.getElementById("search-error");
const loadingIndicator = document.getElementById("loading-indicator");

const apiKey = "YOUR_API_KEY"; // Replace with your actual API key from Aurora's API

searchButton.addEventListener("click", async () => {
  const city = citySearch.value.trim();
  if (!city) return; // Handle empty input

  try {
    // Show loading indicator
    showLoading(true);

    // Fetch current aurora data
    const currentResponse = await fetch(
      "http://auroraslive.io/api/v1/current",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`, // Pass API key if required
          "Content-Type": "application/json",
        },
      }
    );

    if (!currentResponse.ok) {
      throw new Error(`HTTP error! status: ${currentResponse.status}`);
    }
    const currentData = await currentResponse.json();

    // Fetch historical aurora data
    const startDate = "2021-09-01";
    const endDate = "2021-09-30";
    const historicalUrl = `http://auroraslive.io/api/v1/historical?start=${startDate}&end=${endDate}`;

    const historicalResponse = await fetch(historicalUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!historicalResponse.ok) {
      throw new Error(`HTTP error! status: ${historicalResponse.status}`);
    }
    const historicalData = await historicalResponse.json();

    // Fetch aurora forecast data
    const forecastResponse = await fetch(
      "http://auroraslive.io/api/v1/forecast",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!forecastResponse.ok) {
      throw new Error(`HTTP error! status: ${forecastResponse.status}`);
    }
    const forecastData = await forecastResponse.json();

    // Log data for debugging
    console.log("Current Data:", currentData);
    console.log("Historical Data:", historicalData);
    console.log("Forecast Data:", forecastData);

    // Update the UI with fetched data
    historicalVisibility.innerHTML = formatHistoricalData(historicalData);
    forecastVisibility.innerHTML = formatForecastData(forecastData);
    weatherConditions.innerHTML = formatWeatherData(currentData);

    searchError.style.display = "none"; // Hide error message if successful
  } catch (error) {
    console.error("Error fetching data:", error);

    // Log the error message for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }

    searchError.style.display = "block";
    searchError.textContent = "Error fetching data. Please try again later.";
  } finally {
    // Hide loading indicator after fetching is done
    showLoading(false);
  }
});

// Helper function to show or hide the loading indicator
function showLoading(isLoading) {
  if (isLoading) {
    loadingIndicator.style.display = "block";
  } else {
    loadingIndicator.style.display = "none";
  }
}

// Helper function to format the historical aurora data
function formatHistoricalData(data) {
  if (!data || data.length === 0) {
    return "No historical data available.";
  }

  return data
    .map((item) => {
      return `<div>
      <strong>Date:</strong> ${item.date} <br>
      <strong>Visibility:</strong> ${item.visibility} <br>
      <strong>Activity Level:</strong> ${item.activityLevel} <br>
    </div>`;
    })
    .join("");
}

// Helper function to format the aurora forecast data
function formatForecastData(data) {
  if (!data || data.length === 0) {
    return "No forecast data available.";
  }

  return data
    .map((item) => {
      return `<div>
      <strong>Time:</strong> ${item.time} <br>
      <strong>Visibility:</strong> ${item.visibility} <br>
      <strong>Activity Level:</strong> ${item.activityLevel} <br>
    </div>`;
    })
    .join("");
}

// Helper function to format the weather data
function formatWeatherData(data) {
  if (!data) {
    return "Weather data unavailable.";
  }

  return `
    <div><strong>Temperature:</strong> ${data.temperature} °C</div>
    <div><strong>Cloud Coverage:</strong> ${data.cloudCoverage}%</div>
    <div><strong>Wind Speed:</strong> ${data.windSpeed} km/h</div>
  `;
}
