import { companyContent } from '../data/companyContent';

export function Impact() {
  const { impact } = companyContent;

  return (
    <section className="section" id="impact">
      <div className="section__intro">
        <p className="kicker">{impact.kicker}</p>
        <h2>{impact.title}</h2>
        <p className="lede">{impact.intro}</p>
      </div>

      <div className="impact-grid">
        {impact.groups.map((group) => (
          <article
            key={group.title}
            className={`impact-card${group.title === 'Sustainability and innovation' ? ' impact-card--hatchery' : ''}`}
          >
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
