"use client";

import { useMaster } from "@/contexts/MasterContext";

export default function MindMap() {
  const { ideaList } = useMaster();

  return (
    <div>
      {ideaList.map((idea, i) => (
        <div key={i}>{idea.text}</div>
      ))}
    </div>
  );
}
