"use client";

import { ScaleContext } from "@/contexts/ScaleContext";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

// NOTE: 見た目に合わせて設定する
const CONTENT_WIDTH = 744;
const CONTENT_HEIGHT = 840;

export function ScaleWrapper({ children }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    el.style.transform = "none";

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let scale = Math.min(
      viewportWidth / CONTENT_WIDTH,
      viewportHeight / CONTENT_HEIGHT,
    );
    if (scale > 1) scale = 1;

    el.style.transformOrigin = "top left";
    el.style.transform = `scale(${scale})`;

    const scaledWidth = CONTENT_WIDTH * scale;
    const scaledHeight = CONTENT_HEIGHT * scale;

    el.style.position = "absolute";
    el.style.left = `${(viewportWidth - scaledWidth) / 2}px`;
    el.style.top = `${(viewportHeight - scaledHeight) / 2}px`;

    requestAnimationFrame(() => {
      setScale(scale);
      el.style.visibility = "visible";
    });
  }, []);

  return (
    <ScaleContext.Provider value={scale}>
      <div ref={wrapperRef}>{children}</div>
    </ScaleContext.Provider>
  );
}
