"use client";

import { useEffect, useRef, useState } from "react";
import { useScene } from "@/contexts/SceneContext";

const MS_PER_CHAR = 35;

export default function Dialog() {
  const { currentIndex, currentScene, goToNext } = useScene();

  const [visibleText, setVisibleText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTyping = () => {
    clearTimer();
    setVisibleText("");
    setIsTyping(true);
  };

  const skipTyping = () => {
    clearTimer();
    setVisibleText(currentScene.text);
    setIsTyping(false);
  };

  // タイピング処理
  useEffect(() => {
    if (!isTyping) return;

    // すでに全文まで到達していたら完了にする
    if (visibleText.length >= currentScene.text.length) {
      setIsTyping(false);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      const nextCharIndex = visibleText.length + 1;
      setVisibleText(currentScene.text.slice(0, nextCharIndex));
    }, MS_PER_CHAR);

    return () => clearTimer();
  }, [isTyping, visibleText, currentScene.text]);

  // 初期開始
  useEffect(() => {
    startTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isTyping) {
      skipTyping();
    } else {
      goToNext();
    }
  };

  if (!currentScene.text) return null;

  return (
    <div
      onClick={onClick}
      style={{
        width: "500px",
        position: "relative",
        background: "rgba(0,0,0,0.65)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 14,
        padding: "18px 18px 28px 18px",
        minHeight: 120,
        color: "#fff",
        lineHeight: 1.75,
        fontSize: 18,
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none", // スマホ対策
        cursor: "pointer",
      }}
    >
      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {visibleText}
      </div>

      {/* ▼インジケータ */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 14,
          bottom: 10,
          fontSize: 16,
          opacity: isTyping ? 0 : 1,
          transition: "opacity 120ms ease",
          pointerEvents: "none",
          animation: isTyping
            ? "none"
            : "novel-bounce 0.9s ease-in-out infinite",
        }}
      >
        ▼
      </div>

      <style jsx>{`
        @keyframes novel-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
        }
      `}</style>
    </div>
  );
}
