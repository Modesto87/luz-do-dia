import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';

const localeMap = {
  pt: 'pt-PT',
  en: 'en-US',
  fr: 'fr-FR'
};

const translations = {
  pt: {
    'app.title': 'Luz do Dia',
    'header.dateFormat': undefined,
    'lang.label': 'Idioma',
    'lang.pt': 'Português',
    'lang.en': 'Inglês',
    'lang.fr': 'Francês',

    'weather.simulation': 'Simulação',
    'weather.current': 'Condições atuais',
    'weather.simulate': 'Simular',
    'weather.back': 'Voltar ao tempo real',
    'weather.cloudCover': 'Cobertura de nuvens',
    'weather.loading': 'A obter dados meteorológicos…',
    'weather.tempDetail': '{temp}°C • {clouds}% nuvens',

    'photo.title': 'Modo objetivo (fotografia)',
    'photo.golden.label': 'Golden hour',
    'photo.golden.hint': 'Luz suave e quente perto do pôr do sol.',
    'photo.portrait.label': 'Retrato',
    'photo.portrait.hint': 'Prioriza luz estável e contraste moderado.',
    'photo.landscape.label': 'Paisagem',
    'photo.landscape.hint': 'Procura boa luz com detalhe no céu.',
    'photo.long.label': 'Longa exposição',
    'photo.long.hint': 'Ideal ao crepúsculo/noite (tripé).',

    'photo.golden.night.headline': 'Golden hour terminou',
    'photo.golden.night.detail': 'A próxima janela será no nascer/pôr do sol seguinte.',
    'photo.golden.night.bullets': [
      'Experimenta longa exposição (tripé).',
      'Ajusta ISO baixo para reduzir ruído.'
    ],
    'photo.golden.window.headline': 'Boa janela para golden hour',
    'photo.golden.window.detail': 'Faltam ~{minutes} min para o pôr do sol ({sunset}).',
    'photo.golden.window.bullets': [
      'Condições: {conditions}.',
      'Usa WB “Cloudy”/“Shade” para tons mais quentes.',
      'Evita altas luzes: -0.3 a -1 EV se necessário.'
    ],
    'photo.golden.plan.headline': 'Planeamento para golden hour',
    'photo.golden.plan.detail': 'Ainda faltam ~{minutes} min para o pôr do sol ({sunset}).',
    'photo.golden.plan.bullets': [
      'Condições atuais: {conditions}.',
      'Define local e enquadramento com antecedência.',
      'Quando a luz baixar, reduz ISO e estabiliza a câmara.'
    ],

    'photo.portrait.night.headline': 'Retrato noturno',
    'photo.portrait.night.detail': 'A luz natural é insuficiente; usa iluminação contínua/flash.',
    'photo.portrait.night.bullets': [
      'Prioriza olhos nítidos (AF/eye).',
      'Evita ISO demasiado alto.'
    ],
    'photo.portrait.day.headline': 'Retrato — luz disponível',
    'photo.portrait.day.detail': 'Luminosidade estimada: {light}% • {lightDesc}.',
    'photo.portrait.day.bullets': [
      'Condições: {conditions}.',
      'Procura sombra aberta para pele mais uniforme.',
      'Se houver sol forte, usa difusor ou backlight.'
    ],

    'photo.landscape.night.headline': 'Paisagem noturna',
    'photo.landscape.night.detail': 'Boa altura para cityscapes/estrelas (se o céu ajudar).',
    'photo.landscape.night.bullets': [
      '{cloudsNote} — menos nuvens ajuda astrofoto.',
      'Tripé recomendado.'
    ],
    'photo.landscape.day.headline': 'Paisagem — leitura rápida',
    'photo.landscape.day.detail': 'Luminosidade: {light}% • Pôr do sol às {sunset}.',
    'photo.landscape.day.bullets': [
      'Céu: {conditions}.',
      'Considera bracketing/HDR se houver grande contraste.',
      'Usa polarizador com cuidado (pode escurecer o céu irregularmente).'
    ],

    'photo.long.day.headline': 'Longa exposição — prepara o setup',
    'photo.long.day.detail': 'Ainda há luz natural. Ideal perto do crepúsculo (faltam ~{minutes} min).',
    'photo.long.day.bullets': [
      'Tripé + temporizador/remote.',
      'ISO baixo e ND se necessário.'
    ],
    'photo.long.night.headline': 'Longa exposição — condições favoráveis',
    'photo.long.night.detail': 'A luz é baixa: ótimo para trails/água sedosa.',
    'photo.long.night.bullets': [
      'Tripé obrigatório.',
      'Evita vibrações (estabilizador off no tripé).'
    ],

    'forecast.title': 'Previsão de luz (próximas horas)',
    'forecast.preparing': 'A preparar previsão horária…',
    'forecast.description': 'Estimativa por hora (0–12h), baseada em nuvens + estado do céu + tempo até ao pôr do sol.',

    'alerts.title': 'Alertas inteligentes',
    'alerts.active': 'Ativos',
    'alerts.inactive': 'Inativos',
    'alerts.notifications': 'Notificações',
    'alerts.permissionUnsupported': 'Este browser não suporta notificações.',
    'alerts.permissionLabel': 'Permissão: {status}',
    'alerts.enablePermissions': 'Ativar permissões',
    'alerts.sunsetReminder': 'Lembrar antes do pôr do sol',
    'alerts.minutesBefore': 'Minutos antes',
    'alerts.lowLight': 'Alertar quando a luz ficar fraca',
    'alerts.threshold': 'Limiar',
    'alerts.note': 'Nota: alertas não disparam em modo manual.',
    'alerts.sunset.title': 'Pôr do sol a aproximar-se',
    'alerts.sunset.body': 'Faltam ~{minutes} min para o pôr do sol.',
    'alerts.lowLight.title': 'Começou a escurecer',
    'alerts.lowLight.body': 'Luminosidade em {light}%. Pode ser boa altura para luz artificial.',

    'light.title': 'Luminosidade Exterior',
    'light.levels': ['Escuridão', 'Luz muito fraca', 'Luz fraca', 'Luz moderada', 'Boa luminosidade', 'Luz forte'],

    'sunrise.label': 'Nascer do Sol',
    'sunset.label': 'Pôr do Sol',
    'status.nightTitle': 'Período Noturno',
    'status.nextSunrise': 'Próximo nascer do sol às {time}',
    'status.lightRemaining': 'Luz natural restante',
    'status.hours': 'h',
    'status.minutes': 'min',

    'forecast.lightLabel': '{light}%',

    'weather.desc.clear': 'Céu limpo',
    'weather.desc.mostlyClear': 'Maiormente limpo',
    'weather.desc.partlyCloudy': 'Parcialmente nublado',
    'weather.desc.overcast': 'Nublado',
    'weather.desc.fog': 'Nevoeiro',
    'weather.desc.lightRain': 'Chuva leve',
    'weather.desc.moderateRain': 'Chuva moderada',
    'weather.desc.heavyRain': 'Chuva forte',
    'weather.desc.lightSnow': 'Neve leve',
    'weather.desc.heavySnow': 'Neve forte',
    'weather.desc.thunder': 'Trovoada',

    'location.loading': 'Localização atual'
  },
  en: {
    'app.title': 'Daylight',
    'header.dateFormat': undefined,
    'lang.label': 'Language',
    'lang.pt': 'Portuguese',
    'lang.en': 'English',
    'lang.fr': 'French',

    'weather.simulation': 'Simulation',
    'weather.current': 'Current conditions',
    'weather.simulate': 'Simulate',
    'weather.back': 'Back to live',
    'weather.cloudCover': 'Cloud cover',
    'weather.loading': 'Fetching weather data…',
    'weather.tempDetail': '{temp}°C • {clouds}% clouds',

    'photo.title': 'Photography goal mode',
    'photo.golden.label': 'Golden hour',
    'photo.golden.hint': 'Soft warm light near sunset.',
    'photo.portrait.label': 'Portrait',
    'photo.portrait.hint': 'Prioritises stable light and moderate contrast.',
    'photo.landscape.label': 'Landscape',
    'photo.landscape.hint': 'Look for good light with sky detail.',
    'photo.long.label': 'Long exposure',
    'photo.long.hint': 'Great at dusk/night (tripod).',

    'photo.golden.night.headline': 'Golden hour ended',
    'photo.golden.night.detail': 'Next window is around the next sunrise/sunset.',
    'photo.golden.night.bullets': [
      'Try long exposure (tripod).',
      'Keep ISO low to reduce noise.'
    ],
    'photo.golden.window.headline': 'Great for golden hour',
    'photo.golden.window.detail': 'About ~{minutes} min to sunset ({sunset}).',
    'photo.golden.window.bullets': [
      'Conditions: {conditions}.',
      'Use WB “Cloudy”/“Shade” for warmer tones.',
      'Protect highlights: -0.3 to -1 EV if needed.'
    ],
    'photo.golden.plan.headline': 'Golden hour planning',
    'photo.golden.plan.detail': '~{minutes} min until sunset ({sunset}).',
    'photo.golden.plan.bullets': [
      'Current conditions: {conditions}.',
      'Scout location and framing in advance.',
      'As light drops, lower ISO and stabilise camera.'
    ],

    'photo.portrait.night.headline': 'Night portrait',
    'photo.portrait.night.detail': 'Natural light is too low; use continuous light/flash.',
    'photo.portrait.night.bullets': [
      'Prioritise sharp eyes (eye AF).',
      'Avoid pushing ISO too high.'
    ],
    'photo.portrait.day.headline': 'Portrait — available light',
    'photo.portrait.day.detail': 'Estimated light: {light}% • {lightDesc}.',
    'photo.portrait.day.bullets': [
      'Conditions: {conditions}.',
      'Find open shade for smoother skin tones.',
      'In strong sun, use diffuser or backlight.'
    ],

    'photo.landscape.night.headline': 'Night landscape',
    'photo.landscape.night.detail': 'Good time for cityscapes/stars (if sky cooperates).',
    'photo.landscape.night.bullets': [
      '{cloudsNote} — fewer clouds help astro.',
      'Tripod recommended.'
    ],
    'photo.landscape.day.headline': 'Landscape — quick read',
    'photo.landscape.day.detail': 'Light: {light}% • Sunset at {sunset}.',
    'photo.landscape.day.bullets': [
      'Sky: {conditions}.',
      'Consider bracketing/HDR if high contrast.',
      'Use a polariser carefully (may darken sky unevenly).'
    ],

    'photo.long.day.headline': 'Long exposure — get set',
    'photo.long.day.detail': 'Still daylight. Best near dusk (in ~{minutes} min).',
    'photo.long.day.bullets': [
      'Tripod + timer/remote.',
      'Low ISO; ND filter if needed.'
    ],
    'photo.long.night.headline': 'Long exposure — good conditions',
    'photo.long.night.detail': 'Light is low: great for trails/silky water.',
    'photo.long.night.bullets': [
      'Tripod is mandatory.',
      'Avoid vibrations (turn IS off on tripod).'
    ],

    'forecast.title': 'Light forecast (next hours)',
    'forecast.preparing': 'Preparing hourly forecast…',
    'forecast.description': 'Per-hour estimate (0–12h) based on clouds + sky state + time to sunset.',

    'alerts.title': 'Smart alerts',
    'alerts.active': 'Active',
    'alerts.inactive': 'Inactive',
    'alerts.notifications': 'Notifications',
    'alerts.permissionUnsupported': 'This browser does not support notifications.',
    'alerts.permissionLabel': 'Permission: {status}',
    'alerts.enablePermissions': 'Enable permissions',
    'alerts.sunsetReminder': 'Remind before sunset',
    'alerts.minutesBefore': 'Minutes before',
    'alerts.lowLight': 'Alert when light is low',
    'alerts.threshold': 'Threshold',
    'alerts.note': 'Note: alerts do not fire in manual mode.',
    'alerts.sunset.title': 'Sunset approaching',
    'alerts.sunset.body': '~{minutes} min until sunset.',
    'alerts.lowLight.title': 'Getting darker',
    'alerts.lowLight.body': 'Light at {light}%. Might be time for artificial light.',

    'light.title': 'Outdoor light',
    'light.levels': ['Darkness', 'Very low light', 'Low light', 'Moderate light', 'Good light', 'Strong light'],

    'sunrise.label': 'Sunrise',
    'sunset.label': 'Sunset',
    'status.nightTitle': 'Night period',
    'status.nextSunrise': 'Next sunrise at {time}',
    'status.lightRemaining': 'Daylight remaining',
    'status.hours': 'h',
    'status.minutes': 'min',

    'forecast.lightLabel': '{light}%',

    'weather.desc.clear': 'Clear sky',
    'weather.desc.mostlyClear': 'Mostly clear',
    'weather.desc.partlyCloudy': 'Partly cloudy',
    'weather.desc.overcast': 'Overcast',
    'weather.desc.fog': 'Foggy',
    'weather.desc.lightRain': 'Light rain',
    'weather.desc.moderateRain': 'Moderate rain',
    'weather.desc.heavyRain': 'Heavy rain',
    'weather.desc.lightSnow': 'Light snow',
    'weather.desc.heavySnow': 'Heavy snow',
    'weather.desc.thunder': 'Thunderstorm',

    'location.loading': 'Current location'
  },
  fr: {
    'app.title': 'Lumière du Jour',
    'header.dateFormat': undefined,
    'lang.label': 'Langue',
    'lang.pt': 'Portugais',
    'lang.en': 'Anglais',
    'lang.fr': 'Français',

    'weather.simulation': 'Simulation',
    'weather.current': 'Conditions actuelles',
    'weather.simulate': 'Simuler',
    'weather.back': 'Retour au direct',
    'weather.cloudCover': 'Couverture nuageuse',
    'weather.loading': 'Récupération des données météo…',
    'weather.tempDetail': '{temp}°C • {clouds}% nuages',

    'photo.title': 'Mode objectif photo',
    'photo.golden.label': 'Golden hour',
    'photo.golden.hint': 'Lumière douce et chaude près du coucher du soleil.',
    'photo.portrait.label': 'Portrait',
    'photo.portrait.hint': 'Priorise lumière stable et contraste modéré.',
    'photo.landscape.label': 'Paysage',
    'photo.landscape.hint': 'Cherche une bonne lumière avec détail du ciel.',
    'photo.long.label': 'Pose longue',
    'photo.long.hint': 'Idéal au crépuscule/nuit (trépied).',

    'photo.golden.night.headline': 'Golden hour terminée',
    'photo.golden.night.detail': 'Prochaine fenêtre au lever/coucher suivant.',
    'photo.golden.night.bullets': [
      'Essaie la pose longue (trépied).',
      'Garde un ISO bas pour réduire le bruit.'
    ],
    'photo.golden.window.headline': 'Bonne fenêtre golden hour',
    'photo.golden.window.detail': 'Il reste ~{minutes} min avant le coucher ({sunset}).',
    'photo.golden.window.bullets': [
      'Conditions : {conditions}.',
      'Balance des blancs “Cloudy/ Shade” pour plus de chaleur.',
      'Protège les hautes lumières : -0.3 à -1 EV si besoin.'
    ],
    'photo.golden.plan.headline': 'Planifier la golden hour',
    'photo.golden.plan.detail': 'Encore ~{minutes} min avant le coucher ({sunset}).',
    'photo.golden.plan.bullets': [
      'Conditions actuelles : {conditions}.',
      'Repère lieu et cadrage à l’avance.',
      'Quand la lumière baisse, réduis l’ISO et stabilise.'
    ],

    'photo.portrait.night.headline': 'Portrait nocturne',
    'photo.portrait.night.detail': 'Lumière naturelle insuffisante; utilise lumière continue/flash.',
    'photo.portrait.night.bullets': [
      'Priorise les yeux nets (AF œil).',
      'Évite un ISO trop élevé.'
    ],
    'photo.portrait.day.headline': 'Portrait — lumière dispo',
    'photo.portrait.day.detail': 'Lumière estimée : {light}% • {lightDesc}.',
    'photo.portrait.day.bullets': [
      'Conditions : {conditions}.',
      'Cherche une ombre ouverte pour une peau uniforme.',
      'En plein soleil, diffuseur ou contre-jour.'
    ],

    'photo.landscape.night.headline': 'Paysage nocturne',
    'photo.landscape.night.detail': 'Bon moment pour cityscapes/étoiles (si le ciel aide).',
    'photo.landscape.night.bullets': [
      '{cloudsNote} — moins de nuages aide l’astro.',
      'Trépied recommandé.'
    ],
    'photo.landscape.day.headline': 'Paysage — lecture rapide',
    'photo.landscape.day.detail': 'Lumière : {light}% • Coucher à {sunset}.',
    'photo.landscape.day.bullets': [
      'Ciel : {conditions}.',
      'Pense au bracketing/HDR si fort contraste.',
      'Polariseur avec prudence (peut assombrir le ciel de façon inégale).'
    ],

    'photo.long.day.headline': 'Pose longue — prépare-toi',
    'photo.long.day.detail': 'Encore de la lumière. Idéal près du crépuscule (dans ~{minutes} min).',
    'photo.long.day.bullets': [
      'Trépied + timer/remote.',
      'ISO bas; filtre ND si besoin.'
    ],
    'photo.long.night.headline': 'Pose longue — bonnes conditions',
    'photo.long.night.detail': 'Lumière basse : parfait pour filés/eau soyeuse.',
    'photo.long.night.bullets': [
      'Trépied obligatoire.',
      'Évite les vibrations (désactive la stab sur trépied).'
    ],

    'forecast.title': 'Prévision de lumière (prochaines heures)',
    'forecast.preparing': 'Préparation de la prévision horaire…',
    'forecast.description': 'Estimation horaire (0–12h) basée sur nuages + état du ciel + temps avant coucher.',

    'alerts.title': 'Alertes intelligentes',
    'alerts.active': 'Actives',
    'alerts.inactive': 'Inactives',
    'alerts.notifications': 'Notifications',
    'alerts.permissionUnsupported': 'Ce navigateur ne supporte pas les notifications.',
    'alerts.permissionLabel': 'Permission : {status}',
    'alerts.enablePermissions': 'Activer les permissions',
    'alerts.sunsetReminder': 'Rappeler avant le coucher',
    'alerts.minutesBefore': 'Minutes avant',
    'alerts.lowLight': 'Alerter quand la lumière baisse',
    'alerts.threshold': 'Seuil',
    'alerts.note': 'Note : pas d’alerte en mode manuel.',
    'alerts.sunset.title': 'Coucher de soleil proche',
    'alerts.sunset.body': 'Il reste ~{minutes} min avant le coucher.',
    'alerts.lowLight.title': 'La luminosité baisse',
    'alerts.lowLight.body': 'Lumière à {light}%. Peut-être passer à la lumière artificielle.',

    'light.title': 'Luminosité extérieure',
    'light.levels': ['Obscurité', 'Lumière très faible', 'Lumière faible', 'Lumière modérée', 'Bonne luminosité', 'Lumière forte'],

    'sunrise.label': 'Lever du soleil',
    'sunset.label': 'Coucher du soleil',
    'status.nightTitle': 'Période nocturne',
    'status.nextSunrise': 'Prochain lever à {time}',
    'status.lightRemaining': 'Lumière restante',
    'status.hours': 'h',
    'status.minutes': 'min',

    'forecast.lightLabel': '{light}%',

    'weather.desc.clear': 'Ciel dégagé',
    'weather.desc.mostlyClear': 'Plutôt dégagé',
    'weather.desc.partlyCloudy': 'Partiellement nuageux',
    'weather.desc.overcast': 'Couvert',
    'weather.desc.fog': 'Brouillard',
    'weather.desc.lightRain': 'Pluie faible',
    'weather.desc.moderateRain': 'Pluie modérée',
    'weather.desc.heavyRain': 'Pluie forte',
    'weather.desc.lightSnow': 'Neige faible',
    'weather.desc.heavySnow': 'Neige forte',
    'weather.desc.thunder': 'Orage',

    'location.loading': 'Localisation actuelle'
  }
};

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('luzDoDia.lang') || 'pt';
    } catch (e) {
      return 'pt';
    }
  });
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

  const locale = localeMap[lang] || 'pt-PT';
  const t = useCallback((key, vars = {}) => {
    const pack = translations[lang] || translations.pt;
    const fallback = translations.pt;
    const value = (pack && pack[key] !== undefined ? pack[key] : fallback[key]) ?? key;
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return value;
    return value.replace(/\{(\w+)\}/g, (_, v) => (vars && vars[v] !== undefined ? vars[v] : `{${v}}`));
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('luzDoDia.lang', lang);
    } catch (e) {}
  }, [lang]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lon: longitude, name: t('location.loading') });
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || t('location.loading');
            setLocation(l => ({ ...l, name: city }));
          } catch (e) { setLocation(l => ({ ...l, name: t('location.loading') })); }
        },
        () => {}
      );
    }
  }, [t]);

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

  const weatherOptions = useMemo(() => ([
    { code: 0, desc: t('weather.desc.clear'), icon: '☀️', mult: 1.0 },
    { code: 1, desc: t('weather.desc.mostlyClear'), icon: '🌤️', mult: 0.9 },
    { code: 2, desc: t('weather.desc.partlyCloudy'), icon: '⛅', mult: 0.7 },
    { code: 3, desc: t('weather.desc.overcast'), icon: '☁️', mult: 0.4 },
    { code: 45, desc: t('weather.desc.fog'), icon: '🌫️', mult: 0.2 },
    { code: 61, desc: t('weather.desc.lightRain'), icon: '🌧️', mult: 0.3 },
    { code: 63, desc: t('weather.desc.moderateRain'), icon: '🌧️', mult: 0.2 },
    { code: 65, desc: t('weather.desc.heavyRain'), icon: '🌧️', mult: 0.12 },
    { code: 71, desc: t('weather.desc.lightSnow'), icon: '🌨️', mult: 0.35 },
    { code: 75, desc: t('weather.desc.heavySnow'), icon: '❄️', mult: 0.15 },
    { code: 95, desc: t('weather.desc.thunder'), icon: '⛈️', mult: 0.1 },
  ]), [t]);

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
  const lightLevels = t('light.levels') || [];
  const desc = lightLevels[level] || lightLevels[lightLevels.length - 1] || '';
  
  const sky = isNight ? 'sky-night' : wInfo?.mult < 0.3 ? 'sky-dark' : wInfo?.mult < 0.5 ? 'sky-cloudy' : 'sky-clear';
  const sunX = isNight ? -20 : 10 + progress * 80;
  const sunY = 50 - Math.sin(progress * Math.PI) * 40;
  const isRain = [61,63,65,80,81,95].includes(code);
  const isSnow = [71,73,75,85].includes(code);

  const dateKey = time.toLocaleDateString(locale);

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

  const goalOptions = useMemo(() => ([
    { id: 'golden', label: t('photo.golden.label'), hint: t('photo.golden.hint') },
    { id: 'portrait', label: t('photo.portrait.label'), hint: t('photo.portrait.hint') },
    { id: 'landscape', label: t('photo.landscape.label'), hint: t('photo.landscape.hint') },
    { id: 'long', label: t('photo.long.label'), hint: t('photo.long.hint') },
  ]), [t]);

  const getPhotoAdvice = () => {
    const nowMinutes = time.getHours() * 60 + time.getMinutes();
    const sunsetMinutes = Math.round(sunset * 60);
    const sunriseMinutes = Math.round(sunrise * 60);
    const minutesToSunset = Math.max(0, sunsetMinutes - nowMinutes);
    const cloudsNote = `${clouds}%`;
    const conditionsText = `${wInfo?.desc || ''}${cloudsNote ? ` • ${cloudsNote}` : ''}`;

    if (photoGoal === 'golden') {
      if (isNight) {
        return {
          headline: t('photo.golden.night.headline'),
          detail: t('photo.golden.night.detail'),
          bullets: t('photo.golden.night.bullets')
        };
      }

      const inWindow = minutesToSunset <= 90;
      if (inWindow) {
        return {
          headline: t('photo.golden.window.headline'),
          detail: t('photo.golden.window.detail', { minutes: minutesToSunset, sunset: fmtMinutes(sunsetMinutes) }),
          bullets: t('photo.golden.window.bullets').map((b) => b.replace('{conditions}', conditionsText))
        };
      }
      return {
        headline: t('photo.golden.plan.headline'),
        detail: t('photo.golden.plan.detail', { minutes: minutesToSunset, sunset: fmtMinutes(sunsetMinutes) }),
        bullets: t('photo.golden.plan.bullets').map((b) => b.replace('{conditions}', conditionsText))
      };
    }

    if (photoGoal === 'portrait') {
      if (isNight) {
        return {
          headline: t('photo.portrait.night.headline'),
          detail: t('photo.portrait.night.detail'),
          bullets: t('photo.portrait.night.bullets')
        };
      }
      return {
        headline: t('photo.portrait.day.headline'),
        detail: t('photo.portrait.day.detail', { light, lightDesc: desc.toLowerCase?.() || desc }),
        bullets: t('photo.portrait.day.bullets').map((b) => b.replace('{conditions}', conditionsText))
      };
    }

    if (photoGoal === 'landscape') {
      if (isNight) {
        return {
          headline: t('photo.landscape.night.headline'),
          detail: t('photo.landscape.night.detail'),
          bullets: t('photo.landscape.night.bullets').map((b) => b.replace('{cloudsNote}', cloudsNote))
        };
      }
      return {
        headline: t('photo.landscape.day.headline'),
        detail: t('photo.landscape.day.detail', { light, sunset: fmtMinutes(Math.round(sunset * 60)) }),
        bullets: t('photo.landscape.day.bullets').map((b) => b.replace('{conditions}', conditionsText))
      };
    }

    // long exposure
    if (!isNight && nowMinutes >= sunriseMinutes && nowMinutes <= sunsetMinutes) {
      return {
        headline: t('photo.long.day.headline'),
        detail: t('photo.long.day.detail', { minutes: Math.max(0, sunsetMinutes - nowMinutes) }),
        bullets: t('photo.long.day.bullets')
      };
    }
    return {
      headline: t('photo.long.night.headline'),
      detail: t('photo.long.night.detail'),
      bullets: t('photo.long.night.bullets')
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
        label: t.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
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
          title: t('alerts.sunset.title'),
          body: t('alerts.sunset.body', { minutes: alertSettings.sunsetReminderMinutes })
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
          title: t('alerts.lowLight.title'),
          body: t('alerts.lowLight.body', { light })
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
    dateKey,
    t
  ]);

  return (
    <div className={`app ${sky}`}>
      <div className="container">
        <div className="lang-switcher">
          <label htmlFor="lang-select">{t('lang.label')}</label>
          <select
            id="lang-select"
            className="select select-compact"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
        </div>
        {/* Header */}
        <header className="header">
          <h1 className="title">
            <span className="title-icon">☀️</span>
            {t('app.title')}
          </h1>
          <p className="date">
            {time.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
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
          <div className="time-display">{time.toLocaleTimeString(locale)}</div>
        </div>

        {/* Weather Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              <span className="card-title-dot" />
              {manualMode ? t('weather.simulation') : t('weather.current')}
            </span>
            <button 
              className={`btn ${manualMode ? 'active' : ''}`} 
              onClick={() => setManualMode(!manualMode)}
            >
              {manualMode ? t('weather.back') : t('weather.simulate')}
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
                  <span className="range-label">{t('weather.cloudCover')}</span>
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
                    ? t('weather.tempDetail', { temp: Math.round(weather.current.temperature_2m), clouds })
                    : t('weather.loading')
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
              {t('photo.title')}
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
              {t('forecast.title')}
            </span>
          </div>

          {!forecast.length ? (
            <div className="weather-detail">{t('forecast.preparing')}</div>
          ) : (
            <div>
              <div className="weather-detail" style={{ marginBottom: 10 }}>
                {t('forecast.description')}
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
                      <div style={{ fontSize: 12, opacity: 0.9 }}>{t('forecast.lightLabel', { light: p.light })}</div>
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
              {t('alerts.title')}
            </span>
            <button
              className={`btn ${alertSettings.enabled ? 'active' : ''}`}
              onClick={() => setAlertSettings(s => ({ ...s, enabled: !s.enabled }))}
            >
              {alertSettings.enabled ? t('alerts.active') : t('alerts.inactive')}
            </button>
          </div>

          <div className="weather-display" style={{ alignItems: 'flex-start' }}>
            <div className="weather-info" style={{ width: '100%' }}>
              <div className="weather-desc">{t('alerts.notifications')}</div>
              <div className="weather-detail">
                {notificationPermission === 'unsupported'
                  ? t('alerts.permissionUnsupported')
                  : t('alerts.permissionLabel', { status: notificationPermission })}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn" onClick={requestNotificationPermission}>
                  {t('alerts.enablePermissions')}
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
                  <span>{t('alerts.sunsetReminder')}</span>
                </label>
                <div className="range-container" style={{ opacity: alertSettings.enabled && alertSettings.sunsetReminderEnabled ? 1 : 0.5 }}>
                  <div className="range-header">
                    <span className="range-label">{t('alerts.minutesBefore')}</span>
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
                  <span>{t('alerts.lowLight')}</span>
                </label>
                <div className="range-container" style={{ opacity: alertSettings.enabled && alertSettings.lowLightEnabled ? 1 : 0.5 }}>
                  <div className="range-header">
                    <span className="range-label">{t('alerts.threshold')}</span>
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

                <div className="weather-detail">{t('alerts.note')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Light Meter - Hero Component */}
        <div className={`card light-meter level-${level}`}>
          <div className="light-label">
            💡 {t('light.title')}
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
            <div className="grid-label">{t('sunrise.label')}</div>
            <div className="grid-value">{fmt(sunrise)}</div>
          </div>
          <div className="grid-item">
            <div className="grid-icon">🌇</div>
            <div className="grid-label">{t('sunset.label')}</div>
            <div className="grid-value">{fmt(sunset)}</div>
          </div>
        </div>

        {/* Status Card */}
        <div className="card status-card">
          {isNight ? (
            <>
              <div className="status-icon">🌙</div>
              <div className="status-title">{t('status.nightTitle')}</div>
              <div className="status-subtitle">{t('status.nextSunrise', { time: fmt(sunrise) })}</div>
            </>
          ) : (
            <>
              <div className="status-subtitle">{t('status.lightRemaining')}</div>
              <div className="time-remaining">
                <span className="time-remaining-value">{hLeft}</span>
                <span className="time-remaining-unit">{t('status.hours')}</span>
                <span className="time-remaining-value">{mLeft}</span>
                <span className="time-remaining-unit">{t('status.minutes')}</span>
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