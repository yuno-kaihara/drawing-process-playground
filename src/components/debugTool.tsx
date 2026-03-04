"use client";

import { useState } from "react";
import { useScene } from "@/contexts/SceneContext";

export default function DebugTool() {
  const { currentIndex, debugJump } = useScene();
  const [inputIndexValue, setIndexInputValue] = useState("");

  return (
    <div>
      <div>Current Index: {currentIndex}</div>
      <input
        type="number"
        onChange={(e) => setIndexInputValue(e.target.value)}
      ></input>
      <button onClick={() => debugJump(Number(inputIndexValue))}>遷移</button>
    </div>
  );
}
