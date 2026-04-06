import SectionCard from './SectionCard';

export default function MetricsGrid({ t, metrics }) {
  return (
    <SectionCard eyebrow={t('metrics.title')} title={t('metrics.title')} subtitle={t('metrics.subtitle')} className="metrics-panel">
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.id} className={`metric-card ${metric.tone ? `metric-${metric.tone}` : ''}`}>
            <span className="metric-label">{metric.label}</span>
            <div className="metric-value">
              {metric.value}
              {metric.unit ? <span>{metric.unit}</span> : null}
            </div>
            <p className="metric-caption">{metric.caption}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}