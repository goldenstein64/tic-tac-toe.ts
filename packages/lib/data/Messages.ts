import type Board from "./Board";
import type { Mark } from "./Mark";

export type Message =
  | { id: "app/msg/board"; board: string }
  | { id: "app/msg/playerWon"; mark: Mark }
  | { id: "app/msg/tied" }
  | { id: "app/msg/promptPlayer"; mark: Mark }
  | { id: "app/msg/promptComputer"; mark: Mark }
  | { id: "app/err/playerInvalid"; input: string }
  | { id: "app/err/computerInvalid"; input: string }
  | { id: "human/msg/promptMove"; mark: Mark }
  | { id: "human/err/nan"; input: string }
  | { id: "human/err/outOfRange"; choice: number }
  | { id: "human/err/occupied"; choice: number };

export interface Connection {
  print(msg: Message): Promise<void>;
  prompt(msg: Message): Promise<string>;
}
