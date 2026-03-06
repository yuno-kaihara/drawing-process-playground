"use client";

import { useState } from "react";
import { useScene } from "@/contexts/SceneContext";

import Lottie from "lottie-react";
import tapAnim from "@/assets/lottie/tap.json";

const NEXT_SCENE_DELAY = 0;

type Circle = {
  x: number;
  y: number;
  r: number;
};

const circles: Circle[] = [
  { x: 83, y: 160, r: 141 },
  { x: 472, y: 419, r: 110 },
  { x: 624, y: 58, r: 85 },
];

export default function BubbleTap() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { goToNext } = useScene();

  const onClick = (index: number) => {
    if (index !== activeIndex) return;

    const nextActiveIndex = index + 1;
    setActiveIndex(nextActiveIndex);

    const isCompleted = nextActiveIndex >= circles.length;
    if (isCompleted) {
      setTimeout(() => {
        goToNext();
      }, NEXT_SCENE_DELAY);
    } else {
      goToNext();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {circles.map((c, i) => {
        const isClicked = i < activeIndex;
        const isDisabled = i !== activeIndex;
        const isTarget = !isClicked && !isDisabled;

        return (
          <div
            key={i}
            onClick={() => onClick(i)}
            className={`circle ${isClicked ? "clicked" : ""}`}
            style={{
              left: c.x - c.r,
              top: c.y - c.r,
              width: c.r * 2,
              height: c.r * 2,
              position: "absolute",
              borderRadius: "50%",
              background: isTarget
                ? "rgba(255,255,255,0.7)"
                : "rgba(255,255,255,0)",
              animation: "shadowPulse 2s infinite",
              cursor: "pointer",
              pointerEvents: isDisabled ? "none" : "auto",
              transition: "background 0.4s ease",
              touchAction: "none", // スマホ対策
            }}
          >
            {isClicked && (
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(255, 255, 255, 0.7)",
                  animation: "bubble 1s ease-out forwards",
                  pointerEvents: "none",
                }}
              />
            )}
            {isTarget && (
              <Lottie
                animationData={tapAnim}
                style={{
                  width: 200,
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes bubble {
          0% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.5);
          }

          60% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes shadowPulse {
          0% {
            filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5));
          }

          50% {
            filter: drop-shadow(0 0 20px rgba(0, 255, 255, 1));
          }

          100% {
            filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5));
          }
        }
      `}</style>
    </div>
  );
}
