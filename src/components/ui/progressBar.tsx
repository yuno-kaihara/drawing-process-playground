"use client";

type Props = {
  rate: number;
};

export default function ProgressBar({ rate }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        top: 0,
        height: 10,
        background: "#fff",
      }}
    >
      <div
        style={{
          width: `${rate * 100}%`,
          height: "100%",
          background: "#000",
          transition: "width 0.1s",
        }}
      />
    </div>
  );
}
