"use client";

const ITEM_POSITION = [
  { x: 80, y: 10, padding: 36 },
  { x: 0, y: 260, padding: 40 },
  { x: 150, y: 150, padding: 40 },
  { x: 410, y: 260, padding: 40 },
  { x: 100, y: 380, padding: 36 },
];

export const containerStyle = (i: number): React.CSSProperties => {
  return {
    position: "absolute",
    top: ITEM_POSITION[i].y,
    left: ITEM_POSITION[i].x,
    width: 300,
    height: 120,
    backgroundImage: `url(./images/ui_fukidashi1.png)`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  };
};

export const innerStyle = (i: number): React.CSSProperties => {
  return {
    width: 300,
    height: 90,
    padding: `0 ${ITEM_POSITION[i].padding}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 80,
    color: "#000",
    fontSize: 16,
    textAlign: "center",
  };
};
