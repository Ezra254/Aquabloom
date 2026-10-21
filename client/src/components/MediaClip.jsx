import { useEffect, useRef } from 'react';

export function MediaClip({ src, poster, caption }) {
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
    <figure className="media-clip">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
