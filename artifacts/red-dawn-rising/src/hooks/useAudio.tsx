import { useContext, createContext, useRef, useCallback } from 'react';
import { useSettings } from './useSettings';

interface AudioContextValue {
  playTypewriterClack: () => void;
  playGeigerTick: () => void;
  startVinylStatic: () => void;
  stopVinylStatic: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const acRef = useRef<AudioContext | null>(null);
  const vinylNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const vinylGainRef = useRef<GainNode | null>(null);

  const getAC = useCallback(() => {
    if (!acRef.current) {
      acRef.current = new AudioContext();
    }
    return acRef.current;
  }, []);

  const playTypewriterClack = useCallback(() => {
    if (!settings.audioEnabled) return;
    try {
      const ac = getAC();
      const buf = ac.createBuffer(1, ac.sampleRate * 0.03, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.15));
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const gain = ac.createGain();
      gain.gain.value = 0.18;
      src.connect(gain);
      gain.connect(ac.destination);
      src.start();
    } catch {}
  }, [settings.audioEnabled, getAC]);

  const playGeigerTick = useCallback(() => {
    if (!settings.audioEnabled) return;
    try {
      const ac = getAC();
      const buf = ac.createBuffer(1, ac.sampleRate * 0.015, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.08));
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      const gain = ac.createGain();
      gain.gain.value = 0.35;
      src.connect(gain);
      gain.connect(ac.destination);
      src.start();
    } catch {}
  }, [settings.audioEnabled, getAC]);

  const startVinylStatic = useCallback(() => {
    if (!settings.audioEnabled) return;
    try {
      const ac = getAC();
      if (vinylNoiseRef.current) return;
      const bufLen = ac.sampleRate * 2;
      const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
      const data = buf.getChannelData(0);
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
      for (let i = 0; i < bufLen; i++) {
        const white = Math.random() * 2 - 1;
        b0=0.99886*b0+white*0.0555179; b1=0.99332*b1+white*0.0750759;
        b2=0.96900*b2+white*0.1538520; b3=0.86650*b3+white*0.3104856;
        b4=0.55000*b4+white*0.5329522; b5=-0.7616*b5-white*0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+white*0.5362) * 0.04;
      }
      const src = ac.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const gain = ac.createGain();
      gain.gain.value = 0.12;
      src.connect(gain);
      gain.connect(ac.destination);
      src.start();
      vinylNoiseRef.current = src;
      vinylGainRef.current = gain;
    } catch {}
  }, [settings.audioEnabled, getAC]);

  const stopVinylStatic = useCallback(() => {
    try {
      if (vinylNoiseRef.current) {
        vinylNoiseRef.current.stop();
        vinylNoiseRef.current.disconnect();
        vinylNoiseRef.current = null;
      }
      if (vinylGainRef.current) {
        vinylGainRef.current.disconnect();
        vinylGainRef.current = null;
      }
    } catch {}
  }, []);

  return (
    <AudioCtx.Provider value={{ playTypewriterClack, playGeigerTick, startVinylStatic, stopVinylStatic }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
