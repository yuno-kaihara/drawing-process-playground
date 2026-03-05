"use client";

import { useScene } from "@/contexts/SceneContext";
import MindMap from "@/components/mindMap";
import IdeaCheckList from "@/components/ideaCheckList";
import LineDrawing from "@/components/lineDrawing";
import FillAndErase from "@/components/fillAndErase";

export default function ActionOverlay() {
  const { currentScene } = useScene();

  switch (currentScene.actionName) {
    case "mind_map":
      return <MindMap />;
    case "idea_check":
      return <IdeaCheckList />;
    case "line_drawing":
      return <LineDrawing />;
    case "fill":
      return <FillAndErase mode={"fill"} />;
    case "erase":
      return <FillAndErase mode={"erase"} />;
    default:
      return null;
  }
}
