"use client";

import { useMemo, useState } from "react";
import "./page.css";

type Star = {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
};

export default function HomePage() {
  const [activated, setActivated] = useState(false);

  const secret = {
    left: 58,
    top: 54,
  };

  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 900 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.75 + 0.15,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 1.2,
    }));
  }, []);

  return (
    <main className="levelOne">
      {!activated && (
        <div className="introText">
          Вселенная была невообразимо горячей и плотной,
          <br />
          размером меньше атома.
        </div>
      )}

      <div className={activated ? "stars starsExploded" : "stars"}>
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: ${star.left}%,
              top: ${star.top}%,
              width: ${star.size}px,
              height: ${star.size}px,
              opacity: star.opacity,
              animationDelay: ${star.delay}s,
              animationDuration: ${star.duration}s,
            }}
          />
        ))}

        {!activated && (
          <button
            className="secretStar"
            onClick={() => setActivated(true)}
            aria-label="Скрытая точка"
            style={{
              left: ${secret.left}%,
              top: ${secret.top}%,
            }}
          />
        )}
      </div>

      {activated && (
        <div
          className="bigBang"
          style={
            {
              "--origin-x": ${secret.left}%,
              "--origin-y": ${secret.top}%,
            } as React.CSSProperties
          }
        >
          <div className="shockwave" />
          <div className="sphere" />
        </div>
      )}
    </main>
  );
}