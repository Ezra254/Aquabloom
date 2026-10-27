export function Leadership() {
  const director = {
    name: 'Dr. Zacharia Shitote',
    title: 'Managing Director & CEO',
    bio: 'Provides strategic direction and oversees all operations across Aquabloom Ventures.',
    photo: '/media/team/zacharia.jpg',   // ← place photo at public/media/team/zacharia.jpg
  };

  const team = [
    {
      name: 'Cliff Phillip',
      title: 'Head of Hatchery Operations & Sales',
      bio: 'Leads fingerling production and manages key relationships with farmers, NGOs, and county governments.',
      photo: '/media/team/cliff.jpg',    // ← place photo at public/media/team/cliff.jpg
    },
    {
      name: 'Buyanzi Dolphine',
      title: 'Head of Community & Impact',
      bio: 'Oversees youth and women training programmes and community development initiatives.',
      photo: '/media/team/buyanzi.jpg',  // ← place photo at public/media/team/buyanzi.jpg
    },
    {
      name: 'Gift Ezra',
      title: '',
      bio: '',
      photo: '/media/team/gift.jpg',     // ← place photo at public/media/team/gift.jpg
    },
  ];

  return (
    <section className="section section--soft" id="leadership">
      <div className="ls-wrap">

        {/* Section intro */}
        <div className="section__intro">
          <p className="kicker">Our Leadership</p>
          <h2>Meet the Team Behind Aquabloom</h2>
          <p className="lede">
            A passionate and experienced leadership team driving sustainable aquaculture
            innovation across Kenya.
          </p>
        </div>

        {/* Org chart */}
        <div className="ls-chart">

          {/* ── Director ── */}
          <div className="ls-director-row">
            <article className="ls-card ls-card--director">
              <span className="ls-crown-badge">&#9733; Director</span>
              <div className="ls-avatar ls-avatar--lg">
                {director.photo
                  ? <img src={director.photo} alt={`Photo of ${director.name}`} className="ls-photo" />
                  : <AvatarIcon />}
              </div>
              <h3 className="ls-name">{director.name}</h3>
              <p className="ls-role">{director.title}</p>
              <p className="ls-bio">{director.bio}</p>
            </article>
          </div>

          {/* ── Connector ── */}
          <div className="ls-connector" aria-hidden="true">
            <div className="ls-conn-v" />
            <div className="ls-conn-h" />
            <div className="ls-conn-ticks">
              <div className="ls-conn-tick" />
              <div className="ls-conn-tick" />
              <div className="ls-conn-tick" />
            </div>
          </div>

          {/* ── Subordinates ── */}
          <div className="ls-team-row">
            {team.map((member, idx) => (
              <article key={idx} className="ls-card ls-card--member">
                <div className="ls-avatar ls-avatar--md">
                  {member.photo
                    ? <img src={member.photo} alt={`Photo of ${member.name}`} className="ls-photo" />
                    : <AvatarIcon />}
                </div>
                <h3 className="ls-name">{member.name}</h3>
                <p className="ls-role">{member.title}</p>
                <p className="ls-bio">{member.bio}</p>
              </article>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        /* ── Layout wrapper ── */
        .ls-wrap {
          width: min(var(--max-width), calc(100% - 2rem));
          margin-inline: auto;
        }

        /* ── Org-chart container ── */
        .ls-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        /* ── Director row ── */
        .ls-director-row {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        /* ── Team row (3 in a straight line) ── */
        .ls-team-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          width: 100%;
        }

        /* ── Card base ── */
        .ls-card {
          background: var(--color-surface);
          border-radius: var(--radius);
          padding: 1.8rem 1.4rem;
          box-shadow: 0 10px 24px rgba(12, 59, 74, 0.07);
          text-align: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          position: relative;
        }

        .ls-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(12, 59, 74, 0.13);
        }

        /* ── Director card ── */
        .ls-card--director {
          max-width: 340px;
          width: 100%;
          border-top: 4px solid var(--color-accent);
          padding-top: 2.4rem;
        }

        /* ── Crown badge ── */
        .ls-crown-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-accent);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 14px;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(201, 137, 46, 0.35);
        }

        /* ── Member card ── */
        .ls-card--member {
          border-top: 3px solid var(--color-teal);
        }

        /* ── Avatar ── */
        .ls-avatar {
          border-radius: 50%;
          background: var(--color-secondary);
          border: 2px solid rgba(31, 122, 114, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          overflow: hidden;
        }

        .ls-avatar--lg {
          width: 150px;
          height: 150px;
        }

        .ls-avatar--md {
          width: 120px;
          height: 120px;
        }

        .ls-avatar svg {
          width: 55%;
          height: 55%;
          color: var(--color-teal);
        }

        .ls-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          display: block;
        }

        /* ── Text ── */
        .ls-name {
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
          color: var(--color-primary);
        }

        .ls-role {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-teal);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.65rem;
        }

        .ls-bio {
          font-size: 0.9rem;
          color: var(--color-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* ── Connector lines ── */
        .ls-connector {
          position: relative;
          width: 100%;
          height: 52px;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }

        .ls-conn-v {
          width: 2px;
          height: 26px;
          background: linear-gradient(to bottom, var(--color-teal), rgba(31,122,114,0.3));
          border-radius: 2px;
        }

        .ls-conn-h {
          position: absolute;
          bottom: 0;
          /* align roughly with outer card centers in a 3-col grid */
          left: calc(100% / 6);
          right: calc(100% / 6);
          height: 2px;
          background: linear-gradient(
            to right,
            transparent,
            var(--color-teal) 10%,
            var(--color-teal) 90%,
            transparent
          );
          border-radius: 2px;
          opacity: 0.4;
        }

        .ls-conn-ticks {
          position: absolute;
          bottom: 0;
          left: calc(100% / 6);
          right: calc(100% / 6);
          display: flex;
          justify-content: space-between;
        }

        .ls-conn-tick {
          width: 2px;
          height: 26px;
          background: linear-gradient(to bottom, var(--color-teal), transparent);
          transform: translateY(-100%);
          border-radius: 2px;
          opacity: 0.45;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ls-team-row {
            grid-template-columns: 1fr;
            max-width: 340px;
          }
          .ls-connector {
            display: none;
          }
          .ls-chart {
            gap: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}

/* Silhouette SVG avatar icon */
function AvatarIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="28" r="16" fill="currentColor" opacity="0.45" />
      <ellipse cx="40" cy="64" rx="24" ry="17" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
