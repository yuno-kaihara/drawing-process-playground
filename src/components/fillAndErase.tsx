"use client";

import { useState } from "react";
import { useScene } from "@/contexts/SceneContext";

type Props = {
  mode: "fill" | "erase";
};

export default function FillAndErase({ mode }: Props) {
  const [isClicked, setIsClicked] = useState(false);

  const { goToNext } = useScene();

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isClicked) return;

    requestAnimationFrame(() => {
      setIsClicked(true);
    });

    setTimeout(() => {
      goToNext();
    }, 1500);
  };

  return (
    <div
      style={{
        height: "500px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        onPointerDown={onPointerDown}
        style={{
          width: "100px",
          height: "100px",
          cursor: "pointer",
          background: mode === "fill" ? "blue" : "red",
          animation: isClicked
            ? mode === "fill"
              ? "fillAnim 1s ease 0s 1 normal forwards running"
              : "eraseAnim 1s ease 0s 1 normal forwards running"
            : "",
        }}
      />

      <style jsx>{`
        @keyframes fillAnim {
          0% {
            transform: rotate(0deg);
          }
          60% {
            transform: rotate(-50deg);
          }
          100% {
            transform: rotate(-45deg);
          }
        }

        @keyframes eraseAnim {
          0% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-30px);
          }
          50% {
            transform: translateY(0);
          }
          70% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
