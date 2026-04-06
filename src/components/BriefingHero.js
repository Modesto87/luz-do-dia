import SectionCard from './SectionCard';

export default function BriefingHero({
  t,
  goalLabel,
  score,
  bandLabel,
  phaseLabel,
  stateText,
  windowText,
  ctaText,
  decisionText,
  currentTime,
  isSimulated
}) {
  return (
    <SectionCard
      eyebrow={t('briefing.title')}
      title={goalLabel}
      subtitle={currentTime}
      className="hero-panel"
      action={<span className="panel-pill">{isSimulated ? t('common.simulated') : t('common.live')}</span>}
    >
      <div className="hero-layout">
        <div className="hero-score" style={{ '--score': `${score}%` }}>
          <div className="hero-score-ring">
            <div className="hero-score-value">
              {score}
              <span>%</span>
            </div>
            <div className="hero-score-band">{bandLabel}</div>
          </div>
        </div>

        <div className="hero-details">
          <div className="hero-detail-card">
            <span>{t('briefing.phase')}</span>
            <strong>{phaseLabel}</strong>
          </div>
          <div className="hero-detail-card">
            <span>{t('briefing.state')}</span>
            <strong>{stateText}</strong>
          </div>
          <div className="hero-detail-card">
            <span>{t('briefing.nextWindow')}</span>
            <strong>{windowText}</strong>
          </div>
          <div className="hero-detail-card">
            <span>{t('briefing.cta')}</span>
            <strong>{ctaText}</strong>
          </div>
        </div>
      </div>

      <div className="hero-decision">{decisionText}</div>
    </SectionCard>
  );
}