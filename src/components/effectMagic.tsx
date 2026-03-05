"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";

const RADIUS_SPEED = 200; // px/sec
const COMPLETE_THRESHOLD = 0.99;
const NEXT_SCENE_DELAY = 500;

type Props = {
  maskImage: string;
  underImage: string;
};

export default function EffectMagic({ maskImage, underImage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);
  const radiusRef = useRef(0);
  const isPressing = useRef(false);
  const lastTimeRef = useRef<number | null>(null);

  const [isCleared, setIsCleared] = useState(false);

  const { goToNext } = useScene();

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    canvasWidth.current = canvas.width;
    canvasHeight.current = canvas.height;

    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.src = maskImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
  }, [maskImage, underImage]);

  const eraseMask = (radius: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(
      canvasWidth.current / 2,
      canvasHeight.current / 2,
      radius,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  };

  const update = (t: number) => {
    if (!isPressing.current) return;

    if (!lastTimeRef.current) lastTimeRef.current = t;
    const delta = (t - lastTimeRef.current) / 1000;
    lastTimeRef.current = t;
    radiusRef.current += delta * RADIUS_SPEED;

    eraseMask(radiusRef.current);

    const max_radius = Math.sqrt(
      (canvasWidth.current / 2) ** 2 + (canvasHeight.current / 2) ** 2,
    );
    const percent = Math.min(radiusRef.current / max_radius, 1);
    if (percent >= COMPLETE_THRESHOLD) {
      onCleared();
      return;
    }

    requestAnimationFrame(update);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (isCleared) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    isPressing.current = true;
    lastTimeRef.current = null;

    requestAnimationFrame(update);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isPressing.current = false;
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
          backgroundImage: `url(${underImage})`,
          backgroundSize: "cover",
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
            touchAction: "none",
            cursor: "pointer",
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
      )}
    </div>
  );
}
