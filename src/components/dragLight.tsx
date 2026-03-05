"use client";

import { useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";
import { useCanvasSize } from "@/contexts/CanvasContext";

const LIGHT_SIZE = 100;
const GOAL_X = 75;
const GOAL_Y = 50;
const CLEAR_DISTANCE = 20;
const NEXT_SCENE_DELAY = 1000;

export default function DragLight() {
  const areaRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });

  const { width, height } = useCanvasSize();

  const [pos, setPos] = useState({
    x: width - LIGHT_SIZE,
    y: height - LIGHT_SIZE,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  const { goToNext } = useScene();

  const onPointerDown = (e: React.PointerEvent) => {
    if (isCleared) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setIsDragging(true);

    const rect = areaRef.current!.getBoundingClientRect();
    if (!rect) return;

    offset.current = {
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top - pos.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isCleared) return;

    const rect = areaRef.current!.getBoundingClientRect();
    if (!rect) return;

    let newX = e.clientX - rect.left - offset.current.x;
    let newY = e.clientY - rect.top - offset.current.y;
    // 領域外に出ないよう制限
    newX = Math.max(0, Math.min(width - LIGHT_SIZE, newX));
    newY = Math.max(0, Math.min(height - LIGHT_SIZE, newY));
    setPos({ x: newX, y: newY });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (!isDragging) return;

    setIsDragging(false);

    const lightCenterX = pos.x + LIGHT_SIZE / 2;
    const lightCenterY = pos.y + LIGHT_SIZE / 2;
    const goalCenterX = GOAL_X + LIGHT_SIZE / 2;
    const goalCenterY = GOAL_Y + LIGHT_SIZE / 2;

    const dx = lightCenterX - goalCenterX;
    const dy = lightCenterY - goalCenterY;

    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CLEAR_DISTANCE) {
      setPos({ x: GOAL_X, y: GOAL_Y });
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
    <div
      ref={areaRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "rgba(0,0,0,0.3)",
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
          border: "2px dashed orange",
          borderRadius: "50%",
          background: "rgba(255,255,0,0.5)",
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
          borderRadius: "50%",
          touchAction: "none", // スマホ対策
          cursor: "grab",
          pointerEvents: isCleared ? "none" : "auto",
        }}
      />
    </div>
  );
}
