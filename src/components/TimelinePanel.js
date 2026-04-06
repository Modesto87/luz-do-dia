import { formatClock, formatWindowRange } from '../lib/format';
import SectionCard from './SectionCard';

function buildPath(points, step, baseline, paddingX) {
  return points
    .map((point, index) => {
      const x = paddingX + index * step;
      const y = baseline - point.score * 0.92;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function TimelinePanel({ t, locale, points, goalId, bestWindow, referenceDate, sunData }) {
  const scoredPoints = points.map((point) => ({
    ...point,
    score: point.scores[goalId]
  }));
  const width = Math.max(320, 28 * Math.max(1, scoredPoints.length - 1) + 32);
  const height = 170;
  const paddingX = 16;
  const baseline = 136;
  const step = scoredPoints.length > 1 ? (width - paddingX * 2) / (scoredPoints.length - 1) : 1;
  const linePath = buildPath(scoredPoints, step, baseline, paddingX);
  const areaPath = `${linePath} L ${paddingX + step * (scoredPoints.length - 1)} ${baseline} L ${paddingX} ${baseline} Z`;

  const startTime = scoredPoints[0]?.date?.getTime() ?? referenceDate.getTime();
  const endTime = scoredPoints[scoredPoints.length - 1]?.date?.getTime() ?? referenceDate.getTime();
  const span = Math.max(1, endTime - startTime);
  const xForDate = (date) => paddingX + ((date.getTime() - startTime) / span) * (width - paddingX * 2);

  const markers = [
    { key: 'now', label: t('timeline.markers.now'), date: referenceDate },
    { key: 'sunrise', label: t('timeline.markers.sunrise'), date: sunData.sunrise },
    { key: 'sunset', label: t('timeline.markers.sunset'), date: sunData.sunset }
  ].filter((marker) => marker.date.getTime() >= startTime && marker.date.getTime() <= endTime);

  const summary = bestWindow?.meaningful
    ? `${formatWindowRange(bestWindow.start, bestWindow.end, locale)} • ${bestWindow.peakScore}%`
    : t('timeline.noWindow');

  return (
    <SectionCard
      eyebrow={t('timeline.title')}
      title={summary}
      subtitle={t('timeline.subtitle')}
      className="timeline-panel"
      action={<span className="panel-pill">{t('timeline.bestWindow')}</span>}
    >
      <div className="timeline-chart-wrap">
        <svg className="timeline-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={t('timeline.title')}>
          {bestWindow?.meaningful ? (
            <rect
              x={xForDate(bestWindow.start)}
              y="20"
              width={Math.max(16, xForDate(bestWindow.end) - xForDate(bestWindow.start))}
              height="116"
              rx="14"
              className="timeline-highlight"
            />
          ) : null}

          <path d={areaPath} className="timeline-area" />
          <path d={linePath} className="timeline-line" />

          {scoredPoints.map((point, index) => {
            const x = paddingX + index * step;
            const y = baseline - point.score * 0.92;
            return <circle key={`${point.date.toISOString()}-${index}`} cx={x} cy={y} r="4" className="timeline-dot" />;
          })}

          {markers.map((marker) => {
            const x = xForDate(marker.date);
            return (
              <g key={marker.key}>
                <line x1={x} y1="18" x2={x} y2={baseline} className={`timeline-marker timeline-marker-${marker.key}`} />
                <text x={x} y="14" textAnchor="middle" className="timeline-marker-label">
                  {marker.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="timeline-axis">
          {scoredPoints.map((point, index) => (
            <div key={`${point.date.toISOString()}-label-${index}`} className="timeline-axis-item">
              <strong>{point.score}</strong>
              <span>{formatClock(point.date, locale)}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}