"use client";

import { useEffect, useRef } from "react";

type ViewportVideoProps = {
  src: string;
  poster: string;
  label: string;
};

export default function ViewportVideo({ src, poster, label }: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const syncPlayback = () => {
      if (motionPreference.matches || document.hidden || !visible) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        // The poster remains visible until the browser allows muted playback.
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.2, rootMargin: "120px 0px" });

    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    window.addEventListener("pointerdown", syncPlayback, { passive: true });
    motionPreference.addEventListener("change", syncPlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("pointerdown", syncPlayback);
      motionPreference.removeEventListener("change", syncPlayback);
    };
  }, []);

  return (
    <video ref={videoRef} className="index-project-video" poster={poster} muted loop playsInline preload="metadata" aria-label={label}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
