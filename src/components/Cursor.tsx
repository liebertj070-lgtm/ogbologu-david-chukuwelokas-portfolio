import { useEffect, useRef, useState } from 'react';

interface CursorProps {
  enabled: boolean;
  label?: string | null;
}

export function Cursor({ enabled, label }: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [isPointerHover, setIsPointerHover] = useState(false);

  useEffect(() => {
    setActiveLabel(label ?? null);
  }, [label]);

  useEffect(() => {
    if (!enabled) return;
    // Skip on touch devices
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, input, textarea, [data-cursor]');
      if (interactive) {
        setIsPointerHover(true);
        const custom = interactive.getAttribute('data-cursor');
        if (custom) setActiveLabel(custom);
      } else {
        setIsPointerHover(false);
        if (!label) setActiveLabel(null);
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, label]);

  if (!enabled) return null;

  const expanded = Boolean(activeLabel || isPointerHover);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block" aria-hidden="true">
      {/* Signal orange core dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#FF6A1A] transition-transform duration-75 will-change-transform"
      />
      {/* Trailing magnetic ring */}
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,margin,border-color,background-color] duration-200 will-change-transform ${
          expanded
            ? '-ml-7 -mt-7 h-14 w-14 border-[#FF6A1A] bg-[#FF6A1A]/12'
            : '-ml-4 -mt-4 h-8 w-8 border-white/40 bg-transparent'
        }`}
      >
        {activeLabel && (
          <span className="font-mono text-[10px] font-semibold tracking-wider text-white uppercase">
            {activeLabel}
          </span>
        )}
      </div>
    </div>
  );
}
