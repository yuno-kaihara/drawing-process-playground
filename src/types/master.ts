import { ActionName } from "@/types/action";

export type Scene = {
  text: string;
  actionName: ActionName;
  time: number;
};

export type Idea = {
  text: string;
};
