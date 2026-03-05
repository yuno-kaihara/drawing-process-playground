"use client";

import { useState } from "react";
import { useScene } from "@/contexts/SceneContext";

type Props = {
  mode: "fill" | "erase";
};

export default function FillAndErase({ mode }: Props) {
  const [isClicked, setIsClicked] = useState(false);

  const { goToNext } = useScene();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isClicked) return;

    setIsClicked(true);

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
        onClick={onClick}
        style={{
          width: "100px",
          height: "100px",
          background: mode === "fill" ? "blue" : "red",
          animationName: isClicked
            ? mode === "fill"
              ? "fillAnim"
              : "eraseAnim"
            : "",
          animationDuration: "1s",
          animationTimingFunction: "ease",
          animationFillMode: "forwards",
          cursor: "pointer",
          pointerEvents: isClicked ? "none" : "auto",
          touchAction: "none", // スマホ対策
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
