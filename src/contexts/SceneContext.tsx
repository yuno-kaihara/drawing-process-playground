"use client";

import { createContext, useContext, useState } from "react";
import { Scene } from "@/types/master";

type SceneContextType = {
  currentIndex: number;
  currentScene: Scene;
  goToNext: () => void;
  restart: () => void;
  debugJump: (i: number) => void;
};

const SceneContext = createContext<SceneContextType | null>(null);

export function SceneProvider({
  scenes,
  children,
}: {
  scenes: Scene[];
  children: React.ReactNode;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScene = scenes[currentIndex];

  function goToNext() {
    setCurrentIndex((i) => Math.min(i + 1, scenes.length - 1));
  }

  function restart() {
    setCurrentIndex(0);
  }

  function debugJump(i: number) {
    if (process.env.NODE_ENV !== "development") {
      console.error("not development mode.");
    } else if (i >= scenes.length || i < 0) {
      console.error("index is out of range.");
    } else {
      setCurrentIndex(i);
      console.log(`index is ${i}.`);
    }
  }

  return (
    <SceneContext.Provider
      value={{ currentIndex, currentScene, goToNext, restart, debugJump }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error("useScene must be used within SceneProvider.");
  }
  return context;
}
