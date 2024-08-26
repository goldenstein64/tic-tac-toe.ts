import type Board from "./Board";
import type { Mark } from "./Mark";

interface MSG_Board {
  id: "app/msg/board";
  board: Board;
}

interface MSG_PlayerWon {
  id: "app/msg/playerWon";
  mark: Mark;
}

interface MSG_Tied {
  id: "app/msg/tied";
}

interface MSG_PromptPlayer {
  id: "app/msg/promptPlayer";
  mark: Mark;
}

interface MSG_PromptComputer {
  id: "app/msg/promptComputer";
  mark: Mark;
}

interface ERR_PlayerInvalid {
  id: "app/err/playerInvalid";
  input: string;
}

interface ERR_ComputerInvalid {
  id: "app/err/computerInvalid";
  input: string;
}
interface MSG_PromptMove {
  id: "human/msg/promptMove";
  mark: Mark;
}
interface ERR_NaN {
  id: "human/err/nan";
  input: string;
}
interface ERR_OutOfRange {
  id: "human/err/outOfRange";
  choice: number;
}
interface ERR_Occupied {
  id: "human/err/occupied";
  choice: number;
}

export type Message =
  | MSG_Board
  | MSG_PlayerWon
  | MSG_Tied
  | MSG_PromptPlayer
  | MSG_PromptComputer
  | ERR_PlayerInvalid
  | ERR_ComputerInvalid
  | MSG_PromptMove
  | ERR_NaN
  | ERR_OutOfRange
  | ERR_Occupied;

export interface Connection {
  print(msg: Message, ...args: any[]): Promise<void>;
  prompt(msg: Message, ...args: any[]): Promise<string>;
}
