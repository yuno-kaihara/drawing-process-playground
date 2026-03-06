"use client";

import { useEffect, useRef } from "react";
import { useScene } from "@/contexts/SceneContext";

export type ShineEffectHandle = {
  trigger: () => void;
};

export default function ShineEffect() {
  const sweepRef = useRef<HTMLDivElement>(null);

  const { currentScene } = useScene();

  const restartAnimation = (el: HTMLElement | null, name: string) => {
    if (!el) return;

    el.style.animation = "none";
    void el.offsetHeight;
    requestAnimationFrame(() => {
      el.style.animation = name;
    });
  };

  useEffect(() => {
    if (currentScene.imageEffect === "shine") {
      restartAnimation(sweepRef.current, "shineSweep 1.2s ease");
    }
  }, [currentScene.imageEffect]);

  return (
    <>
      <div className="shine-root">
        <div className="shine-sweep" ref={sweepRef} />
      </div>

      <style jsx>{`
        .shine-root {
          pointer-events: none;
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .shine-sweep {
          position: absolute;
          top: -60%;
          left: -40%;
          width: 40%;
          height: 220%;

          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.15) 35%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0.15) 65%,
            rgba(255, 255, 255, 0) 100%
          );

          transform: translateX(-200%) rotate(20deg);
          mix-blend-mode: screen;
          filter: blur(2px);
        }

        @keyframes shineSweep {
          0% {
            transform: translateX(-200%) rotate(20deg);
          }

          100% {
            transform: translateX(600%) rotate(20deg);
          }
        }
      `}</style>
    </>
  );
}
