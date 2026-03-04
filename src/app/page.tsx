import { fetchScenes } from "./../lib/sheets";

export default async function Home() {
  const scenes = await fetchScenes();

  return (
    <div>
      {scenes.map((scene, i) => {
        return <div key={i}>{scene.text}</div>;
      })}
    </div>
  );
}
