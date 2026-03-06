"use client";

import Lottie from "lottie-react";
import clearAnim from "@/assets/lottie/clear.json";

export type Props = {
  isCompleted: boolean;
};

export default function CompletedEffect({ isCompleted }: Props) {
  return isCompleted ? (
    <Lottie
      animationData={clearAnim}
      loop={false}
      style={{
        width: 800,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  ) : null;
}
