import { clamp, isSameDay } from './format';

const MINUTE = 60000;

function fallbackDate(baseDate, hours, minutes) {
  const next = new Date(baseDate);
  next.setHours(hours, minutes, 0, 0);
  return next;
}

function buildDayBundle(sunrise, sunset) {
  return {
    sunrise,
    sunset,
    solarNoon: new Date((sunrise.getTime() + sunset.getTime()) / 2),
    dayDurationMinutes: Math.round((sunset.getTime() - sunrise.getTime()) / MINUTE)
  };
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * MINUTE);
}

export function getSunData(weatherData, referenceDate = new Date()) {
  const sunrise = weatherData?.daily?.sunrise?.[0]
    ? new Date(weatherData.daily.sunrise[0])
    : fallbackDate(referenceDate, 7, 5);
  const sunset = weatherData?.daily?.sunset?.[0]
    ? new Date(weatherData.daily.sunset[0])
    : fallbackDate(referenceDate, 19, 35);
  const tomorrowSunrise = weatherData?.daily?.sunrise?.[1]
    ? new Date(weatherData.daily.sunrise[1])
    : addMinutes(sunrise, 24 * 60 + 1);
  const tomorrowSunset = weatherData?.daily?.sunset?.[1]
    ? new Date(weatherData.daily.sunset[1])
    : addMinutes(sunset, 24 * 60 + 1);

  const current = buildDayBundle(sunrise, sunset);
  const tomorrow = buildDayBundle(tomorrowSunrise, tomorrowSunset);

  return {
    ...current,
    tomorrowSunrise,
    tomorrowSunset,
    tomorrowSolarNoon: tomorrow.solarNoon,
    tomorrowDurationMinutes: tomorrow.dayDurationMinutes,
    daylightDeltaMinutes: tomorrow.dayDurationMinutes - current.dayDurationMinutes
  };
}

export function getSunDataForDate(sunData, date) {
  if (!sunData) {
    return getSunData(null, date);
  }

  if (sunData.tomorrowSunrise && isSameDay(date, sunData.tomorrowSunrise)) {
    return {
      sunrise: sunData.tomorrowSunrise,
      sunset: sunData.tomorrowSunset,
      solarNoon: sunData.tomorrowSolarNoon,
      dayDurationMinutes: sunData.tomorrowDurationMinutes,
      daylightDeltaMinutes: 0
    };
  }

  return {
    sunrise: sunData.sunrise,
    sunset: sunData.sunset,
    solarNoon: sunData.solarNoon,
    dayDurationMinutes: sunData.dayDurationMinutes,
    daylightDeltaMinutes: sunData.daylightDeltaMinutes
  };
}

export function getSolarWindows(sunData) {
  return {
    blueMorning: {
      start: addMinutes(sunData.sunrise, -40),
      end: addMinutes(sunData.sunrise, 15)
    },
    goldenMorning: {
      start: addMinutes(sunData.sunrise, -15),
      end: addMinutes(sunData.sunrise, 75)
    },
    goldenEvening: {
      start: addMinutes(sunData.sunset, -75),
      end: addMinutes(sunData.sunset, 15)
    },
    blueEvening: {
      start: addMinutes(sunData.sunset, -20),
      end: addMinutes(sunData.sunset, 40)
    }
  };
}

function isBetween(date, start, end) {
  return date >= start && date <= end;
}

export function getDayPhase(date, sunData) {
  const windows = getSolarWindows(sunData);
  const solarPeakStart = addMinutes(sunData.solarNoon, -70);
  const solarPeakEnd = addMinutes(sunData.solarNoon, 70);
  const dayProgress = clamp(
    (date.getTime() - sunData.sunrise.getTime()) /
      Math.max(1, sunData.sunset.getTime() - sunData.sunrise.getTime()),
    0,
    1
  );
  const solarPeakFactor = clamp(1 - Math.abs(dayProgress - 0.5) * 2, 0, 1);

  let key = 'night';
  if (
    isBetween(date, windows.goldenMorning.start, windows.goldenMorning.end) ||
    isBetween(date, windows.goldenEvening.start, windows.goldenEvening.end)
  ) {
    key = 'goldenHour';
  } else if (isBetween(date, windows.blueMorning.start, windows.blueMorning.end) || isBetween(date, windows.blueEvening.start, windows.blueEvening.end)) {
    key = 'blueHour';
  } else if (date >= sunData.sunrise && date < solarPeakStart) {
    key = 'morning';
  } else if (isBetween(date, solarPeakStart, solarPeakEnd)) {
    key = 'solarPeak';
  } else if (date > solarPeakEnd && date <= sunData.sunset) {
    key = 'afternoon';
  }

  return {
    key,
    windows,
    isBlue: key === 'blueHour',
    isGolden: key === 'goldenHour',
    isNight: key === 'night',
    isDaylight: date >= sunData.sunrise && date <= sunData.sunset,
    dayProgress,
    solarPeakFactor,
    minutesToSunrise: Math.round((sunData.sunrise.getTime() - date.getTime()) / MINUTE),
    minutesToSunset: Math.round((sunData.sunset.getTime() - date.getTime()) / MINUTE)
  };
}

export function getSunArcProgress(date, sunData) {
  if (date <= sunData.sunrise) {
    return 0;
  }

  if (date >= sunData.sunset) {
    return 1;
  }

  return clamp(
    (date.getTime() - sunData.sunrise.getTime()) /
      Math.max(1, sunData.sunset.getTime() - sunData.sunrise.getTime()),
    0,
    1
  );
}

