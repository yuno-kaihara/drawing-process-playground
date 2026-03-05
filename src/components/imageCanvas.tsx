"use client";

import { useScene } from "@/contexts/SceneContext";
import { CanvasContext } from "@/contexts/CanvasContext";
import ActionOverlay from "@/components/actionOverlay";

// 元画像サイズ 1024px x 724px
const IMAGE_WIDTH = 720;
const IMAGE_HEIGHT = 508;
const BORDER_WIDTH = 4;
const INNER_WIDTH = IMAGE_WIDTH - BORDER_WIDTH * 2;
const INNER_HEIGHT = IMAGE_HEIGHT - BORDER_WIDTH * 2;

export default function ImageCanvas() {
  const { currentScene } = useScene();

  return (
    <div
      style={{
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        backgroundImage: `url(./images/${currentScene.image}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: `${BORDER_WIDTH}px solid black`,
        position: "relative",
      }}
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: INNER_WIDTH,
          height: INNER_HEIGHT,
        }}
      >
        <CanvasContext.Provider
          value={{ width: INNER_WIDTH, height: INNER_HEIGHT }}
        >
          <ActionOverlay />
        </CanvasContext.Provider>
      </div>
    </div>
  );
}
