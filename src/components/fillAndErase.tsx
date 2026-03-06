"use client";

import { useState } from "react";
import { useScene } from "@/contexts/SceneContext";

import Lottie from "lottie-react";
import tapAnim from "@/assets/lottie/tap.json";

const NEXT_SCENE_DELAY = 1500;

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
    }, NEXT_SCENE_DELAY);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
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
          backgroundImage:
            mode === "fill"
              ? "url(./images/ui_bucket.png)"
              : "url(./images/ui_eraser.png)",
          backgroundSize: "cover",
          transform: mode === "fill" ? "" : "rotate(-50deg)",
          animationName: isClicked
            ? mode === "fill"
              ? "fillAnim"
              : "eraseAnim"
            : "",
          animationDuration: "1.2s",
          animationTimingFunction: "ease",
          animationFillMode: "forwards",
          cursor: "pointer",
          pointerEvents: isClicked ? "none" : "auto",
          touchAction: "none", // スマホ対策
        }}
      />

      {!isClicked && (
        <Lottie
          animationData={tapAnim}
          style={{
            width: 200,
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      )}

      <style jsx>{`
        @keyframes fillAnim {
          0% {
            transform: rotate(0deg);
          }
          60% {
            transform: rotate(50deg);
          }
          100% {
            transform: rotate(40deg);
          }
        }

        @keyframes eraseAnim {
          0% {
            transform: translateY(0) rotate(-50deg);
          }
          30% {
            transform: translateY(-30px) rotate(-50deg);
          }
          50% {
            transform: translateY(0) rotate(-50deg);
          }
          70% {
            transform: translateY(-20px) rotate(-50deg);
          }
          100% {
            transform: translateY(0) rotate(-50deg);
          }
        }
      `}</style>
    </div>
  );
}
