export default function GoalTabs({ goals, activeGoal, onChange }) {
  return (
    <div className="goal-tabs" role="tablist" aria-label="Goal tabs">
      {goals.map((goal) => (
        <button
          key={goal.id}
          type="button"
          role="tab"
          aria-selected={activeGoal === goal.id}
          className={`goal-tab ${activeGoal === goal.id ? 'is-active' : ''}`}
          onClick={() => onChange(goal.id)}
        >
          <span className="goal-tab-label">{goal.label}</span>
          <span className="goal-tab-hint">{goal.hint}</span>
        </button>
      ))}
    </div>
  );
}
