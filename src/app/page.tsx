import DebugTool from "@/components/debugTool";
import Dialog from "@/components/dialog";
import SceneProgress from "@/components/sceneProgress";
import ImageCanvas from "@/components/imageCanvas";

export default function Main() {
  return (
    <div style={{ margin: 12 }}>
      <ImageCanvas />
      <SceneProgress />
      <Dialog />
      {process.env.NODE_ENV === "development" ? <DebugTool /> : null}
    </div>
  );
}
