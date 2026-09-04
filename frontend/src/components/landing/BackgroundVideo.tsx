"use client";

import React, { useEffect, useRef } from "react";

const VIDEO_SOURCE = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: any = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari / iOS
      video.src = VIDEO_SOURCE;
    } else {
      // Dynamic import to be 100% SSR-safe in Next.js
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported() && videoRef.current) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hlsInstance.loadSource(VIDEO_SOURCE);
          hlsInstance.attachMedia(videoRef.current);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play().catch((err) => {
              console.warn("Autoplay was prevented:", err);
            });
          });
        }
      });
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-100"
      />
    </div>
  );
}

