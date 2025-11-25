import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import Background from './components/Background';
import WeatherDisplay from './components/WeatherDisplay';
import SearchBar from './components/SearchBar';
import { fetchWeather, searchLocation } from './services/weatherService';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('Loading...');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const getLocationAndWeather = () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by your browser');
        fetchDefaultWeather();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setLocationName('Current Location');
            const data = await fetchWeather(latitude, longitude);
            setWeatherData(data);
            setLoading(false);
          } catch (err) {
            console.error(err);
            setError('Failed to fetch weather data');
            // Fallback to default even on fetch error if possible, but for now just show error
            // Actually, let's try default if fetch fails? No, fetch failure might be network.
            // But if geolocation succeeds but fetch fails, we are here.
            setLoading(false);
          }
        },
        (err) => {
          console.warn('Geolocation permission denied or error:', err);
          fetchDefaultWeather();
        }
      );
    };

    const fetchDefaultWeather = async () => {
      try {
        setLocationName('Tokyo');
        // Tokyo coordinates
        const data = await fetchWeather(35.6895, 139.6917);
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    getLocationAndWeather();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const location = await searchLocation(query);
      if (location) {
        setLocationName(location.name);
        const data = await fetchWeather(location.latitude, location.longitude);
        setWeatherData(data);
      } else {
        setError('Location not found');
        // Keep previous weather data if search fails? Or clear it?
        // Let's keep it but show error overlay or toast.
        // For now, the error state will replace the view as per current implementation.
        // Maybe better to just alert?
        alert('Location not found'); // Simple feedback for now
      }
    } catch (err) {
      console.error(err);
      setError('Failed to search location');
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (loading) {
    return (
      <Background weatherCode={0} isDay={1}>
        <div className="glass" style={{ padding: '2rem 4rem', fontSize: '1.5rem' }}>Loading...</div>
      </Background>
    );
  }

  if (error && !weatherData) {
    return (
      <Background weatherCode={0} isDay={1}>
        <div className="glass" style={{ padding: '2rem', color: '#ff6b6b', textAlign: 'center' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>Retry</button>
        </div>
      </Background>
    );
  }

  return (
    <Background
      weatherCode={weatherData?.weather_code ?? 0}
      isDay={weatherData?.is_day ?? 1}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        zIndex: 10, // Ensure it's above background
      }}>
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            backdropFilter: 'blur(4px)',
            color: 'white',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        <SearchBar onSearch={handleSearch} />
        <WeatherDisplay
          weatherData={weatherData}
          locationName={locationName}
        />
      </div>
    </Background>
  );
}

export default App;
