import { clamp, isSameDay, minutesBetween, unique } from './format';
import { getDayPhase, getSunDataForDate } from './solar';
import { getWeatherProfile } from './weather';

export const GOAL_IDS = ['golden', 'portrait', 'landscape', 'long', 'astro'];

function weightedAverage(entries) {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (!totalWeight) {
    return 0;
  }

  const weighted = entries.reduce((sum, entry) => sum + entry.value * entry.weight, 0);
  return clamp(Math.round(weighted / totalWeight), 0, 100);
}

function bandScore(value, idealMin, idealMax, falloff) {
  if (value >= idealMin && value <= idealMax) {
    return 100;
  }

  if (value < idealMin) {
    return clamp(Math.round(100 - ((idealMin - value) / falloff) * 100), 0, 100);
  }

  return clamp(Math.round(100 - ((value - idealMax) / falloff) * 100), 0, 100);
}

function getGoldenCloseness(phase) {
  if (phase.isGolden) {
    return 100;
  }

  if (phase.isBlue) {
    return 82;
  }

  const closestEdge = Math.min(Math.abs(phase.minutesToSunrise), Math.abs(phase.minutesToSunset));
  return clamp(Math.round(100 - Math.abs(closestEdge - 35) * 1.2), 0, 100);
}

function getPhaseScore(goalId, phase) {
  if (goalId === 'golden') {
    return getGoldenCloseness(phase);
  }

  if (goalId === 'portrait') {
    if (phase.isGolden) {
      return 95;
    }
    if (phase.isBlue) {
      return 72;
    }
    if (phase.key === 'morning' || phase.key === 'afternoon') {
      return 78;
    }
    if (phase.key === 'solarPeak') {
      return 42;
    }
    return 18;
  }

  if (goalId === 'landscape') {
    if (phase.isGolden) {
      return 100;
    }
    if (phase.isBlue) {
      return 80;
    }
    if (phase.key === 'morning') {
      return 72;
    }
    if (phase.key === 'afternoon') {
      return 64;
    }
    if (phase.key === 'solarPeak') {
      return 55;
    }
    return 38;
  }

  if (goalId === 'long') {
    if (phase.isBlue) {
      return 100;
    }
    if (phase.key === 'night') {
      return 96;
    }
    if (phase.isGolden) {
      return 72;
    }
    return 32;
  }

  if (phase.key === 'night') {
    return 100;
  }

  if (phase.isBlue) {
    return 16;
  }

  return 0;
}

export function computeSceneSnapshot({
  date,
  sunData,
  weatherCode,
  clouds,
  wind = 10,
  precipitationProbability = 0,
  moonData
}) {
  const weatherProfile = getWeatherProfile(weatherCode);
  const phase = getDayPhase(date, sunData);
  const sunCurve = phase.isDaylight ? Math.sin(phase.dayProgress * Math.PI) : 0;
  const twilightCurve = phase.isBlue ? 0.18 : phase.isGolden ? 0.24 : phase.key === 'night' ? 0.03 : 0;
  const cloudTransmittance = 1 - (clouds / 100) * 0.55;
  const light = clamp(
    Math.round((sunCurve * 0.95 + twilightCurve) * weatherProfile.lightFactor * cloudTransmittance * 100),
    0,
    100
  );
  const softness = clamp(
    Math.round(
      (100 - Math.abs(clouds - 42) * 1.4) * 0.42 +
        (phase.isGolden ? 100 : phase.isBlue ? 82 : 48) * 0.28 +
        (100 - phase.solarPeakFactor * 100) * 0.18 +
        (weatherProfile.softnessBonus + 50) * 0.12
    ),
    0,
    100
  );
  const hardLight = clamp(
    Math.round(
      phase.solarPeakFactor * 62 +
        (100 - clouds) * 0.28 +
        light * 0.2 +
        (weatherProfile.id === 'clear' ? 10 : 0) -
        (phase.isGolden ? 22 : phase.isBlue ? 12 : 0) -
        (weatherProfile.softnessBonus > 15 ? 10 : 0)
    ),
    0,
    100
  );
  const skyDrama = clamp(
    Math.round(
      (100 - Math.abs(clouds - 58) * 1.5) * 0.52 +
        weatherProfile.dramaBonus +
        (phase.isGolden ? 18 : phase.isBlue ? 14 : 0) +
        (weatherProfile.precipitation ? 6 : 0) -
        (weatherProfile.id === 'overcast' ? 12 : 0)
    ),
    0,
    100
  );
  const tripodNeed = clamp(
    Math.round((100 - light) * 0.72 + (phase.key === 'night' ? 24 : 0) + (phase.isBlue ? 14 : 0) + Math.min(18, (wind / 35) * 18)),
    0,
    100
  );
  const moonDarkness = 100 - (moonData?.illumination ?? 50);
  const weatherCleanScore = weatherProfile.precipitation
    ? Math.max(20, 60 - precipitationProbability * 0.5)
    : weatherProfile.id === 'fog'
      ? 40
      : 92;

  const scores = {
    golden: weightedAverage([
      { value: getPhaseScore('golden', phase), weight: 0.32 },
      { value: bandScore(light, 18, 68, 40), weight: 0.18 },
      { value: bandScore(clouds, 12, 60, 45), weight: 0.16 },
      { value: weatherCleanScore, weight: 0.16 },
      { value: skyDrama, weight: 0.18 }
    ]),
    portrait: weightedAverage([
      { value: softness, weight: 0.34 },
      { value: 100 - hardLight, weight: 0.24 },
      { value: bandScore(light, 25, 75, 35), weight: 0.2 },
      { value: bandScore(clouds, 18, 72, 40), weight: 0.1 },
      { value: weatherProfile.precipitation ? 25 : 90, weight: 0.12 }
    ]),
    landscape: weightedAverage([
      { value: skyDrama, weight: 0.36 },
      { value: bandScore(light, 28, 88, 35), weight: 0.22 },
      { value: getPhaseScore('landscape', phase), weight: 0.14 },
      { value: bandScore(clouds, 15, 78, 35), weight: 0.12 },
      { value: weatherProfile.precipitation && weatherProfile.id !== 'lightSnow' ? 35 : 85, weight: 0.16 }
    ]),
    long: weightedAverage([
      { value: bandScore(100 - light, 58, 100, 42), weight: 0.34 },
      { value: getPhaseScore('long', phase), weight: 0.24 },
      { value: tripodNeed, weight: 0.18 },
      { value: weatherProfile.id === 'fog' ? 82 : weatherProfile.precipitation && !['lightRain', 'lightSnow'].includes(weatherProfile.id) ? 38 : 76, weight: 0.14 },
      { value: bandScore(wind, 0, 18, 18), weight: 0.1 }
    ]),
    astro: weightedAverage([
      { value: getPhaseScore('astro', phase), weight: 0.36 },
      { value: bandScore(100 - clouds, 70, 100, 40), weight: 0.24 },
      { value: moonDarkness, weight: 0.18 },
      { value: weatherProfile.precipitation || weatherProfile.id === 'fog' ? 0 : 90, weight: 0.14 },
      { value: bandScore(wind, 0, 20, 20), weight: 0.08 }
    ])
  };

  return {
    phase,
    weatherProfile,
    clouds,
    wind,
    precipitationProbability,
    light,
    softness,
    hardLight,
    skyDrama,
    tripodNeed,
    moonDarkness,
    scores
  };
}

function buildPoint({ date, sunData, weatherCode, clouds, wind, precipitationProbability, moonData }) {
  const pointSunData = getSunDataForDate(sunData, date);
  return {
    date,
    weatherCode,
    clouds,
    wind,
    precipitationProbability,
    ...computeSceneSnapshot({
      date,
      sunData: pointSunData,
      weatherCode,
      clouds,
      wind,
      precipitationProbability,
      moonData
    })
  };
}

export function buildTimelinePoints({
  weatherData,
  baseDate,
  sunData,
  manualScene,
  moonData,
  hours = 12
}) {
  const points = [];
  const currentWind = weatherData?.current?.wind_speed_10m ?? weatherData?.hourly?.wind_speed_10m?.[0] ?? 10;
  const currentPrecipitation = weatherData?.hourly?.precipitation_probability?.[0] ?? 0;

  if (manualScene?.enabled) {
    for (let index = 1; index <= hours; index += 1) {
      const pointDate = new Date(baseDate.getTime() + index * 3600000);
      points.push(
        buildPoint({
          date: pointDate,
          sunData,
          weatherCode: manualScene.code,
          clouds: manualScene.clouds,
          wind: manualScene.wind ?? currentWind,
          precipitationProbability: manualScene.precipitationProbability ?? currentPrecipitation,
          moonData
        })
      );
    }
    return points;
  }

  const timeSeries = weatherData?.hourly?.time || [];
  for (let index = 0; index < timeSeries.length; index += 1) {
    const pointDate = new Date(timeSeries[index]);
    const diffHours = (pointDate.getTime() - baseDate.getTime()) / 3600000;
    if (diffHours < 0) {
      continue;
    }
    if (diffHours > hours) {
      break;
    }

    points.push(
      buildPoint({
        date: pointDate,
        sunData,
        weatherCode: weatherData?.hourly?.weather_code?.[index] ?? weatherData?.current?.weather_code ?? 1,
        clouds: weatherData?.hourly?.cloud_cover?.[index] ?? weatherData?.current?.cloud_cover ?? 40,
        wind: weatherData?.hourly?.wind_speed_10m?.[index] ?? currentWind,
        precipitationProbability: weatherData?.hourly?.precipitation_probability?.[index] ?? currentPrecipitation,
        moonData
      })
    );
  }

  if (points.length) {
    return points;
  }

  for (let index = 1; index <= hours; index += 1) {
    const pointDate = new Date(baseDate.getTime() + index * 3600000);
    points.push(
      buildPoint({
        date: pointDate,
        sunData,
        weatherCode: weatherData?.current?.weather_code ?? 1,
        clouds: weatherData?.current?.cloud_cover ?? 40,
        wind: currentWind,
        precipitationProbability: currentPrecipitation,
        moonData
      })
    );
  }

  return points;
}

export function findBestWindow(points, goalId, referenceDate = new Date()) {
  if (!points.length) {
    return null;
  }

  let peakIndex = 0;
  for (let index = 1; index < points.length; index += 1) {
    if (points[index].scores[goalId] > points[peakIndex].scores[goalId]) {
      peakIndex = index;
    }
  }

  const peakPoint = points[peakIndex];
  const peakScore = peakPoint.scores[goalId];
  let startIndex = peakIndex;
  let endIndex = peakIndex;

  while (startIndex > 0 && points[startIndex - 1].scores[goalId] >= peakScore - 12) {
    startIndex -= 1;
  }

  while (endIndex < points.length - 1 && points[endIndex + 1].scores[goalId] >= peakScore - 12) {
    endIndex += 1;
  }

  return {
    start: points[startIndex].date,
    end: points[endIndex].date,
    peak: peakPoint,
    peakScore,
    meaningful: peakScore >= 52,
    leadMinutes: Math.max(0, minutesBetween(referenceDate, points[startIndex].date))
  };
}

export function getTrendData(points, goalId) {
  if (!points.length) {
    return {
      delta: 0,
      labelKey: 'stable'
    };
  }

  const currentScore = points[0].scores[goalId];
  const lookAhead = points.slice(1, 4);
  if (!lookAhead.length) {
    return {
      delta: 0,
      labelKey: 'stable'
    };
  }

  const average = lookAhead.reduce((sum, point) => sum + point.scores[goalId], 0) / lookAhead.length;
  const delta = Math.round(average - currentScore);

  return {
    delta,
    labelKey: delta > 8 ? 'rising' : delta < -8 ? 'falling' : 'stable'
  };
}

export function buildTodayTomorrowComparison({ weatherData, goalId, baseDate, sunData, moonData }) {
  if (!weatherData?.hourly?.time?.length) {
    return null;
  }

  const points = buildTimelinePoints({
    weatherData,
    baseDate,
    sunData,
    moonData,
    hours: 36
  });
  const tomorrowDate = new Date(baseDate);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const todayPoints = points.filter((point) => isSameDay(point.date, baseDate));
  const tomorrowPoints = points.filter((point) => isSameDay(point.date, tomorrowDate));

  const todayBest = findBestWindow(todayPoints, goalId, baseDate);
  const tomorrowBest = findBestWindow(tomorrowPoints, goalId, tomorrowDate);

  const todaySunshineBias = weatherData?.daily?.sunshine_duration?.[0] && weatherData?.daily?.daylight_duration?.[0]
    ? Math.round((weatherData.daily.sunshine_duration[0] / weatherData.daily.daylight_duration[0]) * 100)
    : null;
  const tomorrowSunshineBias = weatherData?.daily?.sunshine_duration?.[1] && weatherData?.daily?.daylight_duration?.[1]
    ? Math.round((weatherData.daily.sunshine_duration[1] / weatherData.daily.daylight_duration[1]) * 100)
    : null;

  return {
    todayBest,
    tomorrowBest,
    daylightDeltaMinutes: sunData?.daylightDeltaMinutes ?? 0,
    todaySunshineBias,
    tomorrowSunshineBias,
    tomorrowWeatherCode: weatherData?.daily?.weather_code?.[1] ?? weatherData?.daily?.weather_code?.[0] ?? 1,
    tomorrowHigh: weatherData?.daily?.temperature_2m_max?.[1] ?? null,
    tomorrowLow: weatherData?.daily?.temperature_2m_min?.[1] ?? null
  };
}

export function buildPackingHints({ goalId, snapshot }) {
  const hints = [];

  if (goalId === 'portrait') {
    hints.push(snapshot.hardLight > 65 ? 'diffuser' : 'reflector');
  }

  if (goalId === 'landscape') {
    hints.push('polarizer');
  }

  if (goalId === 'long' || goalId === 'astro' || snapshot.tripodNeed > 62) {
    hints.push('tripod', 'remote');
  }

  if (goalId === 'long' && snapshot.light > 55) {
    hints.push('ndFilter');
  }

  if (snapshot.weatherProfile.precipitation || snapshot.clouds > 70) {
    hints.push('rainCover', 'microfiber');
  }

  if (goalId === 'astro') {
    hints.push('headlamp', 'warmLayers', 'battery');
  }

  if (snapshot.wind > 18) {
    hints.push('bagWeight');
  }

  if (goalId === 'golden') {
    hints.push('microfiber');
  }

  return unique(hints).slice(0, 4);
}

export function buildSetupHints({ goalId, snapshot }) {
  const hints = [];

  if (goalId === 'golden') {
    hints.push('protectHighlights');
    hints.push(snapshot.light < 35 ? 'wideOpen' : 'lowIso');
    hints.push('stabilizeShot');
  }

  if (goalId === 'portrait') {
    hints.push(snapshot.hardLight > 60 ? 'shadeOrBacklight' : 'lowIso');
    hints.push('wideOpen');
    hints.push('stabilizeShot');
  }

  if (goalId === 'landscape') {
    hints.push('bracketFrames');
    hints.push('protectHighlights');
    hints.push('lowIso');
  }

  if (goalId === 'long') {
    hints.push('slowShutter', 'lowIso', 'stabilizeShot');
  }

  if (goalId === 'astro') {
    hints.push('manualFocusInfinity', 'wideOpen', 'lowIso');
  }

  return unique(hints).slice(0, 3);
}

export function getScoreBand(score) {
  if (score >= 85) {
    return 'excellent';
  }
  if (score >= 72) {
    return 'strong';
  }
  if (score >= 58) {
    return 'usable';
  }
  if (score >= 42) {
    return 'marginal';
  }
  return 'poor';
}