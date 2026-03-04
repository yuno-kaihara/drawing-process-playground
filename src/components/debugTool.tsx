"use client";

import { useState } from "react";
import { useScene } from "@/contexts/SceneContext";

export default function DebugTool() {
  const { currentIndex, debugJump } = useScene();
  const [inputIndexValue, setIndexInputValue] = useState("");

  return (
    <div style={{ backgroundColor: "yellow" }}>
      <div>=== DEBUG TOOLS ===</div>
      <div>Current Index: {currentIndex}</div>
      <input
        type="number"
        onChange={(e) => setIndexInputValue(e.target.value)}
        style={{ border: "1px solid" }}
      ></input>
      <button
        onClick={() => debugJump(Number(inputIndexValue))}
        style={{ border: "1px solid" }}
      >
        遷移
      </button>
    </div>
  );
}
