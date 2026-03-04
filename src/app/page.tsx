import DebugTool from "@/components/debugTool";
import Dialog from "@/components/dialog";

export default function Main() {
  return (
    <div>
      <Dialog />
      {process.env.NODE_ENV === "development" ? <DebugTool /> : null}
    </div>
  );
}
