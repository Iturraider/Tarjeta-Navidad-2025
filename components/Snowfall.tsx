
import React, { useMemo } from 'react';

const Snowfall: React.FC = () => {
  const flakes = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      delay: `${Math.random() * 10}s`,
      size: `${Math.random() * 0.8 + 0.4}rem`,
      duration: `${Math.random() * 10 + 10}s`,
      opacity: Math.random() * 0.4 + 0.2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            fontSize: flake.size,
            animationDuration: flake.duration,
            opacity: flake.opacity
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
