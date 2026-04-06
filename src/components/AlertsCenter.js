import SectionCard from './SectionCard';

function ToggleField({ label, checked, disabled, onChange }) {
  return (
    <label className={`toggle-field ${disabled ? 'is-disabled' : ''}`}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function RangeField({ label, valueLabel, min, max, step, value, disabled, onChange }) {
  return (
    <div className={`control-card ${disabled ? 'is-disabled' : ''}`}>
      <div className="control-card-head">
        <span>{label}</span>
        <strong>{valueLabel}</strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export default function AlertsCenter({
  t,
  settings,
  permission,
  goals,
  onToggleMaster,
  onRequestPermission,
  onSettingChange,
  onApplyPreset
}) {
  const permissionText = permission === 'unsupported' ? t('alerts.unsupported') : permission;

  return (
    <SectionCard
      eyebrow={t('alerts.title')}
      title={t('alerts.goalRule')}
      subtitle={t('alerts.subtitle')}
      className="alerts-panel"
      action={
        <button type="button" className={`pill-button ${settings.enabled ? 'is-active' : ''}`} onClick={onToggleMaster}>
          {settings.enabled ? t('alerts.active') : t('alerts.inactive')}
        </button>
      }
    >
      <div className="alerts-topline">
        <div>
          <span className="info-label">{t('alerts.permission')}</span>
          <strong>{permissionText}</strong>
        </div>
        <button type="button" className="ghost-button" onClick={onRequestPermission}>
          {t('alerts.requestPermission')}
        </button>
      </div>

      <div className="preset-row">
        <span className="info-label">{t('alerts.presets')}</span>
        <div className="preset-list">
          {goals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              className={`preset-chip ${settings.goalId === goal.id ? 'is-active' : ''}`}
              onClick={() => onApplyPreset(goal.id)}
            >
              {goal.label}
            </button>
          ))}
        </div>
      </div>

      <div className="alerts-form-grid">
        <div className={`control-card ${!settings.enabled ? 'is-disabled' : ''}`}>
          <label htmlFor="alerts-goal-select">{t('alerts.goal')}</label>
          <select
            id="alerts-goal-select"
            value={settings.goalId}
            disabled={!settings.enabled}
            onChange={(event) => onSettingChange('goalId', event.target.value)}
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.label}
              </option>
            ))}
          </select>
        </div>

        <RangeField
          label={t('alerts.threshold')}
          valueLabel={`${settings.goalThreshold}%`}
          min={40}
          max={95}
          step={1}
          value={settings.goalThreshold}
          disabled={!settings.enabled || !settings.goalAlertEnabled}
          onChange={(value) => onSettingChange('goalThreshold', value)}
        />

        <RangeField
          label={t('alerts.lead')}
          valueLabel={`${settings.goalLeadMinutes} ${t('common.minutes')}`}
          min={5}
          max={120}
          step={5}
          value={settings.goalLeadMinutes}
          disabled={!settings.enabled || !settings.goalAlertEnabled}
          onChange={(value) => onSettingChange('goalLeadMinutes', value)}
        />

        <RangeField
          label={t('alerts.sunsetLead')}
          valueLabel={`${settings.sunsetReminderMinutes} ${t('common.minutes')}`}
          min={5}
          max={120}
          step={5}
          value={settings.sunsetReminderMinutes}
          disabled={!settings.enabled || !settings.sunsetReminderEnabled}
          onChange={(value) => onSettingChange('sunsetReminderMinutes', value)}
        />

        <RangeField
          label={t('alerts.lowLightThreshold')}
          valueLabel={`${settings.lowLightThreshold}%`}
          min={5}
          max={60}
          step={1}
          value={settings.lowLightThreshold}
          disabled={!settings.enabled || !settings.lowLightEnabled}
          onChange={(value) => onSettingChange('lowLightThreshold', value)}
        />
      </div>

      <div className="toggle-stack">
        <ToggleField
          label={t('alerts.goalRule')}
          checked={settings.goalAlertEnabled}
          disabled={!settings.enabled}
          onChange={(value) => onSettingChange('goalAlertEnabled', value)}
        />
        <ToggleField
          label={t('alerts.sunsetReminder')}
          checked={settings.sunsetReminderEnabled}
          disabled={!settings.enabled}
          onChange={(value) => onSettingChange('sunsetReminderEnabled', value)}
        />
        <ToggleField
          label={t('alerts.lowLight')}
          checked={settings.lowLightEnabled}
          disabled={!settings.enabled}
          onChange={(value) => onSettingChange('lowLightEnabled', value)}
        />
      </div>

      <p className="panel-note">{t('alerts.manualHint')}</p>
    </SectionCard>
  );
}