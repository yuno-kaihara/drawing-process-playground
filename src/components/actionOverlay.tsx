"use client";

import { useScene } from "@/contexts/SceneContext";
import MindMap from "@/components/mindMap";
import IdeaCheckList from "@/components/ideaCheckList";
import LineDrawing from "@/components/lineDrawing";
import FillAndErase from "@/components/fillAndErase";
import DragLight from "@/components/dragLight";
import Scratch from "@/components/scratch";
import BubbleTap from "@/components/bubbleTap";
import EffectMagic from "@/components/effectMagic";

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
    case "drag_light":
      return <DragLight />;
    case "scratch1":
      return (
        <Scratch maskImage={"/images/image8.png"} complete_threshold={0.6} />
      );
    case "scratch2":
      return (
        <Scratch maskImage={"/images/image9.png"} complete_threshold={0.75} />
      );
    case "bubble_tap":
      return <BubbleTap />;
    case "effect_magic":
      return <EffectMagic maskImage={"/images/image13.png"} />;
    default:
      return null;
  }
}
