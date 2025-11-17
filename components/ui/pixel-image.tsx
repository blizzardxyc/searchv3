// components/ui/pixel-image.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type Grid = {
  rows: number;
  cols: number;
};

const DEFAULT_GRIDS: Record<string, Grid> = {
  '6x4': { rows: 4, cols: 6 },
  '8x8': { rows: 8, cols: 8 },
  '8x3': { rows: 3, cols: 8 },
  '4x6': { rows: 6, cols: 4 },
  '3x8': { rows: 8, cols: 3 },
};

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

interface PixelImageProps {
  src: string;
  grid?: PredefinedGridKey;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number; // in ms
  maxAnimationDelay?: number; // in ms
  colorRevealDelay?: number; // in ms
}

export const PixelImage = ({
  src,
  grid = '6x4',
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid,
}: PixelImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const MIN_GRID = 1;
  const MAX_GRID = 16;

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (g?: Grid) => {
      if (!g) return false;
      const { rows, cols } = g;
      return (
        Number.isInteger(rows) &&
        Number.isInteger(cols) &&
        rows >= MIN_GRID &&
        cols >= MIN_GRID &&
        rows <= MAX_GRID &&
        cols <= MAX_GRID
      );
    };

    return isValidGrid(customGrid) ? (customGrid as Grid) : DEFAULT_GRIDS[grid];
  }, [customGrid, grid]);

  /**
   * Deterministic seeded PRNG function (LCG) so results are stable across renders.
   * We derive a seed from `src`, `rows`, `cols`, and `maxAnimationDelay` so the delays
   * change only when these inputs change.
   */
  const delays = useMemo(() => {
    const total = rows * cols;

    // simple string hash to produce a numeric seed
    let seed = 2166136261 >>> 0;
    const key = `${src}|${rows}x${cols}|${maxAnimationDelay}`;
    for (let i = 0; i < key.length; i++) {
      seed ^= key.charCodeAt(i);
      seed = Math.imul(seed, 16777619) >>> 0;
    }

    // LCG constants (32-bit)
    const mod = 2 ** 32;
    const a = 1664525;
    const c = 1013904223;

    const out: number[] = new Array(total);
    let s = seed;
    for (let i = 0; i < total; i++) {
      // advance LCG
      s = (Math.imul(a, s) + c) >>> 0;
      // map to [0, 1)
      const rnd = s / mod;
      out[i] = Math.round(rnd * maxAnimationDelay);
    }
    return out;
  }, [src, rows, cols, maxAnimationDelay]);

  // Show pieces (set isVisible) but avoid calling setState synchronously inside effect.
  useEffect(() => {
    // Defer the visibility change to a micro task to avoid synchronous setState inside effect.
    const t = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    const colorTimeout = setTimeout(() => {
      setShowColor(true);
    }, colorRevealDelay);

    return () => {
      clearTimeout(t);
      clearTimeout(colorTimeout);
    };
  }, [colorRevealDelay]);

  const pieces = useMemo(() => {
    const total = rows * cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const clipPath = `polygon(
        ${col * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${row * (100 / rows)}%,
        ${(col + 1) * (100 / cols)}% ${(row + 1) * (100 / rows)}%,
        ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%
      )`;

      return { clipPath };
    });
  }, [rows, cols]);

  return (
    <div className="relative h-12 w-12 select-none md:h-12 md:w-12">
      {pieces.map((piece, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 transition-all ease-out',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${delays[index] ?? 0}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
          }}
        >
          <img
            src={src}
            alt={`Pixel image piece ${index + 1}`}
            className={cn(
              'z-1 rounded-[2.5rem] object-cover',
              grayscaleAnimation && (showColor ? 'grayscale-0' : 'grayscale')
            )}
            style={{
              transition: grayscaleAnimation
                ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : 'none',
            }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};
