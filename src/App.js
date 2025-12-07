import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualWeather, setManualWeather] = useState({ code: 0, clouds: 20 });
  const [location, setLocation] = useState({ lat: 38.7223, lon: -9.1393, name: 'Lisboa' });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lon: longitude, name: 'A carregar...' });
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || 'Localização atual';
            setLocation(l => ({ ...l, name: city }));
          } catch (e) { setLocation(l => ({ ...l, name: 'Localização atual' })); }
        },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,cloud_cover&daily=sunrise,sunset&timezone=auto`);
        setWeather(await res.json());
      } catch (e) {}
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [location.lat, location.lon]);

  const weatherOptions = [
    { code: 0, desc: 'Céu limpo', icon: '☀️', mult: 1.0 },
    { code: 1, desc: 'Maiormente limpo', icon: '🌤️', mult: 0.9 },
    { code: 2, desc: 'Parcialmente nublado', icon: '⛅', mult: 0.7 },
    { code: 3, desc: 'Nublado', icon: '☁️', mult: 0.4 },
    { code: 45, desc: 'Nevoeiro', icon: '🌫️', mult: 0.2 },
    { code: 61, desc: 'Chuva leve', icon: '🌧️', mult: 0.3 },
    { code: 63, desc: 'Chuva moderada', icon: '🌧️', mult: 0.2 },
    { code: 65, desc: 'Chuva forte', icon: '🌧️', mult: 0.12 },
    { code: 71, desc: 'Neve leve', icon: '🌨️', mult: 0.35 },
    { code: 75, desc: 'Neve forte', icon: '❄️', mult: 0.15 },
    { code: 95, desc: 'Trovoada', icon: '⛈️', mult: 0.1 },
  ];

  const getWeather = (code) => weatherOptions.find(w => w.code === code) || weatherOptions[3];

  const getSunTimes = () => {
    if (weather?.daily) {
      const toH = (iso) => { const d = new Date(iso); return d.getHours() + d.getMinutes() / 60; };
      return { sunrise: toH(weather.daily.sunrise[0]), sunset: toH(weather.daily.sunset[0]) };
    }
    return { sunrise: 8, sunset: 17 };
  };

  const { sunrise, sunset } = getSunTimes();
  const hour = time.getHours() + time.getMinutes() / 60 + time.getSeconds() / 3600;
  const progress = Math.max(0, Math.min(1, (hour - sunrise) / (sunset - sunrise)));
  const isNight = hour < sunrise || hour > sunset;
  const timeLeft = Math.max(0, sunset - hour);
  const hLeft = Math.floor(timeLeft), mLeft = Math.floor((timeLeft - hLeft) * 60);
  const fmt = (h) => `${Math.floor(h).toString().padStart(2,'0')}:${Math.floor((h % 1) * 60).toString().padStart(2,'0')}`;

  const code = manualMode ? manualWeather.code : (weather?.current?.weather_code ?? 3);
  const clouds = manualMode ? manualWeather.clouds : (weather?.current?.cloud_cover ?? 50);
  const wInfo = getWeather(code);
  
  const base = isNight ? 0 : Math.sin(progress * Math.PI);
  const light = Math.round(base * (wInfo?.mult || 0.5) * (1 - clouds / 100 * 0.6) * 100);
  
  const level = light === 0 ? 0 : light < 15 ? 1 : light < 30 ? 2 : light < 50 ? 3 : light < 70 ? 4 : 5;
  const desc = ['Escuridão', 'Luz muito fraca', 'Luz fraca', 'Luz moderada', 'Boa luminosidade', 'Luz forte'][level];
  
  const sky = isNight ? 'sky-night' : wInfo?.mult < 0.3 ? 'sky-dark' : wInfo?.mult < 0.5 ? 'sky-cloudy' : 'sky-clear';
  const sunX = isNight ? -20 : 10 + progress * 80;
  const sunY = 50 - Math.sin(progress * Math.PI) * 40;
  const isRain = [61,63,65,80,81,95].includes(code);
  const isSnow = [71,73,75,85].includes(code);

  return (
    <div className={`app ${sky}`}>
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="title">
            <span className="title-icon">☀️</span>
            Luz do Dia
          </h1>
          <p className="date">
            {time.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </header>

        {/* Sky Visualization */}
        <div className="sky-box">
          <div className="sky-gradient" />
          <div className="horizon" />
          <div className="ground" />
          
          {clouds > 20 && !isNight && [...Array(Math.ceil(clouds / 25))].map((_, i) => (
            <div 
              key={i} 
              className="cloud" 
              style={{ 
                left: `${10 + (i * 25) % 80}%`, 
                top: `${15 + (i * 18) % 30}%`, 
                opacity: Math.min(0.9, clouds / 100),
                fontSize: `${1.5 + (i % 3) * 0.5}rem`
              }}
            >
              ☁️
            </div>
          ))}
          
          {isRain && [...Array(25)].map((_, i) => (
            <div 
              key={i} 
              className="rain-drop" 
              style={{ 
                left: `${(i * 4.2) % 100}%`, 
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${0.6 + Math.random() * 0.3}s`
              }} 
            />
          ))}
          
          {isSnow && [...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="snow-flake" 
              style={{ 
                left: `${(i * 5.3) % 100}%`, 
                animationDelay: `${i * 0.15}s` 
              }}
            >
              ❄️
            </div>
          ))}

          <div 
            className={`sun ${isNight ? 'night' : 'day'}`} 
            style={{ 
              left: `${sunX}%`, 
              top: `${sunY}%`, 
              opacity: clouds > 90 && !isNight ? 0.4 : 1 
            }}
          >
            {!isNight && <div className="sun-glow" />}
          </div>
          
          {isNight && [...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="star" 
              style={{ 
                left: `${5 + (i * 31) % 90}%`, 
                top: `${5 + (i * 17) % 50}%`, 
                animationDelay: `${i * 0.25}s` 
              }} 
            />
          ))}
        </div>

        {/* Time Display */}
        <div className="time">
          <div className="time-display">{time.toLocaleTimeString('pt-PT')}</div>
        </div>

        {/* Weather Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <span className="card-title-dot" />
              {manualMode ? 'Modo Manual' : 'Dados em Tempo Real'}
            </span>
            <button 
              className={`btn ${manualMode ? 'active' : ''}`} 
              onClick={() => setManualMode(!manualMode)}
            >
              {manualMode ? 'Usar API' : 'Simular'}
            </button>
          </div>
          
          {manualMode ? (
            <div>
              <select 
                className="select" 
                value={manualWeather.code} 
                onChange={(e) => setManualWeather(p => ({ ...p, code: +e.target.value }))}
              >
                {weatherOptions.map(w => (
                  <option key={w.code} value={w.code}>
                    {w.icon} {w.desc}
                  </option>
                ))}
              </select>
              <div className="range-container">
                <div className="range-header">
                  <span className="range-label">Cobertura de nuvens</span>
                  <span className="range-value">{manualWeather.clouds}%</span>
                </div>
                <input 
                  type="range" 
                  className="range" 
                  min="0" 
                  max="100" 
                  value={manualWeather.clouds} 
                  onChange={(e) => setManualWeather(p => ({ ...p, clouds: +e.target.value }))} 
                />
              </div>
            </div>
          ) : (
            <div className="weather-display">
              <span className="weather-icon">{wInfo?.icon}</span>
              <div className="weather-info">
                <div className="weather-desc">{wInfo?.desc}</div>
                <div className="weather-detail">
                  {weather?.current 
                    ? `${Math.round(weather.current.temperature_2m)}°C • ${clouds}% nuvens` 
                    : 'A carregar dados...'
                  }
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Light Meter - Hero Component */}
        <div className={`card light-meter level-${level}`}>
          <div className="light-label">
            💡 Luminosidade Exterior
          </div>
          <div className="light-value">
            {light}<span>%</span>
          </div>
          <div className="light-desc">{desc}</div>
          <div className="light-bar-container">
            <div 
              className="light-bar-glow" 
              style={{ width: `${Math.max(2, light)}%` }} 
            />
            <div 
              className="light-bar-fill" 
              style={{ width: `${Math.max(2, light)}%` }} 
            />
          </div>
        </div>

        {/* Sun Times Grid */}
        <div className="grid">
          <div className="grid-item">
            <div className="grid-icon">🌅</div>
            <div className="grid-label">Nascer do Sol</div>
            <div className="grid-value">{fmt(sunrise)}</div>
          </div>
          <div className="grid-item">
            <div className="grid-icon">🌇</div>
            <div className="grid-label">Pôr do Sol</div>
            <div className="grid-value">{fmt(sunset)}</div>
          </div>
        </div>

        {/* Status Card */}
        <div className="card status-card">
          {isNight ? (
            <>
              <div className="status-icon">🌙</div>
              <div className="status-title">Período Noturno</div>
              <div className="status-subtitle">Próximo nascer do sol às {fmt(sunrise)}</div>
            </>
          ) : (
            <>
              <div className="status-subtitle">Luz natural restante</div>
              <div className="time-remaining">
                <span className="time-remaining-value">{hLeft}</span>
                <span className="time-remaining-unit">h</span>
                <span className="time-remaining-value">{mLeft}</span>
                <span className="time-remaining-unit">min</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-icon">📍</span>
          <span>{location.name}</span>
        </footer>
      </div>
    </div>
  );
}