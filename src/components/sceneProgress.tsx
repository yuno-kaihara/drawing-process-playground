"use client";

import { useScene } from "@/contexts/SceneContext";
import { useMaster } from "@/contexts/MasterContext";

export default function SceneProgress() {
  const { currentScene } = useScene();
  const { scenes } = useMaster();

  const maxTime = Math.max(...scenes.map((s) => s.time));
  const percent = (currentScene.time / maxTime) * 100;

  return (
    <div style={{ margin: "20px" }}>
      <div
        style={{
          width: "400px",
          padding: "8px 0",
          userSelect: "none",
        }}
      >
        {/* バー背景 */}
        <div
          style={{
            position: "relative",
            height: 12,
            background: "#e5e5e5",
            borderRadius: 6,
          }}
        >
          {/* 進捗部分 */}
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: `${percent}%`,
              background: "#000",
              borderRadius: 6,
            }}
          />
          {/* 目盛り */}
          <div
            style={{
              position: "absolute",
              left: `${percent}%`,
              bottom: 14,
              width: 48,
              height: 24,
              background: "#000",
              transform: "translateX(-50%)",
              color: "white",
              textAlign: "center",
            }}
          >
            {currentScene.time}h
          </div>
        </div>
      </div>
    </div>
  );
}
