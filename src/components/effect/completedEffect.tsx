"use client";

import { useState } from "react";
import LottieAnim from "@/components/effect/lottieAnim";

export type Props = {
  isCompleted: boolean;
};

export default function CompletedEffect({ isCompleted }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isCompleted) return null;

  return (
    <LottieAnim
      anim={"check"}
      width={400}
      style={"center"}
      customStyle={{ opacity: isVisible ? 1 : 0, transition: "opacity, 0.5s" }}
      loop={false}
      onComplete={() => setIsVisible(false)}
    />
  );
}
