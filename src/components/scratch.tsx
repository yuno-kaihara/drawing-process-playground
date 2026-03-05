"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";

const AREA_WIDTH = 500;
const AREA_HEIGHT = 400;
const POINTER_SIZE = 50;
const COMPLETE_THRESHOLD = 0.95;
const NEXT_SCENE_DELAY = 500;

type Props = {
  maskImage: string;
  underImage: string;
};

export default function Scratch({ maskImage, underImage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const [isCleared, setIsCleared] = useState(false);
  const [progress, setProgress] = useState(0);

  const { goToNext } = useScene();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = AREA_WIDTH;
    canvas.height = AREA_HEIGHT;
    const img = new Image();
    img.src = maskImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, AREA_WIDTH, AREA_HEIGHT);
    };
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, POINTER_SIZE, 0, Math.PI * 2);
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
    isDrawing.current = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  const onPointerUp = () => {
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

    const updated_progress = Math.min(percent / COMPLETE_THRESHOLD, 1);
    setProgress(updated_progress);

    if (percent > COMPLETE_THRESHOLD) {
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
    <div style={{ padding: 20 }}>
      {/* 進捗バー */}
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

      <div
        style={{
          position: "relative",
          width: AREA_WIDTH,
          height: AREA_HEIGHT,
          userSelect: "none",
        }}
      >
        {/* 下の画像 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${underImage})`,
            backgroundSize: "cover",
          }}
        />

        {/* スクラッチ用キャンバス */}
        {!isCleared && (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              touchAction: "none",
              cursor: "pointer",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        )}
      </div>
    </div>
  );
}
