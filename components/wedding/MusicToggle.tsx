'use client';

import React, { useState, useEffect } from 'react';

interface MusicToggleProps {
  musicUrl?: string | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isReady: boolean;
}

export default function MusicToggle({ musicUrl, audioRef, isReady }: MusicToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [audioRef]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />
      <button
        type="button"
        className={`music-fab ${isReady ? 'is-ready' : ''} ${isPlaying ? 'is-playing' : ''}`}
        id="musicBtn"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isPlaying ? 'Pause music' : 'Play music'}
        onClick={toggleMusic}
      >
        <span className="music-fab__icon">♪</span>
      </button>
    </>
  );
}
