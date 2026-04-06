import { formatClock, formatDurationMinutes, formatSignedMinutes, formatWindowRange } from '../lib/format';
import { getSolarWindows, getSunArcProgress } from '../lib/solar';
import SectionCard from './SectionCard';

function formatSignedDelta(delta, labels) {
  if (!delta) {
    return '±0';
  }
  return formatSignedMinutes(delta, labels);
}

export default function SolarPanel({ t, locale, sunData, currentDate }) {
  const windows = getSolarWindows(sunData);
  const progress = getSunArcProgress(currentDate, sunData);
  const radius = 132;
  const centerX = 160;
  const centerY = 152;
  const angle = Math.PI * (1 - progress);
  const markerX = centerX + radius * Math.cos(angle);
  const markerY = centerY - radius * Math.sin(angle);
  const durationLabels = {
    hours: t('common.hours'),
    minutes: t('common.minutes')
  };

  return (
    <SectionCard
      eyebrow={t('solar.title')}
      title={t('solar.windows')}
      subtitle={t('solar.subtitle')}
      className="solar-panel"
      action={<span className="panel-pill">{`${t('solar.tomorrow')} ${formatSignedDelta(sunData.daylightDeltaMinutes, durationLabels)}`}</span>}
    >
      <div className="solar-arc-wrap">
        <svg viewBox="0 0 320 180" className="solar-arc" role="img" aria-label={t('solar.title')}>
          <path d="M28 152 A132 132 0 0 1 292 152" className="solar-arc-track" />
          <path d="M28 152 A132 132 0 0 1 292 152" className="solar-arc-fill" />
          <circle cx={centerX} cy="20" r="6" className="solar-noon-marker" />
          <circle cx={markerX} cy={markerY} r="8" className="solar-current-marker" />
          <text x="28" y="170" className="solar-arc-label">{formatClock(sunData.sunrise, locale)}</text>
          <text x="268" y="170" className="solar-arc-label">{formatClock(sunData.sunset, locale)}</text>
        </svg>
      </div>

      <div className="solar-stats-grid">
        <div className="solar-stat-card">
          <span>{t('solar.sunrise')}</span>
          <strong>{formatClock(sunData.sunrise, locale)}</strong>
        </div>
        <div className="solar-stat-card">
          <span>{t('solar.sunset')}</span>
          <strong>{formatClock(sunData.sunset, locale)}</strong>
        </div>
        <div className="solar-stat-card">
          <span>{t('solar.noon')}</span>
          <strong>{formatClock(sunData.solarNoon, locale)}</strong>
        </div>
        <div className="solar-stat-card">
          <span>{t('solar.duration')}</span>
          <strong>{formatDurationMinutes(sunData.dayDurationMinutes, durationLabels)}</strong>
        </div>
      </div>

      <div className="solar-window-list">
        <div className="solar-window-item">
          <span>{t('solar.blueAM')}</span>
          <strong>{formatWindowRange(windows.blueMorning.start, windows.blueMorning.end, locale)}</strong>
        </div>
        <div className="solar-window-item">
          <span>{t('solar.goldenAM')}</span>
          <strong>{formatWindowRange(windows.goldenMorning.start, windows.goldenMorning.end, locale)}</strong>
        </div>
        <div className="solar-window-item">
          <span>{t('solar.goldenPM')}</span>
          <strong>{formatWindowRange(windows.goldenEvening.start, windows.goldenEvening.end, locale)}</strong>
        </div>
        <div className="solar-window-item">
          <span>{t('solar.bluePM')}</span>
          <strong>{formatWindowRange(windows.blueEvening.start, windows.blueEvening.end, locale)}</strong>
        </div>
      </div>
    </SectionCard>
  );
}