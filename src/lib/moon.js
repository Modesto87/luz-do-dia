const SYNODIC_MONTH = 29.53058867;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

const MOON_PHASES = [
  { upper: 0.03, key: 'newMoon', icon: '🌑' },
  { upper: 0.22, key: 'waxingCrescent', icon: '🌒' },
  { upper: 0.28, key: 'firstQuarter', icon: '🌓' },
  { upper: 0.47, key: 'waxingGibbous', icon: '🌔' },
  { upper: 0.53, key: 'fullMoon', icon: '🌕' },
  { upper: 0.72, key: 'waningGibbous', icon: '🌖' },
  { upper: 0.78, key: 'lastQuarter', icon: '🌗' },
  { upper: 0.97, key: 'waningCrescent', icon: '🌘' },
  { upper: 1, key: 'newMoon', icon: '🌑' }
];

export function getMoonData(date = new Date()) {
  const daysSinceReference = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const normalizedPhase = ((daysSinceReference % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH / SYNODIC_MONTH;
  const phase = MOON_PHASES.find((entry) => normalizedPhase <= entry.upper) || MOON_PHASES[0];
  const illumination = Math.round(((1 - Math.cos(normalizedPhase * Math.PI * 2)) / 2) * 100);

  return {
    age: Number((normalizedPhase * SYNODIC_MONTH).toFixed(1)),
    illumination,
    icon: phase.icon,
    phaseKey: phase.key,
    phaseValue: normalizedPhase
  };
}