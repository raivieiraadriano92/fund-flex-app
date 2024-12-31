import EventEmitter from "eventemitter3";

interface Events {
  "category:selected": (categoryId: string) => void;
  "goal:selected": (goalId: string) => void;
}

export const events = new EventEmitter<Events>();
