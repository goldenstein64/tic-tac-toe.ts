import type Board from "../data/Board";
import type { Mark } from "../data/Mark";

export interface Player {
  getMove(board: Board, mark: Mark): Promise<number>;
}

export { default as Human } from "./Human";
export { default as EasyComputer } from "./EasyComputer";
export { default as MediumComputer } from "./MediumComputer";
export { default as HardComputer } from "./HardComputer";
