import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualWeather, setManualWeather] = useState({ code: 0, clouds: 20 });
  const [location, setLocation] = useState({ lat: 38.7223, lon: -9.1393, name: 'Lisboa' });
  const [photoGoal, setPhotoGoal] = useState(() => {
    try {
      return localStorage.getItem('luzDoDia.photoGoal.v1') || 'golden';
    } catch (e) {
      return 'golden';
    }
  });
  const [alertSettings, setAlertSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('luzDoDia.alerts.v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      enabled: false,
      sunsetReminderEnabled: true,
      sunsetReminderMinutes: 30,
      lowLightEnabled: false,
      lowLightThreshold: 20
    };
  });
  const [notificationPermission, setNotificationPermission] = useState(() => {
    try {
      return typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
    } catch (e) {
      return 'unsupported';
    }
  });
  const [lastAlertState, setLastAlertState] = useState(() => {
    try {
      const raw = localStorage.getItem('luzDoDia.alertState.v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      sunsetReminderDateKey: null,
      lowLightDateKey: null
    };
  });

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
    try {
      localStorage.setItem('luzDoDia.alerts.v1', JSON.stringify(alertSettings));
    } catch (e) {}
  }, [alertSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('luzDoDia.alertState.v1', JSON.stringify(lastAlertState));
    } catch (e) {}
  }, [lastAlertState]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,cloud_cover&hourly=weather_code,cloud_cover&daily=sunrise,sunset&timezone=auto`);
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
  const fmtMinutes = (mins) => {
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

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

  const dateKey = time.toLocaleDateString('pt-PT');

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      setNotificationPermission('unsupported');
      return;
    }
    try {
      const p = await Notification.requestPermission();
      setNotificationPermission(p);
    } catch (e) {
      setNotificationPermission(Notification.permission);
    }
  };

  const showAlertNotification = async ({ title, body }) => {
    if (!('serviceWorker' in navigator)) return false;
    if (typeof Notification === 'undefined') return false;
    if (Notification.permission !== 'granted') return false;

    const reg = await navigator.serviceWorker.ready;
    const url = `${window.location.origin}${process.env.PUBLIC_URL}/`;

    await reg.showNotification(title, {
      body,
      icon: process.env.PUBLIC_URL + '/logo192.png',
      badge: process.env.PUBLIC_URL + '/logo192.png',
      tag: title,
      renotify: false,
      data: { url }
    });
    return true;
  };

  useEffect(() => {
    try {
      localStorage.setItem('luzDoDia.photoGoal.v1', photoGoal);
    } catch (e) {}
  }, [photoGoal]);

  const goalOptions = [
    { id: 'golden', label: 'Golden hour', hint: 'Luz suave e quente perto do pôr do sol.' },
    { id: 'portrait', label: 'Retrato', hint: 'Prioriza luz estável e contraste moderado.' },
    { id: 'landscape', label: 'Paisagem', hint: 'Procura boa luz com detalhe no céu.' },
    { id: 'long', label: 'Longa exposição', hint: 'Ideal ao crepúsculo/noite (tripé).' },
  ];

  const getPhotoAdvice = () => {
    const nowMinutes = time.getHours() * 60 + time.getMinutes();
    const sunsetMinutes = Math.round(sunset * 60);
    const sunriseMinutes = Math.round(sunrise * 60);
    const minutesToSunset = Math.max(0, sunsetMinutes - nowMinutes);

    const cloudsNote = `${clouds}% de nuvens`;

    if (photoGoal === 'golden') {
      if (isNight) {
        return {
          headline: 'Golden hour terminou',
          detail: 'A próxima janela será no nascer/pôr do sol seguinte.',
          bullets: ['Experimenta longa exposição (tripé).', 'Ajusta ISO baixo para reduzir ruído.']
        };
      }

      const inWindow = minutesToSunset <= 90;
      if (inWindow) {
        return {
          headline: 'Boa janela para golden hour',
          detail: `Faltam ~${minutesToSunset} min para o pôr do sol (${fmtMinutes(sunsetMinutes)}).`,
          bullets: [
            `Condições: ${wInfo?.desc?.toLowerCase?.() || wInfo?.desc} • ${cloudsNote}.`,
            'Usa WB “Cloudy”/“Shade” para tons mais quentes.',
            'Evita altas luzes: -0.3 a -1 EV se necessário.'
          ]
        };
      }
      return {
        headline: 'Planeamento para golden hour',
        detail: `Ainda faltam ~${minutesToSunset} min para o pôr do sol (${fmtMinutes(sunsetMinutes)}).`,
        bullets: [
          `Condições atuais: ${wInfo?.desc?.toLowerCase?.() || wInfo?.desc} • ${cloudsNote}.`,
          'Define local e enquadramento com antecedência.',
          'Quando a luz baixar, reduz ISO e estabiliza a câmara.'
        ]
      };
    }

    if (photoGoal === 'portrait') {
      if (isNight) {
        return {
          headline: 'Retrato noturno',
          detail: 'A luz natural é insuficiente; usa iluminação contínua/flash.',
          bullets: ['Prioriza olhos nítidos (AF/eye).', 'Evita ISO demasiado alto.']
        };
      }
      return {
        headline: 'Retrato — luz disponível',
        detail: `Luminosidade estimada: ${light}% • ${desc.toLowerCase()}.`,
        bullets: [
          `Condições: ${wInfo?.desc?.toLowerCase?.() || wInfo?.desc} • ${cloudsNote}.`,
          'Procura sombra aberta para pele mais uniforme.',
          'Se houver sol forte, usa difusor ou backlight.'
        ]
      };
    }

    if (photoGoal === 'landscape') {
      if (isNight) {
        return {
          headline: 'Paisagem noturna',
          detail: 'Boa altura para cityscapes/estrelas (se o céu ajudar).',
          bullets: [`${cloudsNote} — menos nuvens ajuda astrofoto.`, 'Tripé recomendado.']
        };
      }
      return {
        headline: 'Paisagem — leitura rápida',
        detail: `Luminosidade: ${light}% • Pôr do sol às ${fmtMinutes(Math.round(sunset * 60))}.`,
        bullets: [
          `Céu: ${wInfo?.desc?.toLowerCase?.() || wInfo?.desc} • ${cloudsNote}.`,
          'Considera bracketing/HDR se houver grande contraste.',
          'Usa polarizador com cuidado (pode escurecer o céu irregularmente).' 
        ]
      };
    }

    // long exposure
    if (!isNight && nowMinutes >= sunriseMinutes && nowMinutes <= sunsetMinutes) {
      return {
        headline: 'Longa exposição — prepara o setup',
        detail: `Ainda há luz natural. Ideal perto do crepúsculo (faltam ~${Math.max(0, sunsetMinutes - nowMinutes)} min).`,
        bullets: ['Tripé + temporizador/remote.', 'ISO baixo e ND se necessário.']
      };
    }
    return {
      headline: 'Longa exposição — condições favoráveis',
      detail: 'A luz é baixa: ótimo para trails/água sedosa.',
      bullets: ['Tripé obrigatório.', 'Evita vibrações (estabilizador off no tripé).']
    };
  };

  const photoAdvice = getPhotoAdvice();

  const getHourlyLightForecast = () => {
    if (!weather?.hourly?.time || !weather?.hourly?.cloud_cover) return [];

    const now = time;
    const sunriseH = sunrise;
    const sunsetH = sunset;
    const toHourFloat = (d) => d.getHours() + d.getMinutes() / 60;

    const points = [];
    for (let i = 0; i < weather.hourly.time.length; i++) {
      const t = new Date(weather.hourly.time[i]);
      const diffHours = (t.getTime() - now.getTime()) / 36e5;
      if (diffHours < 0) continue;
      if (diffHours > 12) break;

      const hourFloat = toHourFloat(t);
      const inDay = hourFloat >= sunriseH && hourFloat <= sunsetH;
      const progressH = inDay ? (hourFloat - sunriseH) / (sunsetH - sunriseH) : 0;

      const codeH = weather.hourly.weather_code?.[i] ?? code;
      const cloudsH = weather.hourly.cloud_cover[i] ?? clouds;
      const wH = getWeather(codeH);

      const baseH = !inDay ? 0 : Math.sin(Math.max(0, Math.min(1, progressH)) * Math.PI);
      const lightH = Math.round(baseH * (wH?.mult || 0.5) * (1 - cloudsH / 100 * 0.6) * 100);

      points.push({
        t,
        label: t.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        light: Math.max(0, Math.min(100, lightH)),
        clouds: cloudsH,
        code: codeH
      });
    }
    return points;
  };

  const forecast = getHourlyLightForecast();
  const maxForecast = forecast.reduce((m, p) => Math.max(m, p.light), 1);

  useEffect(() => {
    if (!alertSettings.enabled) return;
    if (notificationPermission !== 'granted') return;
    if (manualMode) return;

    const nowMinutes = time.getHours() * 60 + time.getMinutes();
    const sunsetMinutes = Math.round(sunset * 60);
    const sunriseMinutes = Math.round(sunrise * 60);

    // Alert 1: Sunset reminder
    if (alertSettings.sunsetReminderEnabled) {
      const triggerAt = Math.max(0, sunsetMinutes - Number(alertSettings.sunsetReminderMinutes || 0));
      const windowEnd = triggerAt + 2; // 2-minute window to avoid missing due to tick
      const shouldTrigger =
        nowMinutes >= triggerAt &&
        nowMinutes <= windowEnd &&
        nowMinutes >= sunriseMinutes &&
        nowMinutes <= sunsetMinutes &&
        lastAlertState.sunsetReminderDateKey !== dateKey;

      if (shouldTrigger) {
        showAlertNotification({
          title: 'Pôr do sol a aproximar-se',
          body: `Faltam ~${alertSettings.sunsetReminderMinutes} min para o pôr do sol.`
        }).then((ok) => {
          if (ok) {
            setLastAlertState((s) => ({ ...s, sunsetReminderDateKey: dateKey }));
          }
        });
      }
    }

    // Alert 2: Low light threshold (once per day)
    if (alertSettings.lowLightEnabled && !isNight) {
      const threshold = Number(alertSettings.lowLightThreshold || 0);
      const shouldTrigger = light <= threshold && lastAlertState.lowLightDateKey !== dateKey;
      if (shouldTrigger) {
        showAlertNotification({
          title: 'Começou a escurecer',
          body: `Luminosidade em ${light}%. Pode ser boa altura para luz artificial.`
        }).then((ok) => {
          if (ok) {
            setLastAlertState((s) => ({ ...s, lowLightDateKey: dateKey }));
          }
        });
      }
    }
  }, [
    alertSettings,
    notificationPermission,
    manualMode,
    time,
    sunrise,
    sunset,
    isNight,
    light,
    lastAlertState,
    dateKey
  ]);

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
              {manualMode ? 'Simulação' : 'Condições atuais'}
            </span>
            <button 
              className={`btn ${manualMode ? 'active' : ''}`} 
              onClick={() => setManualMode(!manualMode)}
            >
              {manualMode ? 'Voltar ao tempo real' : 'Simular'}
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
                    : 'A obter dados meteorológicos…'
                  }
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Photography Goal Mode */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <span className="card-title-dot" />
              Modo objetivo (fotografia)
            </span>
          </div>
          <div>
            <select className="select" value={photoGoal} onChange={(e) => setPhotoGoal(e.target.value)}>
              {goalOptions.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
            <div className="weather-detail" style={{ marginTop: 10 }}>
              {goalOptions.find(g => g.id === photoGoal)?.hint}
            </div>
            <div className="weather-display" style={{ marginTop: 14, alignItems: 'flex-start' }}>
              <div className="weather-info" style={{ width: '100%' }}>
                <div className="weather-desc">{photoAdvice.headline}</div>
                <div className="weather-detail">{photoAdvice.detail}</div>
                {photoAdvice.bullets?.length ? (
                  <ul className="weather-detail" style={{ marginTop: 10, paddingLeft: 18 }}>
                    {photoAdvice.bullets.map((b, i) => (
                      <li key={i} style={{ marginTop: 6 }}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Light Forecast Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <span className="card-title-dot" />
              Previsão de luz (próximas horas)
            </span>
          </div>

          {!forecast.length ? (
            <div className="weather-detail">A preparar previsão horária…</div>
          ) : (
            <div>
              <div className="weather-detail" style={{ marginBottom: 10 }}>
                Estimativa por hora (0–12h), baseada em nuvens + estado do céu + tempo até ao pôr do sol.
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${forecast.length}, minmax(0, 1fr))`,
                gap: 8,
                alignItems: 'end',
                height: 140,
                padding: 10,
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(0,0,0,0.12)'
              }}>
                {forecast.map((p, idx) => {
                  const h = Math.round((p.light / maxForecast) * 100);
                  const barHeight = Math.max(6, Math.round((h / 100) * 120));
                  return (
                    <div key={idx} style={{ display: 'grid', justifyItems: 'center', gap: 6 }}>
                      <div style={{ fontSize: 12, opacity: 0.9 }}>{p.light}%</div>
                      <div style={{
                        width: '100%',
                        height: barHeight,
                        borderRadius: 10,
                        background: `linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.18))`,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
                      }} />
                      <div style={{ fontSize: 12, opacity: 0.75 }}>{p.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Alerts Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <span className="card-title-dot" />
              Alertas inteligentes
            </span>
            <button
              className={`btn ${alertSettings.enabled ? 'active' : ''}`}
              onClick={() => setAlertSettings(s => ({ ...s, enabled: !s.enabled }))}
            >
              {alertSettings.enabled ? 'Ativos' : 'Inativos'}
            </button>
          </div>

          <div className="weather-display" style={{ alignItems: 'flex-start' }}>
            <div className="weather-info" style={{ width: '100%' }}>
              <div className="weather-desc">Notificações</div>
              <div className="weather-detail">
                {notificationPermission === 'unsupported'
                  ? 'Este browser não suporta notificações.'
                  : `Permissão: ${notificationPermission}`}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn" onClick={requestNotificationPermission}>
                  Ativar permissões
                </button>
              </div>

              <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
                <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!alertSettings.sunsetReminderEnabled}
                    onChange={(e) => setAlertSettings(s => ({ ...s, sunsetReminderEnabled: e.target.checked }))}
                    disabled={!alertSettings.enabled}
                  />
                  <span>Lembrar antes do pôr do sol</span>
                </label>
                <div className="range-container" style={{ opacity: alertSettings.enabled && alertSettings.sunsetReminderEnabled ? 1 : 0.5 }}>
                  <div className="range-header">
                    <span className="range-label">Minutos antes</span>
                    <span className="range-value">{alertSettings.sunsetReminderMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    className="range"
                    min="5"
                    max="120"
                    step="5"
                    value={alertSettings.sunsetReminderMinutes}
                    disabled={!alertSettings.enabled || !alertSettings.sunsetReminderEnabled}
                    onChange={(e) => setAlertSettings(s => ({ ...s, sunsetReminderMinutes: +e.target.value }))}
                  />
                </div>

                <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!alertSettings.lowLightEnabled}
                    onChange={(e) => setAlertSettings(s => ({ ...s, lowLightEnabled: e.target.checked }))}
                    disabled={!alertSettings.enabled}
                  />
                  <span>Alertar quando a luz ficar fraca</span>
                </label>
                <div className="range-container" style={{ opacity: alertSettings.enabled && alertSettings.lowLightEnabled ? 1 : 0.5 }}>
                  <div className="range-header">
                    <span className="range-label">Limiar</span>
                    <span className="range-value">{alertSettings.lowLightThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    className="range"
                    min="5"
                    max="60"
                    step="1"
                    value={alertSettings.lowLightThreshold}
                    disabled={!alertSettings.enabled || !alertSettings.lowLightEnabled}
                    onChange={(e) => setAlertSettings(s => ({ ...s, lowLightThreshold: +e.target.value }))}
                  />
                </div>

                <div className="weather-detail">
                  Nota: alertas não disparam em modo manual.
                </div>
              </div>
            </div>
          </div>
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