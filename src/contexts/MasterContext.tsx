"use client";

import { createContext, useContext } from "react";
import { Scene, Idea } from "@/types/master";

type MasterContextType = {
  scenes: Scene[];
  ideaList: Idea[];
};

const MasterContext = createContext<MasterContextType | null>(null);

export function MasterProvider({
  scenes,
  ideaList,
  children,
}: {
  scenes: Scene[];
  ideaList: Idea[];
  children: React.ReactNode;
}) {
  return (
    <MasterContext.Provider value={{ scenes, ideaList }}>
      {children}
    </MasterContext.Provider>
  );
}

export function useMaster() {
  const context = useContext(MasterContext);
  if (!context) {
    throw new Error("useMaster must be used within MasterProvider.");
  }
  return context;
}
