import Lottie from "lottie-react";

import tapAnim from "@/assets/lottie/tap.json";
import sparkleAnim from "@/assets/lottie/sparkle.json";
import movePenAnim from "@/assets/lottie/move_pen.json";
import dragAnim from "@/assets/lottie/drag.json";
import questionAnim from "@/assets/lottie/question.json";
import checkAnim from "@/assets/lottie/check.json";

type AnimKey = "tap" | "drag" | "check" | "movePen" | "sparkle" | "question";

const ANIM_MAP = {
  tap: tapAnim,
  drag: dragAnim,
  check: checkAnim,
  movePen: movePenAnim,
  sparkle: sparkleAnim,
  question: questionAnim,
};

type StyleKey = "center" | "rightBottom" | "custom";

const centerStyle: React.CSSProperties = {
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const rightBottomStyle: React.CSSProperties = {
  right: 12,
  bottom: 12,
};

const STYLE_MAP = {
  center: centerStyle,
  rightBottom: rightBottomStyle,
  custom: {},
};

type Props = {
  anim: AnimKey;
  width: number;
  style: StyleKey;
  customStyle?: React.CSSProperties;
  loop?: boolean;
  onComplete?: () => void;
};

export default function LottieAnim({
  anim,
  width,
  style,
  customStyle,
  loop = true,
  onComplete,
}: Props) {
  return (
    <Lottie
      animationData={ANIM_MAP[anim]}
      loop={loop}
      onComplete={onComplete}
      style={{
        width: width ?? 100,
        position: "absolute",
        pointerEvents: "none",
        ...STYLE_MAP[style],
        ...customStyle,
      }}
    />
  );
}
