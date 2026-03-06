import { ActionName } from "@/types/action";

export type Scene = {
  text: string;
  actionName: ActionName;
  time: number;
  image: string;
  imageEffect: string;
};

export type Idea = {
  text: string;
};
