import React, { useEffect, useRef } from 'react';
import { getAnalyserNode } from '../services/voiceService.ts';

interface WaveformVisualizerProps {
  status: 'idle' | 'listening' | 'processing' | 'speaking';
  isMuted?: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  status,
  isMuted = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;

      // Sample real audio analysis if active
      let realEnergy = 0;
      if ((status === 'speaking' || status === 'listening') && !isMuted) {
        try {
          const analyser = getAnalyserNode();
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < 32; i++) {
            sum += dataArray[i];
          }
          realEnergy = sum / (32 * 255);
        } catch {
          realEnergy = 0.4;
        }
      }

      const baseAmplitude =
        status === 'speaking'
          ? 32 + realEnergy * 44
          : status === 'listening'
          ? 20 + realEnergy * 30
          : status === 'processing'
          ? 14
          : 6;

      const speed =
        status === 'speaking'
          ? 0.08
          : status === 'listening'
          ? 0.05
          : status === 'processing'
          ? 0.12
          : 0.02;

      phase += speed;

      // Draw 3 layered harmonic waves
      const waves = [
        {
          color: 'rgba(154, 107, 58, 0.75)', // Deep Bronze
          ampFactor: 1.0,
          freqFactor: 0.015,
          offset: 0,
          lineWidth: 2.2,
        },
        {
          color: 'rgba(180, 130, 70, 0.45)', // Warm Amber
          ampFactor: 0.65,
          freqFactor: 0.022,
          offset: 1.8,
          lineWidth: 1.5,
        },
        {
          color: 'rgba(120, 80, 40, 0.3)', // Subtle Charcoal-Gold
          ampFactor: 0.35,
          freqFactor: 0.035,
          offset: 3.5,
          lineWidth: 1.2,
        },
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.lineWidth = w.lineWidth;
        ctx.strokeStyle = w.color;

        for (let x = 0; x < width; x++) {
          // Windowing envelope to fade edges to zero smoothly
          const normX = x / width;
          const envelope = Math.sin(normX * Math.PI);

          let y =
            centerY +
            Math.sin(x * w.freqFactor + phase + w.offset) *
              baseAmplitude *
              w.ampFactor *
              envelope;

          if (status === 'processing') {
            // Ripple effect
            y += Math.sin(normX * 12 + phase * 2) * 5 * envelope;
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Ambient center glow when speaking
      if (status === 'speaking') {
        const glow = ctx.createRadialGradient(
          width / 2,
          centerY,
          0,
          width / 2,
          centerY,
          width / 2.5
        );
        glow.addColorStop(0, 'rgba(180, 130, 70, 0.12)');
        glow.addColorStop(1, 'rgba(251, 249, 245, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [status, isMuted]);

  return (
    <div className="relative w-full h-32 md:h-40 flex items-center justify-center overflow-hidden rounded-xl bg-stone-100/60 border border-stone-200/60 shadow-inner">
      <canvas
        ref={canvasRef}
        width={720}
        height={160}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-3 left-4 text-xs font-mono tracking-tight text-stone-500 uppercase">
        {status === 'speaking'
          ? 'Joosep Speaking · Deep Resonant Male Tone'
          : status === 'listening'
          ? 'Listening · Auto-detecting EN / ET'
          : status === 'processing'
          ? 'Synthesizing voice response...'
          : 'Ready · Real-time Voice Channel'}
      </div>
    </div>
  );
};
