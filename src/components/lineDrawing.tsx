"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";

const MAX_DISTANCE = 3000;

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const LINE_WIDTH = 4;
const LINE_COLOR = "#000";

export default function LineDrawing() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const totalDistance = useRef(0);

  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { goToNext } = useScene();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineCap = "round";
  }, []);

  useEffect(() => {
    if (isCompleted) {
      setTimeout(goToNext, 500);
    }
  }, [isCompleted, goToNext]);

  const getPos = (e: PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const pointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isCompleted) return;

    isDrawing.current = true;

    const pos = getPos(e.nativeEvent);
    lastPoint.current = pos;
  };

  const pointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || isCompleted) return;

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

    const p = Math.min(totalDistance.current / MAX_DISTANCE, 1);
    setProgress(p);

    if (p >= 1) {
      setIsCompleted(true);
    }

    lastPoint.current = pos;
  };

  const pointerUp = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  return (
    <div style={{ padding: 40 }}>
      <div
        style={{
          width: 500,
          height: 10,
          background: "#eee",
          marginBottom: 16,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "#000",
            transition: "width 0.1s",
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerLeave={pointerUp}
        style={{
          border: "1px solid #ccc",
          touchAction: "none",
          cursor: "crosshair",
          pointerEvents: isCompleted ? "none" : "auto",
        }}
      />
    </div>
  );
}
