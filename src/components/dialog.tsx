"use client";

import { useScene } from "@/contexts/SceneContext";

export default function Dialog() {
  const { currentScene, goToNext } = useScene();

  return (
    <div>
      <div>{currentScene.text}</div>
      <button onClick={goToNext}>次へ</button>
    </div>
  );
}
