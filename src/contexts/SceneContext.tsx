"use client";

import { createContext, useContext, useState } from "react";
import { Scene } from "@/types/master";

type SceneContextType = {
  currentIndex: number;
  currentScene: Scene;
  goToNext: () => void;
  restart: () => void;
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

  return (
    <SceneContext.Provider
      value={{ currentIndex, currentScene, goToNext, restart }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error("no context");
  }
  return context;
}
