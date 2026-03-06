"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";
import { useScale } from "@/contexts/ScaleContext";
import ProgressBar from "@/components/ui/progressBar";
import LottieAnim from "@/components/effect/lottieAnim";

const RADIUS_SPEED = 200; // px/sec
const COMPLETE_THRESHOLD = 0.99;
const NEXT_SCENE_DELAY = 500;

type Props = {
  maskImage: string;
};

export default function EffectMagic({ maskImage }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);
  const radiusRef = useRef(0);
  const isPressingRef = useRef(false);
  const lastTimeRef = useRef<number | null>(null);

  const [isPressing, setIsPressing] = useState(false);
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

    canvasWidth.current = rect.width;
    canvasHeight.current = rect.height;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(renderScale, renderScale);

    const img = new Image();
    img.src = maskImage;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
  }, [maskImage, scale]);

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
    if (!isPressingRef.current) return;

    if (!lastTimeRef.current) lastTimeRef.current = t;
    const delta = (t - lastTimeRef.current) / 1000;
    lastTimeRef.current = t;
    radiusRef.current += delta * RADIUS_SPEED * scale;

    eraseMask(radiusRef.current);

    const max_radius = Math.sqrt(
      (canvasWidth.current / 2) ** 2 + (canvasHeight.current / 2) ** 2,
    );
    const progress = Math.min(radiusRef.current / max_radius, 1);
    setProgress(progress);
    if (progress >= COMPLETE_THRESHOLD) {
      onCleared();
      return;
    }

    requestAnimationFrame(update);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (isCleared) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    isPressingRef.current = true;
    setIsPressing(true);
    lastTimeRef.current = null;

    requestAnimationFrame(update);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    isPressingRef.current = false;
    setIsPressing(false);
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
            touchAction: "none",
            cursor: "pointer",
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
      )}
      <ProgressBar rate={progress} />
      <LottieAnim anim={"tap"} width={200} style={"center"} />
      {isPressing && (
        <LottieAnim anim={"sparkle"} width={600} style={"center"} />
      )}
    </div>
  );
}
