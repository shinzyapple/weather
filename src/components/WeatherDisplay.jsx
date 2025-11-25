import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Moon, CloudFog } from 'lucide-react';
import { getWeatherInfo } from '../services/weatherService';

const WeatherDisplay = ({ weatherData, locationName }) => {
    if (!weatherData) return null;

    const { temperature_2m, weather_code, is_day } = weatherData;
    const { description, type } = getWeatherInfo(weather_code);

    const getIcon = () => {
        const props = { size: 80, color: 'white', strokeWidth: 1.5 };

        if (is_day === 0 && type === 'clear') return <Moon {...props} />;

        switch (type) {
            case 'clear': return <Sun {...props} />;
            case 'cloudy': return <Cloud {...props} />;
            case 'rain': return <CloudRain {...props} />;
            case 'snow': return <CloudSnow {...props} />;
            case 'thunder': return <CloudLightning {...props} />;
            case 'fog': return <CloudFog {...props} />;
            default: return <Sun {...props} />;
        }
    };

    return (
        <div className="glass" style={{
            padding: '3rem',
            textAlign: 'center',
            minWidth: '320px',
            maxWidth: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 500, opacity: 0.9, letterSpacing: '0.05em' }}>
                {locationName}
            </h2>

            <div style={{ margin: '1rem 0', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}>
                {getIcon()}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ fontSize: '5rem', fontWeight: 'bold', lineHeight: 1, marginBottom: '0.5rem' }}>
                    {Math.round(temperature_2m)}°
                </h1>
                <p style={{ fontSize: '1.5rem', textTransform: 'capitalize', opacity: 0.9 }}>
                    {description}
                </p>
            </div>
        </div>
    );
};

export default WeatherDisplay;
