const APPROXIMATE_COORDINATE_STEP = 0.1;
const WEATHER_HOURLY_LIMIT = 36;
const WEATHER_DAILY_LIMIT = 2;

const WEATHER_CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m'
];

const WEATHER_HOURLY_FIELDS = [
  'time',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
  'precipitation_probability'
];

const WEATHER_DAILY_FIELDS = [
  'sunrise',
  'sunset',
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'daylight_duration',
  'sunshine_duration'
];

export const WEATHER_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
export const WEATHER_CACHE_RETENTION_MS = 24 * 60 * 60 * 1000;

function toFiniteNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function toIsoString(value, fallbackValue) {
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return new Date(parsed).toISOString();
    }
  }

  return fallbackValue;
}

function roundCoordinate(value) {
  const numeric = toFiniteNumber(value);
  if (numeric === null) {
    return null;
  }

  return Number((Math.round(numeric / APPROXIMATE_COORDINATE_STEP) * APPROXIMATE_COORDINATE_STEP).toFixed(1));
}

function pickObjectFields(source, fields) {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const entries = fields.reduce((result, field) => {
    if (source[field] !== undefined && source[field] !== null) {
      result[field] = source[field];
    }
    return result;
  }, {});

  return Object.keys(entries).length ? entries : null;
}

function pickArrayFields(source, fields, limit) {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const entries = fields.reduce((result, field) => {
    if (Array.isArray(source[field])) {
      result[field] = source[field].slice(0, limit);
    }
    return result;
  }, {});

  return Object.keys(entries).length ? entries : null;
}

function getWeatherSavedAt(storedWeather) {
  const rawSavedAt = storedWeather?.savedAt || storedWeather?.data?.fetchedAt || storedWeather?.fetchedAt;
  if (typeof rawSavedAt !== 'string') {
    return null;
  }

  const parsed = Date.parse(rawSavedAt);
  return Number.isFinite(parsed) ? parsed : null;
}

export function sanitizeLocationForStorage(location) {
  const lat = roundCoordinate(location?.lat);
  const lon = roundCoordinate(location?.lon);

  if (lat === null || lon === null) {
    return null;
  }

  return { lat, lon };
}

export function restoreLocationFromStorage(storedLocation, fallbackLocation) {
  const sanitized = sanitizeLocationForStorage(storedLocation);
  if (!sanitized) {
    return fallbackLocation;
  }

  return {
    ...sanitized,
    name: ''
  };
}

export function sanitizeWeatherForStorage(weatherData, now = Date.now()) {
  if (!weatherData || typeof weatherData !== 'object') {
    return null;
  }

  const fallbackTimestamp = new Date(now).toISOString();
  const fetchedAt = toIsoString(weatherData.fetchedAt, fallbackTimestamp);
  const current = pickObjectFields(weatherData.current, WEATHER_CURRENT_FIELDS);
  const hourly = pickArrayFields(weatherData.hourly, WEATHER_HOURLY_FIELDS, WEATHER_HOURLY_LIMIT);
  const daily = pickArrayFields(weatherData.daily, WEATHER_DAILY_FIELDS, WEATHER_DAILY_LIMIT);

  if (!current && !hourly && !daily) {
    return null;
  }

  return {
    fetchedAt,
    ...(current ? { current } : {}),
    ...(hourly ? { hourly } : {}),
    ...(daily ? { daily } : {})
  };
}

export function createWeatherCacheRecord(weatherData, now = Date.now()) {
  const data = sanitizeWeatherForStorage(weatherData, now);
  if (!data) {
    return null;
  }

  const savedAt = data.fetchedAt;
  return {
    savedAt,
    expiresAt: new Date(Date.parse(savedAt) + WEATHER_CACHE_TTL_MS).toISOString(),
    data
  };
}

export function restoreWeatherFromStorage(storedWeather, options = {}) {
  const { now = Date.now(), allowStale = false } = options;
  const savedAt = getWeatherSavedAt(storedWeather);
  if (savedAt === null) {
    return null;
  }

  const age = Math.max(0, now - savedAt);
  if (age > WEATHER_CACHE_RETENTION_MS) {
    return null;
  }

  if (!allowStale && age > WEATHER_CACHE_TTL_MS) {
    return null;
  }

  const source = storedWeather?.data || storedWeather;
  const data = sanitizeWeatherForStorage(source, savedAt);
  if (!data) {
    return null;
  }

  return {
    ...data,
    fetchedAt: new Date(savedAt).toISOString()
  };
}

export function shouldRemoveWeatherCache(storedWeather, now = Date.now()) {
  if (!storedWeather) {
    return false;
  }

  const savedAt = getWeatherSavedAt(storedWeather);
  if (savedAt === null) {
    return true;
  }

  return now - savedAt > WEATHER_CACHE_RETENTION_MS;
}