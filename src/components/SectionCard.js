export default function SectionCard({ id, eyebrow, title, subtitle, action, className = '', children }) {
  return (
    <section id={id} className={`panel ${className}`.trim()}>
      {(eyebrow || title || subtitle || action) && (
        <div className="panel-header-row">
          <div className="panel-heading">
            {eyebrow ? <p className="panel-eyebrow">{eyebrow}</p> : null}
            {title ? <h2 className="panel-title">{title}</h2> : null}
            {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
          </div>
          {action ? <div className="panel-action">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}