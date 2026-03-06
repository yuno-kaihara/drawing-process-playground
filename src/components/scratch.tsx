"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";
import { useScale } from "@/contexts/ScaleContext";

const POINTER_SIZE = 60;
const NEXT_SCENE_DELAY = 500;

type Props = {
  maskImage: string;
  complete_threshold: number;
};

export default function Scratch({
  maskImage,
  complete_threshold,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const [isCleared, setIsCleared] = useState(false);
  const [progress, setProgress] = useState(0);

  const scale = useScale();

  const { goToNext } = useScene();

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const renderScale = dpr / scale;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * renderScale;
    canvas.height = rect.height * renderScale;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(renderScale, renderScale);

    const img = new Image();
    img.src = maskImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
  }, [maskImage, scale]);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, POINTER_SIZE * scale, 0, Math.PI * 2);
    ctx.fill();

    checkClear();
  };

  const getPos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDrawing.current = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isDrawing.current = false;
  };

  const checkClear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let transparent = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }

    const percent = transparent / (canvas.width * canvas.height);

    const updated_progress = Math.min(percent / complete_threshold, 1);
    setProgress(updated_progress);

    if (percent > complete_threshold) {
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
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* 下の画像 */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          background: "transparent",
        }}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />

      {/* マスク用キャンバス */}
      {!isCleared && (
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            touchAction: "none", // スマホ対策
            cursor: "pointer",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      )}

      {/* 進捗バー */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          top: 0,
          height: 10,
          background: "#fff",
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
    </div>
  );
}
