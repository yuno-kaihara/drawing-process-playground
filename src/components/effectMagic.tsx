"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";

const AREA_WIDTH = 500;
const AREA_HEIGHT = 400;
const MAX_RADIUS = Math.sqrt((AREA_WIDTH / 2) ** 2 + (AREA_HEIGHT / 2) ** 2);
const RADIUS_SPEED = 200; // px/sec
const COMPLETE_THRESHOLD = 0.99;
const NEXT_SCENE_DELAY = 500;

type Props = {
  maskImage: string;
  underImage: string;
};

export default function EffectMagic({ maskImage, underImage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isPressing = useRef(false);
  const radiusRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const [isCleared, setIsCleared] = useState(false);

  const { goToNext } = useScene();

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = AREA_WIDTH;
    canvas.height = AREA_HEIGHT;

    const img = new Image();
    img.src = maskImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, AREA_WIDTH, AREA_HEIGHT);
    };
  }, [maskImage]);

  const eraseMask = (radius: number) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(AREA_WIDTH / 2, AREA_HEIGHT / 2, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const update = (t: number) => {
    if (!isPressing.current) return;

    if (!lastTimeRef.current) lastTimeRef.current = t;
    const delta = (t - lastTimeRef.current) / 1000;
    lastTimeRef.current = t;
    radiusRef.current += delta * RADIUS_SPEED;

    eraseMask(radiusRef.current);

    const percent = Math.min(radiusRef.current / MAX_RADIUS, 1);
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
    <div style={{ padding: 20 }}>
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

        {/* マスク用キャンバス */}
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
            onPointerUp={onPointerUp}
          />
        )}
      </div>
    </div>
  );
}
