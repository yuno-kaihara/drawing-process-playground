import DebugTool from "@/components/debugTool";
import Dialog from "@/components/dialog";
import ActionOverlay from "@/components/actionOverlay";

export default function Main() {
  return (
    <div>
      <ActionOverlay />
      <Dialog />
      {process.env.NODE_ENV === "development" ? <DebugTool /> : null}
    </div>
  );
}
