import { useEffect, useRef } from 'react';

export function MediaClip({ title, tag, src, poster, caption }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyMotionPreference = () => {
      if (motion.matches) {
        video.pause();
      }
    };

    applyMotionPreference();
    motion.addEventListener('change', applyMotionPreference);
    return () => motion.removeEventListener('change', applyMotionPreference);
  }, []);

  return (
    <figure className="media-clip">
      <div className="media-clip__video-wrap">
        {tag && <span className="media-clip__badge">{tag}</span>}
        <video
          ref={videoRef}
          controls
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <figcaption className="media-clip__body">
        {title && <h4>{title}</h4>}
        <p>{caption}</p>
      </figcaption>
    </figure>
  );
}
