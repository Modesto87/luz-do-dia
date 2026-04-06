import SectionCard from './SectionCard';

export default function SceneLab({ t, scene, weatherOptions, onToggle, onChange }) {
  return (
    <SectionCard
      id="scene-lab"
      eyebrow={t('scene.title')}
      title={scene.enabled ? t('scene.simulated') : t('scene.live')}
      subtitle={t('scene.subtitle')}
      className="scene-panel"
      action={
        <div className="mode-switch">
          <button type="button" className={!scene.enabled ? 'is-active' : ''} onClick={() => onToggle(false)}>
            {t('scene.live')}
          </button>
          <button type="button" className={scene.enabled ? 'is-active' : ''} onClick={() => onToggle(true)}>
            {t('scene.simulated')}
          </button>
        </div>
      }
    >
      <div className="scene-grid">
        <div className={`control-card ${!scene.enabled ? 'is-disabled' : ''}`}>
          <label htmlFor="scene-time">{t('scene.time')}</label>
          <input
            id="scene-time"
            type="time"
            value={scene.time}
            disabled={!scene.enabled}
            onChange={(event) => onChange('time', event.target.value)}
          />
        </div>

        <div className={`control-card ${!scene.enabled ? 'is-disabled' : ''}`}>
          <div className="control-card-head">
            <span>{t('scene.clouds')}</span>
            <strong>{scene.clouds}%</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={scene.clouds}
            disabled={!scene.enabled}
            onChange={(event) => onChange('clouds', Number(event.target.value))}
          />
        </div>

        <div className={`control-card control-card-full ${!scene.enabled ? 'is-disabled' : ''}`}>
          <label htmlFor="scene-weather">{t('scene.weather')}</label>
          <select
            id="scene-weather"
            value={scene.code}
            disabled={!scene.enabled}
            onChange={(event) => onChange('code', Number(event.target.value))}
          >
            {weatherOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="panel-note">{t('scene.estimated')}</p>
    </SectionCard>
  );
}