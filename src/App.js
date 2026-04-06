import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import AlertsCenter from './components/AlertsCenter';
import BriefingHero from './components/BriefingHero';
import GoalTabs from './components/GoalTabs';
import InsightsPanel from './components/InsightsPanel';
import MetricsGrid from './components/MetricsGrid';
import SceneLab from './components/SceneLab';
import SolarPanel from './components/SolarPanel';
import TimelinePanel from './components/TimelinePanel';
import UtilityBar from './components/UtilityBar';
import {
  formatClock,
  formatCoordinates,
  formatDurationMinutes,
  formatFullDate,
  formatSignedMinutes,
  formatWindowRange,
  timeInputToDate,
  toTimeInputValue
} from './lib/format';
import { createTranslator, localeMap } from './lib/i18n';
import { getMoonData } from './lib/moon';
import {
  createWeatherCacheRecord,
  restoreLocationFromStorage,
  restoreWeatherFromStorage,
  sanitizeLocationForStorage,
  shouldRemoveWeatherCache
} from './lib/persistence';
import {
  buildPackingHints,
  buildSetupHints,
  buildTimelinePoints,
  buildTodayTomorrowComparison,
  computeSceneSnapshot,
  findBestWindow,
  getScoreBand,
  getTrendData
} from './lib/scoring';
import { getSunData, getSunDataForDate } from './lib/solar';
import { readStorage, readString, removeStorage, writeStorage, writeString } from './lib/storage';
import { fetchWeatherForecast, getWeatherOptions, getWeatherProfile, reverseGeocode } from './lib/weather';

const DEFAULT_LOCATION = {
  lat: 38.7223,
  lon: -9.1393,
  name: 'Lisboa'
};

const STORAGE_KEYS = {
  lang: 'luzDoDia.lang.v2',
  goal: 'luzDoDia.goal.v2',
  scene: 'luzDoDia.scene.v2',
  alerts: 'luzDoDia.alerts.v2',
  alertState: 'luzDoDia.alertState.v2',
  location: 'luzDoDia.location.v3',
  weather: 'luzDoDia.weather.v3'
};

const LEGACY_STORAGE_KEYS = {
  location: 'luzDoDia.location.v2',
  weather: 'luzDoDia.weather.v2'
};

const DEFAULT_ALERTS = {
  enabled: false,
  goalAlertEnabled: true,
  goalId: 'golden',
  goalThreshold: 78,
  goalLeadMinutes: 45,
  sunsetReminderEnabled: true,
  sunsetReminderMinutes: 30,
  lowLightEnabled: false,
  lowLightThreshold: 20
};

const DEFAULT_ALERT_STATE = {
  sunsetDateKey: null,
  lowLightDateKey: null,
  goalWindowKey: null
};

const THEME_COLORS = {
  'theme-night': '#0d1b2a',
  'theme-night-storm': '#172033',
  'theme-blue': '#15354f',
  'theme-golden': '#a95812',
  'theme-clear': '#155e75',
  'theme-rain': '#243447',
  'theme-overcast': '#49586c',
  'theme-balanced': '#234258'
};

function getAlertPreset(goalId) {
  if (goalId === 'portrait') {
    return {
      goalId,
      goalThreshold: 72,
      goalLeadMinutes: 30,
      sunsetReminderEnabled: false,
      lowLightEnabled: false
    };
  }

  if (goalId === 'landscape') {
    return {
      goalId,
      goalThreshold: 75,
      goalLeadMinutes: 60,
      sunsetReminderEnabled: true,
      lowLightEnabled: false
    };
  }

  if (goalId === 'long') {
    return {
      goalId,
      goalThreshold: 68,
      goalLeadMinutes: 45,
      sunsetReminderEnabled: true,
      lowLightEnabled: true,
      lowLightThreshold: 35
    };
  }

  if (goalId === 'astro') {
    return {
      goalId,
      goalThreshold: 64,
      goalLeadMinutes: 70,
      sunsetReminderEnabled: false,
      lowLightEnabled: false
    };
  }

  return {
    goalId,
    goalThreshold: 78,
    goalLeadMinutes: 45,
    sunsetReminderEnabled: true,
    lowLightEnabled: false
  };
}

function getThemeClass(snapshot) {
  if (snapshot.phase.key === 'night' && snapshot.weatherProfile.precipitation) {
    return 'theme-night-storm';
  }
  if (snapshot.phase.key === 'night') {
    return 'theme-night';
  }
  if (snapshot.phase.isBlue) {
    return 'theme-blue';
  }
  if (snapshot.phase.isGolden) {
    return 'theme-golden';
  }
  if (snapshot.weatherProfile.precipitation) {
    return 'theme-rain';
  }
  if (snapshot.weatherProfile.id === 'overcast' || snapshot.clouds > 75) {
    return 'theme-overcast';
  }
  if (snapshot.phase.key === 'solarPeak') {
    return 'theme-clear';
  }
  return 'theme-balanced';
}

async function showAlertNotification({ title, body, tag }) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return false;
  }

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      body,
      tag,
      icon: `${process.env.PUBLIC_URL}/logo192.png`,
      badge: `${process.env.PUBLIC_URL}/logo192.png`,
      data: {
        url: `${window.location.origin}${process.env.PUBLIC_URL || ''}/`
      }
    });
    return true;
  }

  new Notification(title, { body, tag });
  return true;
}

function readStoredLocation() {
  const storedLocation = readStorage(STORAGE_KEYS.location, null) || readStorage(LEGACY_STORAGE_KEYS.location, null);
  return restoreLocationFromStorage(storedLocation, DEFAULT_LOCATION);
}

function readStoredWeather() {
  const storedWeather = readStorage(STORAGE_KEYS.weather, null) || readStorage(LEGACY_STORAGE_KEYS.weather, null);
  return restoreWeatherFromStorage(storedWeather, {
    allowStale: typeof navigator !== 'undefined' ? navigator.onLine === false : false
  });
}

export default function App() {
  const initialWeather = readStoredWeather();
  const [lang, setLang] = useState(() => readString(STORAGE_KEYS.lang, 'pt'));
  const [selectedGoal, setSelectedGoal] = useState(() => readString(STORAGE_KEYS.goal, 'golden'));
  const [now, setNow] = useState(new Date());
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [location, setLocation] = useState(readStoredLocation);
  const [weatherData, setWeatherData] = useState(initialWeather);
  const [fetchState, setFetchState] = useState(initialWeather ? 'ready' : 'loading');
  const [weatherSource, setWeatherSource] = useState(initialWeather ? 'cache' : 'live');
  const [scene, setScene] = useState(() =>
    readStorage(STORAGE_KEYS.scene, {
      enabled: false,
      time: toTimeInputValue(new Date()),
      clouds: 35,
      code: 2
    })
  );
  const [alertSettings, setAlertSettings] = useState(() => readStorage(STORAGE_KEYS.alerts, DEFAULT_ALERTS));
  const [alertState, setAlertState] = useState(() => readStorage(STORAGE_KEYS.alertState, DEFAULT_ALERT_STATE));
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (typeof Notification === 'undefined') {
      return 'unsupported';
    }
    return Notification.permission;
  });
  const weatherDataAvailableRef = useRef(Boolean(initialWeather));

  const t = useMemo(() => createTranslator(lang), [lang]);
  const locale = localeMap[lang] || localeMap.pt;
  const durationLabels = useMemo(
    () => ({
      hours: t('common.hours'),
      minutes: t('common.minutes')
    }),
    [t]
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof Notification === 'undefined') {
      return undefined;
    }

    const syncPermission = () => setNotificationPermission(Notification.permission);
    document.addEventListener('visibilitychange', syncPermission);

    return () => document.removeEventListener('visibilitychange', syncPermission);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    removeStorage(LEGACY_STORAGE_KEYS.location);
    removeStorage(LEGACY_STORAGE_KEYS.weather);

    const currentWeatherCache = readStorage(STORAGE_KEYS.weather, null);
    if (shouldRemoveWeatherCache(currentWeatherCache)) {
      removeStorage(STORAGE_KEYS.weather);
    }
  }, []);

  useEffect(() => {
    writeString(STORAGE_KEYS.lang, lang);
  }, [lang]);

  useEffect(() => {
    writeString(STORAGE_KEYS.goal, selectedGoal);
  }, [selectedGoal]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.scene, scene);
  }, [scene]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.alerts, alertSettings);
  }, [alertSettings]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.alertState, alertState);
  }, [alertState]);

  useEffect(() => {
    const persistedLocation = sanitizeLocationForStorage(location);
    if (persistedLocation) {
      writeStorage(STORAGE_KEYS.location, persistedLocation);
    }
  }, [location]);

  useEffect(() => {
    weatherDataAvailableRef.current = Boolean(weatherData);
    if (!weatherData) {
      removeStorage(STORAGE_KEYS.weather);
      return;
    }

    const weatherCacheRecord = createWeatherCacheRecord(weatherData);
    if (weatherCacheRecord) {
      writeStorage(STORAGE_KEYS.weather, weatherCacheRecord);
    }
  }, [weatherData]);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      return undefined;
    }

    let active = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!active) {
          return;
        }

        setLocation((previous) => ({
          ...previous,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          name: ''
        }));
      },
      () => {},
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 600000
      }
    );

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const resolveLocationName = async () => {
      try {
        const name = await reverseGeocode({
          lat: location.lat,
          lon: location.lon,
          lang
        });

        if (active && name) {
          setLocation((previous) => ({
            ...previous,
            name
          }));
        }
      } catch (error) {
        if (active) {
          setLocation((previous) => ({
            ...previous,
            name: previous.name || t('utility.locating')
          }));
        }
      }
    };

    resolveLocationName();

    return () => {
      active = false;
    };
  }, [location.lat, location.lon, lang, t]);

  useEffect(() => {
    let active = true;

    const refreshWeather = async () => {
      const hasStoredWeather = weatherDataAvailableRef.current;

      if (!online && hasStoredWeather) {
        setWeatherSource('cache');
        setFetchState('ready');
        return;
      }

      setFetchState(hasStoredWeather ? 'refreshing' : 'loading');

      try {
        const nextWeather = await fetchWeatherForecast({
          lat: location.lat,
          lon: location.lon
        });

        if (!active) {
          return;
        }

        weatherDataAvailableRef.current = true;
        setWeatherData(nextWeather);
        setWeatherSource(online ? 'live' : 'cache');
        setFetchState('ready');
      } catch (error) {
        if (!active) {
          return;
        }

        const storedWeather = readStorage(STORAGE_KEYS.weather, null) || readStorage(LEGACY_STORAGE_KEYS.weather, null);
        const fallbackWeather = restoreWeatherFromStorage(storedWeather, {
          allowStale: true
        });

        if (fallbackWeather) {
          weatherDataAvailableRef.current = true;
          setWeatherData(fallbackWeather);
          setFetchState('ready');
          setWeatherSource('cache');
          return;
        }

        setFetchState(weatherDataAvailableRef.current ? 'ready' : 'error');
        setWeatherSource('cache');
      }
    };

    refreshWeather();
    const intervalId = window.setInterval(refreshWeather, 10 * 60 * 1000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [location.lat, location.lon, online]);

  const liveWeatherCode = weatherData?.current?.weather_code ?? weatherData?.hourly?.weather_code?.[0] ?? 1;
  const liveClouds = weatherData?.current?.cloud_cover ?? weatherData?.hourly?.cloud_cover?.[0] ?? 40;
  const liveWind = weatherData?.current?.wind_speed_10m ?? weatherData?.hourly?.wind_speed_10m?.[0] ?? 10;
  const liveTemperature = weatherData?.current?.temperature_2m ?? weatherData?.hourly?.temperature_2m?.[0] ?? 19;
  const liveFeelsLike = weatherData?.current?.apparent_temperature ?? weatherData?.hourly?.apparent_temperature?.[0] ?? liveTemperature;
  const livePrecipitation = weatherData?.hourly?.precipitation_probability?.[0] ?? 0;

  const liveSunData = useMemo(() => getSunData(weatherData, now), [weatherData, now]);
  const liveMoonData = useMemo(() => getMoonData(now), [now]);
  const liveSnapshot = useMemo(
    () =>
      computeSceneSnapshot({
        date: now,
        sunData: getSunDataForDate(liveSunData, now),
        weatherCode: liveWeatherCode,
        clouds: liveClouds,
        wind: liveWind,
        precipitationProbability: livePrecipitation,
        moonData: liveMoonData
      }),
    [liveClouds, liveMoonData, livePrecipitation, liveSunData, liveWeatherCode, liveWind, now]
  );

  const activeDate = scene.enabled ? timeInputToDate(now, scene.time) : now;
  const activeMoonData = useMemo(() => getMoonData(activeDate), [activeDate]);
  const activeWeatherCode = scene.enabled ? scene.code : liveWeatherCode;
  const activeClouds = scene.enabled ? scene.clouds : liveClouds;
  const activeSnapshot = useMemo(() => {
    if (!scene.enabled) {
      return liveSnapshot;
    }

    return computeSceneSnapshot({
      date: activeDate,
      sunData: getSunDataForDate(liveSunData, activeDate),
      weatherCode: scene.code,
      clouds: scene.clouds,
      wind: liveWind,
      precipitationProbability: livePrecipitation,
      moonData: activeMoonData
    });
  }, [activeDate, activeMoonData, livePrecipitation, liveSnapshot, liveSunData, liveWind, scene.clouds, scene.code, scene.enabled]);

  const goalOptions = useMemo(
    () => [
      { id: 'golden', label: t('goals.golden.label'), hint: t('goals.golden.hint') },
      { id: 'portrait', label: t('goals.portrait.label'), hint: t('goals.portrait.hint') },
      { id: 'landscape', label: t('goals.landscape.label'), hint: t('goals.landscape.hint') },
      { id: 'long', label: t('goals.long.label'), hint: t('goals.long.hint') },
      { id: 'astro', label: t('goals.astro.label'), hint: t('goals.astro.hint') }
    ],
    [t]
  );
  const selectedGoalMeta = goalOptions.find((goal) => goal.id === selectedGoal) || goalOptions[0];
  const weatherOptions = useMemo(() => getWeatherOptions(t), [t]);

  const activeFuturePoints = useMemo(
    () =>
      buildTimelinePoints({
        weatherData,
        baseDate: activeDate,
        sunData: liveSunData,
        manualScene: scene.enabled
          ? {
              enabled: true,
              code: scene.code,
              clouds: scene.clouds,
              wind: liveWind,
              precipitationProbability: livePrecipitation
            }
          : null,
        moonData: activeMoonData,
        hours: 12
      }),
    [activeDate, activeMoonData, livePrecipitation, liveSunData, liveWind, scene.clouds, scene.code, scene.enabled, weatherData]
  );

  const liveFuturePoints = useMemo(
    () =>
      buildTimelinePoints({
        weatherData,
        baseDate: now,
        sunData: liveSunData,
        moonData: liveMoonData,
        hours: 12
      }),
    [liveMoonData, liveSunData, now, weatherData]
  );

  const activeCurrentPoint = useMemo(
    () => ({
      date: activeDate,
      weatherCode: activeWeatherCode,
      clouds: activeClouds,
      wind: liveWind,
      precipitationProbability: livePrecipitation,
      ...activeSnapshot
    }),
    [activeClouds, activeDate, activeSnapshot, activeWeatherCode, livePrecipitation, liveWind]
  );

  const liveCurrentPoint = useMemo(
    () => ({
      date: now,
      weatherCode: liveWeatherCode,
      clouds: liveClouds,
      wind: liveWind,
      precipitationProbability: livePrecipitation,
      ...liveSnapshot
    }),
    [liveClouds, livePrecipitation, liveSnapshot, liveWeatherCode, liveWind, now]
  );

  const timelinePoints = useMemo(
    () =>
      [activeCurrentPoint, ...activeFuturePoints.filter((point) => Math.abs(point.date.getTime() - activeDate.getTime()) > 20 * 60000)].slice(0, 13),
    [activeCurrentPoint, activeDate, activeFuturePoints]
  );

  const liveTimelinePoints = useMemo(
    () =>
      [liveCurrentPoint, ...liveFuturePoints.filter((point) => Math.abs(point.date.getTime() - now.getTime()) > 20 * 60000)].slice(0, 13),
    [liveCurrentPoint, liveFuturePoints, now]
  );

  const bestWindow = useMemo(
    () => findBestWindow(timelinePoints, selectedGoal, activeDate),
    [activeDate, selectedGoal, timelinePoints]
  );

  const alertWindow = useMemo(
    () => findBestWindow(liveTimelinePoints, alertSettings.goalId, now),
    [alertSettings.goalId, liveTimelinePoints, now]
  );

  const trend = useMemo(() => getTrendData(timelinePoints, selectedGoal), [selectedGoal, timelinePoints]);
  const comparisonRaw = useMemo(
    () =>
      buildTodayTomorrowComparison({
        weatherData,
        goalId: selectedGoal,
        baseDate: now,
        sunData: liveSunData,
        moonData: liveMoonData
      }),
    [liveMoonData, liveSunData, now, selectedGoal, weatherData]
  );

  const currentGoalScore = activeSnapshot.scores[selectedGoal];
  const scoreBandLabel = t(`score.${getScoreBand(currentGoalScore)}`);
  const phaseLabel = t(`phase.${activeSnapshot.phase.key}`);
  const weatherLabel = t(`weather.${activeSnapshot.weatherProfile.id}`);
  const stateText = t('briefing.stateLine', {
    weather: weatherLabel,
    light: activeSnapshot.light,
    softness: activeSnapshot.softness
  });
  const windowText = bestWindow?.meaningful ? formatWindowRange(bestWindow.start, bestWindow.end, locale) : t('briefing.windowWeak');
  const currentDateText = `${formatFullDate(activeDate, locale)} • ${formatClock(activeDate, locale)}`;

  let ctaKey = 'cta.wait';
  if (currentGoalScore >= 78) {
    ctaKey = selectedGoal === 'long' || selectedGoal === 'astro' ? 'cta.tripod' : 'cta.goNow';
  } else if (bestWindow?.meaningful && bestWindow.leadMinutes <= 60) {
    ctaKey = 'cta.packNow';
  } else if (bestWindow?.meaningful && bestWindow.peakScore >= 68) {
    ctaKey = 'cta.watchSky';
  } else if (selectedGoal === 'golden' || selectedGoal === 'landscape') {
    ctaKey = 'cta.scout';
  }

  const ctaText = t(ctaKey);
  const decisionText = currentGoalScore >= 78
    ? t('briefing.decisionNow', { goal: selectedGoalMeta.label.toLowerCase() })
    : bestWindow?.meaningful
      ? t('briefing.decisionNext', {
          delta: formatDurationMinutes(bestWindow.leadMinutes, durationLabels),
          window: formatWindowRange(bestWindow.start, bestWindow.end, locale)
        })
      : t('briefing.decisionWeak');

  const metrics = [
    {
      id: 'softness',
      label: t('metrics.softness'),
      value: activeSnapshot.softness,
      unit: '%',
      caption: t('metrics.softnessHint'),
      tone: 'cool'
    },
    {
      id: 'hardLight',
      label: t('metrics.hardLight'),
      value: activeSnapshot.hardLight,
      unit: '%',
      caption: t('metrics.hardLightHint'),
      tone: activeSnapshot.hardLight > 60 ? 'warm' : 'neutral'
    },
    {
      id: 'skyDrama',
      label: t('metrics.skyDrama'),
      value: activeSnapshot.skyDrama,
      unit: '%',
      caption: t('metrics.skyDramaHint'),
      tone: 'accent'
    },
    {
      id: 'trend',
      label: t('metrics.trend'),
      value: `${trend.delta > 0 ? '+' : ''}${trend.delta}`,
      unit: '',
      caption: `${t(`metrics.${trend.labelKey}`)} • ${t('metrics.trendHint')}`,
      tone: trend.delta > 0 ? 'positive' : trend.delta < 0 ? 'negative' : 'neutral'
    },
    {
      id: 'tripod',
      label: t('metrics.tripod'),
      value: activeSnapshot.tripodNeed,
      unit: '%',
      caption: t('metrics.tripodHint'),
      tone: activeSnapshot.tripodNeed > 60 ? 'warm' : 'cool'
    }
  ];

  const packingHints = useMemo(
    () => buildPackingHints({ goalId: selectedGoal, snapshot: activeSnapshot }),
    [activeSnapshot, selectedGoal]
  );

  const setupHints = useMemo(
    () => buildSetupHints({ goalId: selectedGoal, snapshot: activeSnapshot }),
    [activeSnapshot, selectedGoal]
  );

  const darknessScore = Math.max(0, Math.min(100, Math.round((100 - activeMoonData.illumination) * 0.7 + (100 - activeClouds) * 0.3)));
  const comparison = useMemo(() => {
    if (!comparisonRaw) {
      return null;
    }

    return {
      todayPeak: comparisonRaw.todayBest?.meaningful
        ? `${comparisonRaw.todayBest.peakScore}% • ${formatWindowRange(comparisonRaw.todayBest.start, comparisonRaw.todayBest.end, locale)}`
        : t('timeline.noWindow'),
      tomorrowPeak: comparisonRaw.tomorrowBest?.meaningful
        ? `${comparisonRaw.tomorrowBest.peakScore}% • ${formatWindowRange(comparisonRaw.tomorrowBest.start, comparisonRaw.tomorrowBest.end, locale)}`
        : t('timeline.noWindow'),
      daylightDelta: formatSignedMinutes(comparisonRaw.daylightDeltaMinutes, durationLabels),
      sunshineBias: comparisonRaw.tomorrowSunshineBias !== null ? `${comparisonRaw.tomorrowSunshineBias}%` : '--',
      tomorrowWeather: t(`weather.${getWeatherProfile(comparisonRaw.tomorrowWeatherCode).id}`),
      tomorrowTemperature:
        comparisonRaw.tomorrowLow !== null && comparisonRaw.tomorrowHigh !== null
          ? `${Math.round(comparisonRaw.tomorrowLow)}° / ${Math.round(comparisonRaw.tomorrowHigh)}°`
          : '--'
    };
  }, [comparisonRaw, durationLabels, locale, t]);

  const technicalStats = [
    { label: t('insights.temperature'), value: `${Math.round(liveTemperature)}°C` },
    { label: t('insights.feelsLike'), value: `${Math.round(liveFeelsLike)}°C` },
    { label: t('insights.wind'), value: `${Math.round(liveWind)} km/h` },
    { label: t('insights.precip'), value: `${Math.round(livePrecipitation)}%` },
    { label: t('scene.clouds'), value: `${Math.round(activeClouds)}%` },
    { label: t('insights.weatherCode'), value: `${activeWeatherCode}` },
    { label: t('insights.coordinates'), value: formatCoordinates(location.lat, location.lon) },
    { label: t('alerts.permission'), value: notificationPermission }
  ];

  const themeClass = getThemeClass(activeSnapshot);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_COLORS[themeClass] || '#234258');
    }
  }, [themeClass]);

  useEffect(() => {
    if (!alertSettings.enabled || notificationPermission !== 'granted' || scene.enabled) {
      return;
    }

    const dateKey = now.toISOString().slice(0, 10);

    if (alertSettings.sunsetReminderEnabled) {
      const triggerAt = new Date(liveSunData.sunset.getTime() - alertSettings.sunsetReminderMinutes * 60000);
      const triggerKey = `${dateKey}:sunset`;
      const inWindow = now.getTime() >= triggerAt.getTime() && now.getTime() <= triggerAt.getTime() + 2 * 60000;

      if (inWindow && alertState.sunsetDateKey !== triggerKey) {
        showAlertNotification({
          title: t('alerts.notification.sunsetTitle'),
          body: t('alerts.notification.sunsetBody', {
            lead: formatDurationMinutes(alertSettings.sunsetReminderMinutes, durationLabels)
          }),
          tag: 'sunset-reminder'
        }).then((success) => {
          if (success) {
            setAlertState((previous) => ({
              ...previous,
              sunsetDateKey: triggerKey
            }));
          }
        });
      }
    }

    if (alertSettings.goalAlertEnabled && alertWindow?.meaningful && alertWindow.peakScore >= alertSettings.goalThreshold) {
      const triggerAt = new Date(alertWindow.start.getTime() - alertSettings.goalLeadMinutes * 60000);
      const triggerKey = `${dateKey}:${alertSettings.goalId}:${alertWindow.start.toISOString()}`;
      const inWindow = now.getTime() >= triggerAt.getTime() && now.getTime() <= triggerAt.getTime() + 2 * 60000;

      if (inWindow && alertState.goalWindowKey !== triggerKey) {
        const goalLabel = goalOptions.find((goal) => goal.id === alertSettings.goalId)?.label || alertSettings.goalId;
        showAlertNotification({
          title: t('alerts.notification.goalTitle'),
          body: t('alerts.notification.goalBody', {
            goal: goalLabel,
            lead: formatDurationMinutes(alertSettings.goalLeadMinutes, durationLabels),
            score: `${alertWindow.peakScore}%`
          }),
          tag: `goal-window-${alertSettings.goalId}`
        }).then((success) => {
          if (success) {
            setAlertState((previous) => ({
              ...previous,
              goalWindowKey: triggerKey
            }));
          }
        });
      }
    }

    if (alertSettings.lowLightEnabled && !liveSnapshot.phase.isNight && liveSnapshot.light <= alertSettings.lowLightThreshold) {
      const triggerKey = `${dateKey}:low-light`;
      if (alertState.lowLightDateKey !== triggerKey) {
        showAlertNotification({
          title: t('alerts.notification.lowLightTitle'),
          body: t('alerts.notification.lowLightBody', {
            light: liveSnapshot.light
          }),
          tag: 'low-light'
        }).then((success) => {
          if (success) {
            setAlertState((previous) => ({
              ...previous,
              lowLightDateKey: triggerKey
            }));
          }
        });
      }
    }
  }, [
    alertSettings,
    alertState,
    alertWindow,
    durationLabels,
    goalOptions,
    liveSnapshot,
    liveSunData.sunset,
    notificationPermission,
    now,
    scene.enabled,
    t
  ]);

  const handleSceneToggle = (enabled) => {
    setScene((previous) => ({
      ...previous,
      enabled,
      time: previous.time || toTimeInputValue(now)
    }));
  };

  const handleSceneChange = (field, value) => {
    setScene((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleAlertSettingChange = (field, value) => {
    setAlertSettings((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleApplyPreset = (goalId) => {
    setAlertSettings((previous) => ({
      ...previous,
      ...getAlertPreset(goalId)
    }));
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      setNotificationPermission('unsupported');
      return;
    }

    try {
      const nextPermission = await Notification.requestPermission();
      setNotificationPermission(nextPermission);
    } catch (error) {
      setNotificationPermission(Notification.permission);
    }
  };

  const jumpToSceneLab = () => {
    const target = document.getElementById('scene-lab');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`app-shell ${themeClass}`}>
      <div className="app-backdrop" aria-hidden="true" />
      <main className="app-main">
        <UtilityBar
          title={t('app.title')}
          tagline={t('app.tagline')}
          locationName={location.name || t('utility.locating')}
          online={online}
          lastUpdated={weatherData?.fetchedAt}
          locale={locale}
          lang={lang}
          onLangChange={setLang}
          onJumpToSceneLab={jumpToSceneLab}
          isSimulated={scene.enabled}
          t={t}
        />

        <BriefingHero
          t={t}
          goalLabel={selectedGoalMeta.label}
          score={currentGoalScore}
          bandLabel={scoreBandLabel}
          phaseLabel={phaseLabel}
          stateText={stateText}
          windowText={windowText}
          ctaText={ctaText}
          decisionText={decisionText}
          currentTime={currentDateText}
          isSimulated={scene.enabled}
        />

        <GoalTabs goals={goalOptions} activeGoal={selectedGoal} onChange={setSelectedGoal} />

        <TimelinePanel
          t={t}
          locale={locale}
          points={timelinePoints}
          goalId={selectedGoal}
          bestWindow={bestWindow}
          referenceDate={activeDate}
          sunData={getSunDataForDate(liveSunData, activeDate)}
        />

        <SolarPanel t={t} locale={locale} sunData={getSunDataForDate(liveSunData, activeDate)} currentDate={activeDate} />

        <MetricsGrid t={t} metrics={metrics} />

        <AlertsCenter
          t={t}
          settings={alertSettings}
          permission={notificationPermission}
          goals={goalOptions}
          onToggleMaster={() => setAlertSettings((previous) => ({ ...previous, enabled: !previous.enabled }))}
          onRequestPermission={requestNotificationPermission}
          onSettingChange={handleAlertSettingChange}
          onApplyPreset={handleApplyPreset}
        />

        <SceneLab t={t} scene={scene} weatherOptions={weatherOptions} onToggle={handleSceneToggle} onChange={handleSceneChange} />

        <InsightsPanel
          t={t}
          moonData={activeMoonData}
          darknessScore={darknessScore}
          comparison={comparison}
          packingHints={packingHints}
          setupHints={setupHints}
          technicalStats={technicalStats}
        />

        <footer className="app-footer">
          <span>{`${weatherSource === 'live' ? t('common.live') : t('common.offline')} • ${fetchState === 'loading' ? '...' : formatClock(activeDate, locale)}`}</span>
        </footer>
      </main>
    </div>
  );
}



