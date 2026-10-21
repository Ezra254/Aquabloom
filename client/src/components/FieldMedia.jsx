import { companyContent } from '../data/companyContent';
import { MediaClip } from './MediaClip';

export function FieldMedia() {
  const { field } = companyContent;

  return (
    <section className="section" id="field">
      <div className="section__intro">
        <p className="kicker">{field.kicker}</p>
        <h2>{field.title}</h2>
        <p className="lede">{field.intro}</p>
      </div>

      <div className="clip-grid">
        {field.clips.map((clip) => (
          <MediaClip key={clip.src} {...clip} />
        ))}
      </div>

      <ul className="photo-grid">
        {field.photos.map((photo) => (
          <li key={photo.src}>
            <img src={photo.src} alt={photo.alt} />
            <p>{photo.caption}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
