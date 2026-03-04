"use client";

import { useScene } from "@/contexts/SceneContext";
import MindMap from "@/components/mindMap";

export default function ActionOverlay() {
  const { currentScene } = useScene();

  switch (currentScene.actionName) {
    case "mind_map":
      return <MindMap />;
    default:
      return null;
  }
}
