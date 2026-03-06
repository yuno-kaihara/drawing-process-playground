"use client";

import { useEffect, useState } from "react";
import { useScene } from "@/contexts/SceneContext";
import { useMaster } from "@/contexts/MasterContext";
import { Idea } from "@/types/master";
import { containerStyle, innerStyle } from "./ui/mindMapItem";
import LottieAnim from "@/components/effect/lottieAnim";

const NEXT_SCENE_DELAY = 500;

export default function MindMap() {
  const { ideaList } = useMaster();
  const { goToNext } = useScene();

  const [activeCount, setActiveCount] = useState(0);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveCount((i) => Math.min(i + 1, ideaList.length));
  };

  useEffect(() => {
    if (activeCount >= ideaList.length) {
      setTimeout(goToNext, NEXT_SCENE_DELAY);
    }
  }, [activeCount, ideaList.length, goToNext]);

  const renderItem = (idea: Idea, i: number): React.ReactNode => {
    const isChecked = i < activeCount;
    const isTarget = i === activeCount;
    return (
      <div
        key={i}
        style={{
          ...containerStyle(i),
          // 表示/非表示切り替え
          opacity: isTarget || isChecked ? 1 : 0,
          transition: "opacity 0.7s",
          animation: isTarget ? "shadowPulse 1s infinite" : "none",
        }}
      >
        <div
          onClick={onClick}
          style={{
            ...innerStyle(i),
            color: isTarget ? "rgba(0,0,0,0)" : "#000",
            transition: "color 0.7s",
            pointerEvents: isTarget ? "auto" : "none",
            cursor: "pointer",
            touchAction: "none", // スマホ対策
          }}
        >
          {isTarget && (
            <LottieAnim
              anim={"question"}
              width={80}
              style={"center"}
              customStyle={{ top: "6px", transform: "translate(-50%, 0)" }}
            />
          )}
          {idea.text}
        </div>

        <style jsx>{`
          @keyframes shadowPulse {
            0% {
              filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.2));
            }

            50% {
              filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.6));
            }

            100% {
              filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.2));
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      {ideaList.map((idea, i) => renderItem(idea, i))}
    </div>
  );
}
