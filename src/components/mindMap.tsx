"use client";

import { useState } from "react";
import { useScene } from "@/contexts/SceneContext";
import { useMaster } from "@/contexts/MasterContext";
import { Idea } from "@/types/master";

export default function MindMap() {
  const { ideaList } = useMaster();
  const { goToNext } = useScene();

  const [currentProgress, setCurrentProgress] = useState(0);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setCurrentProgress((i) => i + 1);
    if (currentProgress >= ideaList.length - 1) {
      goToNext();
    }
  };

  const renderItem = (idea: Idea, i: number): React.ReactNode => {
    return (
      <div
        key={i}
        onPointerDown={onPointerDown}
        style={{
          padding: "8px 12px",
          width: "300px",
          textAlign: "center",
          backgroundColor: currentProgress > i ? "lightyellow" : "lightcyan",
          border: "1px gray solid",
          display: currentProgress >= i ? "block" : "none",
          pointerEvents: currentProgress > i ? "none" : "auto",
          margin: "12px",
          cursor: "pointer",
        }}
      >
        {currentProgress === i ? "？" : idea.text}
      </div>
    );
  };

  return <div>{ideaList.map((idea, i) => renderItem(idea, i))}</div>;
}
