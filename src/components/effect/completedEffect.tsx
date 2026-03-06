"use client";

import { useState } from "react";

import Lottie from "lottie-react";
import clearAnim from "@/assets/lottie/check.json";

export type Props = {
  isCompleted: boolean;
};

export default function CompletedEffect({ isCompleted }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isCompleted) return null;

  return (
    <Lottie
      animationData={clearAnim}
      loop={false}
      onComplete={() => setIsVisible(false)}
      style={{
        width: 400,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity, 0.5s",
      }}
    />
  );
}
