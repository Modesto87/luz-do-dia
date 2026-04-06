import {
  WEATHER_CACHE_RETENTION_MS,
  WEATHER_CACHE_TTL_MS,
  createWeatherCacheRecord,
  restoreLocationFromStorage,
  restoreWeatherFromStorage,
  sanitizeLocationForStorage,
  shouldRemoveWeatherCache
} from './persistence';

function buildWeather(overrides = {}) {
  const fetchedAt = overrides.fetchedAt || '2026-04-06T12:00:00.000Z';
  const hourlyTimes = Array.from({ length: 40 }, (_, index) => new Date(Date.parse(fetchedAt) + index * 3600000).toISOString());

  return {
    fetchedAt,
    latitude: 38.7223,
    longitude: -9.1393,
    timezone: 'Europe/Lisbon',
    current: {
      temperature_2m: 19,
      apparent_temperature: 18,
      weather_code: 2,
      cloud_cover: 34,
      wind_speed_10m: 9,
      extra: 'drop-me'
    },
    hourly: {
      time: hourlyTimes,
      weather_code: hourlyTimes.map(() => 2),
      cloud_cover: hourlyTimes.map((_, index) => 20 + index),
      wind_speed_10m: hourlyTimes.map((_, index) => 5 + index),
      precipitation_probability: hourlyTimes.map((_, index) => index),
      temperature_2m: hourlyTimes.map((_, index) => 16 + index),
      apparent_temperature: hourlyTimes.map((_, index) => 15 + index)
    },
    daily: {
      sunrise: ['2026-04-06T06:30:00.000Z', '2026-04-07T06:28:00.000Z', '2026-04-08T06:26:00.000Z'],
      sunset: ['2026-04-06T19:30:00.000Z', '2026-04-07T19:32:00.000Z', '2026-04-08T19:33:00.000Z'],
      weather_code: [2, 1, 3],
      temperature_2m_max: [23, 24, 22],
      temperature_2m_min: [14, 13, 12],
      daylight_duration: [46440, 46560, 46620],
      sunshine_duration: [26200, 28600, 21000]
    }
  };
}

describe('persistence helpers', () => {
  test('rounds persisted coordinates to an approximate area', () => {
    expect(sanitizeLocationForStorage({ lat: 38.7223, lon: -9.1393, name: 'Lisboa' })).toEqual({
      lat: 38.7,
      lon: -9.1
    });

    expect(restoreLocationFromStorage({ lat: 38.7223, lon: -9.1393 }, { lat: 0, lon: 0, name: 'Fallback' })).toEqual({
      lat: 38.7,
      lon: -9.1,
      name: ''
    });
  });

  test('stores only the weather fields needed for startup and offline fallback', () => {
    const record = createWeatherCacheRecord(buildWeather(), Date.parse('2026-04-06T12:00:00.000Z'));

    expect(record.data.current).toEqual({
      temperature_2m: 19,
      apparent_temperature: 18,
      weather_code: 2,
      cloud_cover: 34,
      wind_speed_10m: 9
    });
    expect(record.data.hourly.time).toHaveLength(36);
    expect(record.data.daily.sunrise).toHaveLength(2);
    expect(record.data.latitude).toBeUndefined();
    expect(record.data.timezone).toBeUndefined();
    expect(record.data.hourly.temperature_2m).toBeUndefined();
  });

  test('treats weather cache as stale after ttl but allows short offline fallback within retention', () => {
    const savedAt = Date.parse('2026-04-06T12:00:00.000Z');
    const record = createWeatherCacheRecord(buildWeather(), savedAt);

    expect(
      restoreWeatherFromStorage(record, {
        now: savedAt + WEATHER_CACHE_TTL_MS + 1000
      })
    ).toBeNull();

    expect(
      restoreWeatherFromStorage(record, {
        now: savedAt + WEATHER_CACHE_TTL_MS + 1000,
        allowStale: true
      })
    ).not.toBeNull();

    expect(
      restoreWeatherFromStorage(record, {
        now: savedAt + WEATHER_CACHE_RETENTION_MS + 1000,
        allowStale: true
      })
    ).toBeNull();
    expect(shouldRemoveWeatherCache(record, savedAt + WEATHER_CACHE_RETENTION_MS + 1000)).toBe(true);
  });
});