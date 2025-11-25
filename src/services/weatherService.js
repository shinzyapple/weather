import axios from 'axios';

const API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Searches for a location by name.
 * @param {string} query Location name to search
 * @returns {Promise<Object|null>} Location data object (name, latitude, longitude) or null if not found
 */
export const searchLocation = async (query) => {
  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        name: query,
        count: 1,
        language: 'ja',
        format: 'json',
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    }
    return null;
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
};

/**
 * Fetches current weather data for the given latitude and longitude.
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Weather data object
 */
export const fetchWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,weather_code,is_day',
        timezone: 'auto',
      },
    });
    return response.data.current;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Maps WMO weather codes to human-readable descriptions and icon types.
 * @param {number} code WMO weather code
 * @returns {Object} { description, type }
 */
export const getWeatherInfo = (code) => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  const codes = {
    0: { description: 'Clear sky', type: 'clear' },
    1: { description: 'Mainly clear', type: 'cloudy' },
    2: { description: 'Partly cloudy', type: 'cloudy' },
    3: { description: 'Overcast', type: 'cloudy' },
    45: { description: 'Fog', type: 'fog' },
    48: { description: 'Depositing rime fog', type: 'fog' },
    51: { description: 'Light drizzle', type: 'rain' },
    53: { description: 'Moderate drizzle', type: 'rain' },
    55: { description: 'Dense drizzle', type: 'rain' },
    61: { description: 'Slight rain', type: 'rain' },
    63: { description: 'Moderate rain', type: 'rain' },
    65: { description: 'Heavy rain', type: 'rain' },
    71: { description: 'Slight snow fall', type: 'snow' },
    73: { description: 'Moderate snow fall', type: 'snow' },
    75: { description: 'Heavy snow fall', type: 'snow' },
    77: { description: 'Snow grains', type: 'snow' },
    80: { description: 'Slight rain showers', type: 'rain' },
    81: { description: 'Moderate rain showers', type: 'rain' },
    82: { description: 'Violent rain showers', type: 'rain' },
    85: { description: 'Slight snow showers', type: 'snow' },
    86: { description: 'Heavy snow showers', type: 'snow' },
    95: { description: 'Thunderstorm', type: 'thunder' },
    96: { description: 'Thunderstorm with slight hail', type: 'thunder' },
    99: { description: 'Thunderstorm with heavy hail', type: 'thunder' },
  };

  return codes[code] || { description: 'Unknown', type: 'unknown' };
};
