"use client";

import { useScene } from "@/contexts/SceneContext";
import MindMap from "@/components/mindMap";
import IdeaCheckList from "@/components/ideaCheckList";
import LineDrawing from "./lineDrawing";

export default function ActionOverlay() {
  const { currentScene } = useScene();

  switch (currentScene.actionName) {
    case "mind_map":
      return <MindMap />;
    case "idea_check":
      return <IdeaCheckList />;
    case "line_drawing":
      return <LineDrawing />;
    default:
      return null;
  }
}
