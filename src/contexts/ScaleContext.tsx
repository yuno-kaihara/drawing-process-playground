"use client";

import { createContext, useContext } from "react";

export const ScaleContext = createContext(1);

export function useScale() {
  const context = useContext(ScaleContext);
  if (!context) {
    throw new Error("useScale must be used within ScaleContext.");
  }
  return context;
}
