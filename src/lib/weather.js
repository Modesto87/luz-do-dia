const WEATHER_PROFILES = [
  {
    id: 'clear',
    codes: [0],
    icon: '☀',
    lightFactor: 1,
    dramaBonus: 10,
    softnessBonus: -8,
    precipitation: false
  },
  {
    id: 'mostlyClear',
    codes: [1],
    icon: '◔',
    lightFactor: 0.94,
    dramaBonus: 12,
    softnessBonus: 0,
    precipitation: false
  },
  {
    id: 'partlyCloudy',
    codes: [2],
    icon: '⛅',
    lightFactor: 0.78,
    dramaBonus: 24,
    softnessBonus: 10,
    precipitation: false
  },
  {
    id: 'overcast',
    codes: [3],
    icon: '☁',
    lightFactor: 0.48,
    dramaBonus: 8,
    softnessBonus: 24,
    precipitation: false
  },
  {
    id: 'fog',
    codes: [45, 48],
    icon: '〰',
    lightFactor: 0.28,
    dramaBonus: 14,
    softnessBonus: 32,
    precipitation: false
  },
  {
    id: 'drizzle',
    codes: [51, 53, 55],
    icon: '☂',
    lightFactor: 0.36,
    dramaBonus: 12,
    softnessBonus: 18,
    precipitation: true
  },
  {
    id: 'lightRain',
    codes: [56, 57, 61, 66, 80, 81],
    icon: '☔',
    lightFactor: 0.3,
    dramaBonus: 16,
    softnessBonus: 20,
    precipitation: true
  },
  {
    id: 'moderateRain',
    codes: [63, 82],
    icon: '☔',
    lightFactor: 0.2,
    dramaBonus: 12,
    softnessBonus: 12,
    precipitation: true
  },
  {
    id: 'heavyRain',
    codes: [65, 67],
    icon: '☔',
    lightFactor: 0.12,
    dramaBonus: 8,
    softnessBonus: 4,
    precipitation: true
  },
  {
    id: 'lightSnow',
    codes: [71, 73, 77, 85],
    icon: '❄',
    lightFactor: 0.34,
    dramaBonus: 18,
    softnessBonus: 24,
    precipitation: true
  },
  {
    id: 'heavySnow',
    codes: [75, 86],
    icon: '❄',
    lightFactor: 0.18,
    dramaBonus: 14,
    softnessBonus: 18,
    precipitation: true
  },
  {
    id: 'thunder',
    codes: [95, 96, 99],
    icon: '⚡',
    lightFactor: 0.1,
    dramaBonus: 28,
    softnessBonus: 0,
    precipitation: true
  }
];

export function getWeatherProfile(code = 0) {
  return WEATHER_PROFILES.find((profile) => profile.codes.includes(Number(code))) || WEATHER_PROFILES[3];
}

export function getWeatherOptions(t) {
  return WEATHER_PROFILES.map((profile) => ({
    code: profile.codes[0],
    id: profile.id,
    icon: profile.icon,
    label: t(`weather.${profile.id}`)
  }));
}

export async function fetchWeatherForecast({ lat, lon }) {
  const endpoint = new URL('https://api.open-meteo.com/v1/forecast');
  endpoint.searchParams.set('latitude', `${lat}`);
  endpoint.searchParams.set('longitude', `${lon}`);
  endpoint.searchParams.set('forecast_days', '3');
  endpoint.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m'
  );
  endpoint.searchParams.set(
    'hourly',
    'temperature_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m,precipitation_probability'
  );
  endpoint.searchParams.set(
    'daily',
    'sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration'
  );
  endpoint.searchParams.set('timezone', 'auto');

  const response = await fetch(endpoint.toString());
  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  const data = await response.json();
  return {
    ...data,
    fetchedAt: new Date().toISOString()
  };
}

export async function reverseGeocode({ lat, lon, lang }) {
  const endpoint = new URL('https://nominatim.openstreetmap.org/reverse');
  endpoint.searchParams.set('lat', `${lat}`);
  endpoint.searchParams.set('lon', `${lon}`);
  endpoint.searchParams.set('format', 'json');
  endpoint.searchParams.set('zoom', '10');
  endpoint.searchParams.set('accept-language', lang);

  const response = await fetch(endpoint.toString(), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed with status ${response.status}`);
  }

  const data = await response.json();
  return (
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.municipality ||
    data.address?.county ||
    data.display_name?.split(',')?.[0] ||
    null
  );
}