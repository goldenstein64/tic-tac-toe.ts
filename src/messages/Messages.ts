export type Message =
  | "app/msg/board"
  | "app/msg/playerWon"
  | "app/msg/tied"
  | "app/msg/promptPlayer"
  | "app/msg/promptComputer"
  | "app/err/playerInvalid"
  | "app/err/computerInvalid"
  | "human/msg/promptMove"
  | "human/err/nan"
  | "human/err/outOfRange"
  | "human/err/occupied";

export interface Connection {
  print(msg: Message, ...args: any[]): Promise<void>;
  prompt(msg: Message, ...args: any[]): Promise<string>;
}
