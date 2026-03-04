import DebugTool from "@/components/debugTool";
import Dialog from "@/components/dialog";
import MindMap from "@/components/mindMap";

export default function Main() {
  return (
    <div>
      <MindMap />
      <Dialog />
      {process.env.NODE_ENV === "development" ? <DebugTool /> : null}
    </div>
  );
}
