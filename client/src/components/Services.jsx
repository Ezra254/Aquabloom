import { companyContent } from '../data/companyContent';

export function Services() {
  const { services } = companyContent;

  return (
    <section className="section section--soft" id="services">
      <div className="section__intro">
        <p className="kicker">{services.kicker}</p>
        <h2>{services.title}</h2>
        <p className="lede">{services.intro}</p>
      </div>

      <ol className="service-grid">
        {services.items.map((service, index) => (
          <li key={service.title}>
            <img src={service.image} alt={service.alt} />
            <div className="service-body">
              <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
