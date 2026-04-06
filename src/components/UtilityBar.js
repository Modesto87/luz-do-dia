import { formatClock } from '../lib/format';
import { languageOptions } from '../lib/i18n';

export default function UtilityBar({
  title,
  tagline,
  locationName,
  online,
  lastUpdated,
  locale,
  lang,
  onLangChange,
  onJumpToSceneLab,
  isSimulated,
  t
}) {
  const updatedLabel = t('utility.updated', {
    time: lastUpdated ? formatClock(new Date(lastUpdated), locale) : '--:--'
  });

  return (
    <header className="utility-bar">
      <div className="brand-block">
        <p className="brand-kicker">{t('utility.offlineReady')}</p>
        <h1>{title}</h1>
        <p>{tagline}</p>
      </div>

      <div className="utility-row">
        <div className="utility-chips">
          <span className="utility-chip">{locationName}</span>
          <span className={`utility-chip ${online ? 'is-online' : 'is-offline'}`}>
            {online ? t('common.online') : t('common.offline')}
          </span>
          <span className={`utility-chip ${isSimulated ? 'is-simulated' : ''}`}>
            {isSimulated ? t('common.simulated') : t('common.live')}
          </span>
        </div>

        <div className="utility-actions">
          <button type="button" className="ghost-button" onClick={onJumpToSceneLab}>
            {t('utility.quickSimulation')}
          </button>

          <label className="language-control" htmlFor="lang-select">
            <span>{t('language.label')}</span>
            <select id="lang-select" value={lang} onChange={(event) => onLangChange(event.target.value)}>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="utility-row utility-row-muted">
        <span>{updatedLabel}</span>
        <span>{t('utility.cacheHint')}</span>
      </div>
    </header>
  );
}