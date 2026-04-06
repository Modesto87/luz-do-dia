import { getDayPhase } from './solar';

function buildSunData() {
  const sunrise = new Date('2026-04-06T06:30:00.000Z');
  const sunset = new Date('2026-04-06T19:30:00.000Z');

  return {
    sunrise,
    sunset,
    solarNoon: new Date((sunrise.getTime() + sunset.getTime()) / 2),
    dayDurationMinutes: 780
  };
}

describe('getDayPhase', () => {
  test('prioritises golden hour during the sunrise overlap window', () => {
    const sunData = buildSunData();

    expect(getDayPhase(new Date('2026-04-06T06:10:00.000Z'), sunData).key).toBe('blueHour');
    expect(getDayPhase(new Date('2026-04-06T06:35:00.000Z'), sunData).key).toBe('goldenHour');
  });
});
