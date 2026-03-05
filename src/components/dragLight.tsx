"use client";

import { useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";

const AREA_WIDTH = 500;
const AREA_HEIGHT = 400;
const LIGHT_SIZE = 100;
const GOAL_X = 75;
const GOAL_Y = 50;
const CLEAR_DISTANCE = 30;
const NEXT_SCENE_DELAY = 1000;

export default function DragLight() {
  const areaRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });

  const [pos, setPos] = useState({
    x: AREA_WIDTH - LIGHT_SIZE,
    y: AREA_HEIGHT - LIGHT_SIZE,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  const { goToNext } = useScene();

  const onPointerDown = (e: React.PointerEvent) => {
    if (isCleared) return;

    setIsDragging(true);

    const rect = areaRef.current!.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top - pos.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isCleared) return;

    const rect = areaRef.current!.getBoundingClientRect();
    let newX = e.clientX - rect.left - offset.current.x;
    let newY = e.clientY - rect.top - offset.current.y;
    // 領域外に出ないよう制限
    newX = Math.max(0, Math.min(AREA_WIDTH - LIGHT_SIZE, newX));
    newY = Math.max(0, Math.min(AREA_HEIGHT - LIGHT_SIZE, newY));
    setPos({ x: newX, y: newY });
  };

  const onPointerUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    const dx = pos.x - GOAL_X;
    const dy = pos.y - GOAL_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CLEAR_DISTANCE) {
      onCleared();
    }
  };

  const onCleared = () => {
    setIsCleared(true);
    setTimeout(() => {
      goToNext();
    }, NEXT_SCENE_DELAY);
  };

  return (
    <div>
      <div
        ref={areaRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          width: AREA_WIDTH,
          height: AREA_HEIGHT,
          position: "relative",
          background: "#f0f0f0",
        }}
      >
        {/* ゴール */}
        <div
          style={{
            position: "absolute",
            left: GOAL_X,
            top: GOAL_Y,
            width: LIGHT_SIZE,
            height: LIGHT_SIZE,
            border: "2px dashed red",
            borderRadius: "999px",
            background: "rgba(255,0,0,0.1)",
          }}
        />

        {/* ドラッグ対象 */}
        <div
          onPointerDown={onPointerDown}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: LIGHT_SIZE,
            height: LIGHT_SIZE,
            background: isCleared ? "green" : "gold",
            borderRadius: "999px",
            touchAction: "none",
            cursor: "grab",
            pointerEvents: isCleared ? "none" : "auto",
          }}
        />
      </div>
    </div>
  );
}
