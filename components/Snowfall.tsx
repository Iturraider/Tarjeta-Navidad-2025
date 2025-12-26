
import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: string; delay: string; size: string }[]>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 1 + 0.5}rem`,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            fontSize: flake.size,
            animationDuration: `${Math.random() * 3 + 5}s`
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
};

export default Snowfall;
