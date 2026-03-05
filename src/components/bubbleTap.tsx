"use client";

import { useState } from "react";
import { useScene } from "@/contexts/SceneContext";

const AREA_WIDTH = 500;
const AREA_HEIGHT = 400;
const NEXT_SCENE_DELAY = 1000;

type Circle = {
  x: number;
  y: number;
  r: number;
};

const circles: Circle[] = [
  { x: 120, y: 100, r: 80 },
  { x: 320, y: 200, r: 60 },
  { x: 220, y: 320, r: 50 },
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
        width: AREA_WIDTH,
        height: AREA_HEIGHT,
        position: "relative",
        background: "gray",
        overflow: "hidden",
      }}
    >
      {circles.map((c, i) => {
        const isClicked = i < activeIndex;
        const isDisabled = i !== activeIndex;

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
              background: isClicked
                ? "rgba(255,255,255,0)"
                : isDisabled
                  ? "white"
                  : "red",
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
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(255, 255, 255, 0.6)",
                  animation: "bubble 1s ease-out forwards",
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
            transform: translate(-50%, -50%) scale(3);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(4);
          }
        }
      `}</style>
    </div>
  );
}
