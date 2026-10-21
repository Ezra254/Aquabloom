import { companyContent } from '../data/companyContent';

export function About() {
  const { about } = companyContent;

  return (
    <section className="section" id="about">
      <div className="about-layout">
        <div className="section__intro">
          <p className="kicker">{about.kicker}</p>
          <h2>{about.title}</h2>
          <p className="lede">{about.overview}</p>
        </div>
        <figure className="about-photo">
          <img src={about.photo.src} alt={about.photo.alt} />
        </figure>
      </div>

      <div className="split-cards">
        <article className="panel">
          <h3>{about.vision.title}</h3>
          <p>{about.vision.text}</p>
        </article>
        <article className="panel panel--accent">
          <h3>{about.mission.title}</h3>
          <p>{about.mission.text}</p>
        </article>
      </div>

      <h3 className="subhead">{about.valuesTitle}</h3>
      <ul className="value-grid">
        {about.values.map((value) => (
          <li key={value.title}>
            <h4>{value.title}</h4>
            <p>{value.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
