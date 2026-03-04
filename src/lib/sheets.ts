import { Scene, Idea } from "@/types/master";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SCENE_SHEET_GID = process.env.SCENE_SHEET_GID;
const IDEA_SHEET_GID = process.env.IDEA_SHEET_GID;
const SCENE_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${SCENE_SHEET_GID}`;
const IDEA_CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${IDEA_SHEET_GID}`;

function parseCsv(csv: string): string[][] {
  return csv
    .trim()
    .split("\n")
    .map((line) =>
      [...line.matchAll(/("([^"]*)")|([^,]+)|(?<=,)(?=,|$)/g)].map((m) =>
        (m[2] ?? m[3] ?? "").trim(),
      ),
    );
}

export async function fetchScenes(): Promise<Scene[]> {
  const res = await fetch(SCENE_CSV_URL, {
    // TODO: マスタfixしたらコメントアウト解除
    // cache: "force-cache",
  });

  if (!res.ok) throw new Error(`failed fetch: ${res.status}`);

  const csv = await res.text();
  const [_header, ...rows] = parseCsv(csv);

  // NOTE: スプシの列と順番を合わせる
  return rows.map(([text, actionName]) => ({
    text,
    actionName,
  }));
}

export async function fetchIdeaList(): Promise<Idea[]> {
  const res = await fetch(IDEA_CSV_URL, {
    // TODO: マスタfixしたらコメントアウト解除
    // cache: "force-cache",
  });

  if (!res.ok) throw new Error(`failed fetch: ${res.status}`);

  const csv = await res.text();
  const [_header, ...rows] = parseCsv(csv);

  // NOTE: スプシの列と順番を合わせる
  return rows.map(([text]) => ({
    text,
  }));
}
