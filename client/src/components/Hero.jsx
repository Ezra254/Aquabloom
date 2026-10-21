import { useEffect, useRef } from 'react';
import { companyContent } from '../data/companyContent';

export function Hero() {
  const { hero, intro, highlights } = companyContent;
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyMotionPreference = () => {
      if (motion.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    applyMotionPreference();
    motion.addEventListener('change', applyMotionPreference);
    return () => motion.removeEventListener('change', applyMotionPreference);
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero__media" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={hero.poster}
        >
          <source src={hero.video} type="video/mp4" />
        </video>
      </div>
      <div className="hero__overlay" />

      <div className="hero__inner">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1>{hero.headline}</h1>
        <p className="hero__lead">{hero.supporting}</p>
        <div className="hero__actions">
          <a className="button-primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </a>
          <a className="button-secondary" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>

      <div className="intro-panel">
        <div>
          <h2>{intro.title}</h2>
          <p>{intro.text}</p>
        </div>
        <ul className="stat-grid">
          {highlights.map((item) => (
            <li key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
