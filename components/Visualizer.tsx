import React, { useEffect, useState, useRef } from 'react';

const Visualizer: React.FC<{ active: boolean }> = ({ active }) => {
  const [bars, setBars] = useState<number[]>(Array(12).fill(2));
  const frameRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setBars(Array(12).fill(2));
      return;
    }

    const update = (time: number) => {
      // Обнова на секои 150ms за ретро ритам
      if (time - lastUpdateRef.current > 150) {
        setBars(prev => prev.map(() => Math.floor(Math.random() * 12) + 2));
        lastUpdateRef.current = time;
      }
      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);

  return (
    <div className="flex items-end justify-center gap-1 h-6" aria-hidden="true">
      {bars.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-stone-500/40 transition-all duration-300 rounded-t-sm"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
};

export default Visualizer;