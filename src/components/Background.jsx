import React from 'react';
import { getWeatherInfo } from '../services/weatherService';

const Background = ({ weatherCode, isDay, children }) => {
    const { type } = getWeatherInfo(weatherCode);

    // 背景色の定義
    const getBackgroundStyle = () => {
        // isDayが0の場合は夜
        if (isDay === 0) {
            return 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)';
        }

        switch (type) {
            case 'clear':
                return 'linear-gradient(to bottom, #2980b9, #6dd5fa, #ffffff)';
            case 'cloudy':
                return 'linear-gradient(to bottom, #bdc3c7, #2c3e50)';
            case 'rain':
                return 'linear-gradient(to bottom, #373b44, #4286f4)';
            case 'snow':
                return 'linear-gradient(to bottom, #83a4d4, #b6fbff)';
            case 'thunder':
                return 'linear-gradient(to bottom, #141e30, #243b55)';
            case 'fog':
                return 'linear-gradient(to bottom, #757f9a, #d7dde8)';
            default:
                return 'linear-gradient(to bottom, #2980b9, #6dd5fa, #ffffff)';
        }
    };

    return (
        <div
            style={{
                background: getBackgroundStyle(),
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                transition: 'background 1s ease-in-out',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}
        >
            {children}
        </div>
    );
};

export default Background;
