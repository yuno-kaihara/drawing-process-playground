"use client";

import { useEffect, useState, useRef } from "react";
import { useMaster } from "@/contexts/MasterContext";
import { useScene } from "@/contexts/SceneContext";
import { Idea } from "@/types/master";
import { containerStyle, innerStyle } from "@/components/ui/mindMapItem";
import CompletedEffect from "@/components/effect/completedEffect";

const INTERVAL_MS = 700;
const NEXT_SCENE_DELAY = 500;

export default function IdeaCheckList() {
  const { ideaList } = useMaster();
  const { goToNext } = useScene();

  const [activeCount, setActiveCount] = useState(0);
  const isCompleted = activeCount > ideaList.length;

  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();

    timerRef.current = window.setInterval(() => {
      setActiveCount((i) => i + 1);
    }, INTERVAL_MS);

    return clearTimer;
  }, [ideaList.length]);

  useEffect(() => {
    if (isCompleted) {
      clearTimer();
      setTimeout(goToNext, NEXT_SCENE_DELAY);
    }
  }, [isCompleted, goToNext]);

  const renderItem = (idea: Idea, i: number): React.ReactNode => {
    const isChecked = i < activeCount;

    return (
      <div
        key={i}
        style={{
          ...containerStyle(i),
          // 表示/非表示切り替え
          opacity: isChecked ? 1 : 0,
          transition: "opacity 0.7s",
        }}
      >
        <div style={innerStyle(i)}>{idea.text}</div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {ideaList.map((idea, i) => renderItem(idea, i))}
      <CompletedEffect isCompleted={isCompleted} />
    </div>
  );
}
