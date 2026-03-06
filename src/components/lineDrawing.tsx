"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";
import { useScale } from "@/contexts/ScaleContext";
import ProgressBar from "@/components/ui/progressBar";

const MAX_DISTANCE = 3000;
const LINE_WIDTH = 4;
const LINE_COLOR = "#000";
const NEXT_SCENE_DELAY = 500;

export default function LineDrawing() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const totalDistance = useRef(0);

  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const scale = useScale();

  const { goToNext } = useScene();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.lineWidth = LINE_WIDTH * scale;
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineCap = "round";
  }, [scale]);

  useEffect(() => {
    if (isCompleted) {
      setTimeout(goToNext, NEXT_SCENE_DELAY);
    }
  }, [isCompleted, goToNext]);

  const getPos = (e: PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const pointerDown = (e: React.PointerEvent) => {
    if (isCompleted) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    isDrawing.current = true;

    const pos = getPos(e.nativeEvent);
    lastPoint.current = pos;
  };

  const pointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const pos = getPos(e.nativeEvent);

    const last = lastPoint.current;
    if (!last) return;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    const dx = pos.x - last.x;
    const dy = pos.y - last.y;
    const distance = Math.hypot(dx, dy);

    totalDistance.current += distance;

    const p = Math.min(totalDistance.current / (MAX_DISTANCE * scale), 1);
    setProgress(p);

    if (p >= 1) {
      setIsCompleted(true);
    }

    lastPoint.current = pos;
  };

  const pointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isDrawing.current = false;
    lastPoint.current = null;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerLeave={pointerUp}
        style={{
          width: "100%",
          height: "100%",
          opacity: 0.7,
          background: "rgba(255,255,255)",
          position: "relative",
          touchAction: "none",
          cursor: "crosshair",
        }}
      />
      <ProgressBar rate={progress} />
    </div>
  );
}
