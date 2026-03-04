"use client";

import { useEffect, useState, useRef } from "react";
import { useMaster } from "@/contexts/MasterContext";
import { useScene } from "@/contexts/SceneContext";

const INTERVAL_MS = 500;

export default function IdeaCheckList() {
  const { ideaList } = useMaster();
  const { goToNext } = useScene();

  const [activeCount, setActiveCount] = useState(0);

  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();

    timerRef.current = window.setInterval(() => {
      setActiveCount((i) => Math.min(i + 1, ideaList.length));
    }, INTERVAL_MS);

    return clearTimer;
  }, [ideaList.length]);

  useEffect(() => {
    if (activeCount >= ideaList.length) {
      clearTimer();
      setTimeout(goToNext, 1000);
    }
  }, [activeCount, ideaList.length, goToNext]);

  return (
    <div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: 10,
        }}
      >
        {ideaList.map((idea, i) => {
          const isChecked = i < activeCount;

          return (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.35)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isChecked ? "rgba(0,0,0,0.08)" : "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    lineHeight: 1,
                    opacity: isChecked ? 1 : 0,
                    transform: isChecked ? "scale(1)" : "scale(0.6)",
                    transition: "opacity 180ms ease, transform 180ms ease",
                  }}
                >
                  ✓
                </span>
              </span>

              <span
                style={{
                  opacity: isChecked ? 1 : 0.65,
                  transition: "opacity 180ms ease",
                }}
              >
                {idea.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
