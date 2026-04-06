import SectionCard from './SectionCard';

export default function InsightsPanel({
  t,
  moonData,
  darknessScore,
  comparison,
  packingHints,
  setupHints,
  technicalStats
}) {
  return (
    <SectionCard eyebrow={t('insights.title')} title={t('insights.title')} className="insights-panel">
      <div className="insights-grid">
        <article className="insight-card">
          <span className="insight-label">{t('insights.astro')}</span>
          <div className="insight-value">
            {moonData.icon} {darknessScore}
            <span>%</span>
          </div>
          <p>{`${t('insights.moonPhase')}: ${t(`moon.${moonData.phaseKey}`)}`}</p>
          <p>{`${t('insights.illumination')}: ${moonData.illumination}%`}</p>
        </article>

        <article className="insight-card">
          <span className="insight-label">{t('insights.todayTomorrow')}</span>
          {comparison ? (
            <>
              <div className="comparison-row">
                <span>{t('insights.todayPeak')}</span>
                <strong>{comparison.todayPeak}</strong>
              </div>
              <div className="comparison-row">
                <span>{t('insights.tomorrowPeak')}</span>
                <strong>{comparison.tomorrowPeak}</strong>
              </div>
              <p>{`${t('insights.daylightDelta')}: ${comparison.daylightDelta}`}</p>
              <p>{`${t('insights.sunshineBias')}: ${comparison.sunshineBias}`}</p>
              <p>{`${t('insights.tomorrowWeather')}: ${comparison.tomorrowWeather}`}</p>
              <p>{`${t('insights.tomorrowTemperature')}: ${comparison.tomorrowTemperature}`}</p>
            </>
          ) : (
            <p>{t('insights.noTomorrow')}</p>
          )}
        </article>

        <article className="insight-card">
          <span className="insight-label">{t('insights.setup')}</span>
          <div className="tag-list">
            {packingHints.map((hint) => (
              <span key={hint} className="tag-chip">
                {t(`hints.${hint}`)}
              </span>
            ))}
          </div>
          <div className="setup-list">
            {setupHints.map((hint) => (
              <p key={hint}>{t(`setup.${hint}`)}</p>
            ))}
          </div>
        </article>

        <article className="insight-card">
          <span className="insight-label">{t('insights.technical')}</span>
          <div className="technical-grid">
            {technicalStats.map((stat) => (
              <div key={stat.label} className="technical-item">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </SectionCard>
  );
}