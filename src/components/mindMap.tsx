"use client";

import { useEffect, useState } from "react";
import { useScene } from "@/contexts/SceneContext";
import { useMaster } from "@/contexts/MasterContext";
import { Idea } from "@/types/master";

export default function MindMap() {
  const { ideaList } = useMaster();
  const { goToNext } = useScene();

  const [activeCount, setActiveCount] = useState(0);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setActiveCount((i) => Math.min(i + 1, ideaList.length));
  };

  useEffect(() => {
    if (activeCount >= ideaList.length) {
      goToNext();
    }
  }, [activeCount, ideaList.length, goToNext]);

  const renderItem = (idea: Idea, i: number): React.ReactNode => {
    const isChecked = i < activeCount;
    const isTarget = i === activeCount;
    return (
      <div
        key={i}
        onPointerDown={onPointerDown}
        style={{
          padding: "8px 12px",
          width: "300px",
          textAlign: "center",
          backgroundColor: isChecked ? "lightyellow" : "lightcyan",
          border: "1px gray solid",
          display: isTarget || isChecked ? "block" : "none",
          pointerEvents: isChecked ? "none" : "auto",
          margin: "12px",
          cursor: "pointer",
        }}
      >
        {isTarget ? "？" : idea.text}
      </div>
    );
  };

  return <div>{ideaList.map((idea, i) => renderItem(idea, i))}</div>;
}
