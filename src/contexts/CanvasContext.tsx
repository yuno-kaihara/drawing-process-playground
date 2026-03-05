"use client";

import { createContext, useContext } from "react";

type CanvasContext = {
  width: number;
  height: number;
};

export const CanvasContext = createContext<CanvasContext | null>(null);

export function useCanvasSize() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasSize must be used within CanvasContext.");
  }
  return context;
}
