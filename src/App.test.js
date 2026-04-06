import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

function buildMockWeather() {
  const now = new Date();
  const sunriseToday = new Date(now);
  sunriseToday.setHours(6, 48, 0, 0);
  const sunsetToday = new Date(now);
  sunsetToday.setHours(19, 42, 0, 0);
  const sunriseTomorrow = new Date(sunriseToday);
  sunriseTomorrow.setDate(sunriseTomorrow.getDate() + 1);
  const sunsetTomorrow = new Date(sunsetToday);
  sunsetTomorrow.setDate(sunsetTomorrow.getDate() + 1);

  const hourlyTimes = Array.from({ length: 36 }, (_, index) => new Date(now.getTime() + index * 3600000).toISOString());

  return {
    latitude: 38.7223,
    longitude: -9.1393,
    timezone: 'Europe/Lisbon',
    fetchedAt: now.toISOString(),
    current: {
      temperature_2m: 19,
      apparent_temperature: 18,
      weather_code: 2,
      cloud_cover: 34,
      wind_speed_10m: 9
    },
    hourly: {
      temperature_2m_units: 'C',
      time: hourlyTimes,
      weather_code: hourlyTimes.map((_, index) => (index < 8 ? 2 : 1)),
      cloud_cover: hourlyTimes.map((_, index) => 28 + (index % 5) * 8),
      wind_speed_10m: hourlyTimes.map((_, index) => 8 + (index % 4)),
      precipitation_probability: hourlyTimes.map((_, index) => (index > 20 ? 18 : 6)),
      temperature_2m: hourlyTimes.map((_, index) => 17 + (index % 6)),
      apparent_temperature: hourlyTimes.map((_, index) => 16 + (index % 6))
    },
    daily: {
      sunrise: [sunriseToday.toISOString(), sunriseTomorrow.toISOString()],
      sunset: [sunsetToday.toISOString(), sunsetTomorrow.toISOString()],
      weather_code: [2, 1],
      temperature_2m_max: [23, 24],
      temperature_2m_min: [14, 13],
      daylight_duration: [46440, 46560],
      sunshine_duration: [26200, 28600]
    }
  };
}

function countWeatherRequests() {
  return global.fetch.mock.calls.filter(([url]) => `${url}`.includes('open-meteo.com')).length;
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });

    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      writable: true,
      configurable: true,
      value: jest.fn()
    });

    Object.defineProperty(global.navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: jest.fn((success) =>
          success({
            coords: {
              latitude: 38.7223,
              longitude: -9.1393
            }
          })
        )
      }
    });

    Object.defineProperty(global.navigator, 'serviceWorker', {
      configurable: true,
      value: {
        ready: Promise.resolve({
          showNotification: jest.fn()
        })
      }
    });

    global.Notification = {
      permission: 'denied',
      requestPermission: jest.fn().mockResolvedValue('denied')
    };

    global.fetch = jest.fn((url) => {
      if (`${url}`.includes('open-meteo.com')) {
        return Promise.resolve({
          ok: true,
          json: async () => buildMockWeather()
        });
      }

      if (`${url}`.includes('nominatim.openstreetmap.org')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            address: {
              city: 'Lisboa'
            }
          })
        });
      }

      return Promise.reject(new Error('Unexpected request'));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the premium observatory home', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: /luz do dia/i })).toBeInTheDocument();
    expect(screen.getByText(/briefing agora/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /golden/i })).toBeInTheDocument();
    expect(screen.getByText(/timeline 12h/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /scene lab/i })).toBeInTheDocument();
  });

  test('switches between Portuguese, English, and French copy', async () => {
    render(<App />);

    const languageSelect = await screen.findByLabelText(/idioma/i);
    await userEvent.selectOptions(languageSelect, 'en');

    expect(await screen.findByRole('heading', { name: /daylight/i })).toBeInTheDocument();
    expect(screen.getByText(/now briefing/i)).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/language/i), 'fr');

    expect(await screen.findByRole('heading', { name: /lumière du jour/i })).toBeInTheDocument();
    expect(screen.getByText(/briefing maintenant/i)).toBeInTheDocument();
  });

  test('enables scene simulation controls when switching out of live mode', async () => {
    render(<App />);

    const timeInput = await screen.findByLabelText(/^hora$/i);
    expect(timeInput).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: /simulação/i }));

    expect(timeInput).toBeEnabled();
    expect(screen.getAllByText(/simulado/i).length).toBeGreaterThan(0);
  });

  test('only performs one weather fetch on initial load', async () => {
    render(<App />);

    await screen.findByRole('heading', { name: /luz do dia/i });
    await waitFor(() => expect(countWeatherRequests()).toBe(1));
  });

  test('persists coarse location data and a minimized weather snapshot', async () => {
    render(<App />);

    await screen.findByRole('heading', { name: /luz do dia/i });
    await waitFor(() => expect(localStorage.getItem('luzDoDia.weather.v3')).not.toBeNull());

    expect(JSON.parse(localStorage.getItem('luzDoDia.location.v3'))).toEqual({
      lat: 38.7,
      lon: -9.1
    });

    const storedWeather = JSON.parse(localStorage.getItem('luzDoDia.weather.v3'));

    expect(storedWeather.data.current).toEqual({
      temperature_2m: 19,
      apparent_temperature: 18,
      weather_code: 2,
      cloud_cover: 34,
      wind_speed_10m: 9
    });
    expect(storedWeather.data.hourly.time).toHaveLength(36);
    expect(storedWeather.data.daily.sunrise).toHaveLength(2);
    expect(storedWeather.data.latitude).toBeUndefined();
    expect(storedWeather.data.longitude).toBeUndefined();
    expect(storedWeather.data.timezone).toBeUndefined();
    expect(storedWeather.data.hourly.temperature_2m).toBeUndefined();
    expect(storedWeather.data.hourly.apparent_temperature).toBeUndefined();
  });
});
