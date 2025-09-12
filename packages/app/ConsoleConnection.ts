import type { Mark, Message, Connection } from "@goldenstein64/tic-tac-toe";

import { marks } from "@goldenstein64/tic-tac-toe";

export class EOFError extends Error {
  constructor(message: string = "EOF encountered!", options?: ErrorOptions) {
    super(message, options);

    this.name = "EOFError";
  }
}

function assertNever(arg: never): never {
  throw new TypeError(`bad message id '${(arg as any).id}'!`);
}

function* chars(s: string): Generator<string, void, void> {
  yield* s;
}

export function displayBoard(data: string) {
  return chars(data)
    .map((mark, i) => (marks.all.includes(mark) ? mark : (i + 1).toString()))
    .chunk(3)
    .map((marks) => ` ${marks.join(" | ")}`)
    .intersperse("---|---|---")
    .toArray()
    .join("\n");
}

export function formatConsole(msg: Message): string {
  switch (msg.id) {
    case "app/msg/promptPlayer":
      return `Is Player ${msg.mark} a player or computer? [H/C]:`;
    case "app/msg/promptComputer":
      return `What is Computer ${msg.mark}'s difficulty? [E/M/H]:`;
    case "app/msg/board":
      return `${displayBoard(msg.board)}\n`;
    case "app/msg/playerWon":
      return `Player ${msg.mark} won!`;
    case "app/msg/tied":
      return "There was a tie!";
    case "app/err/computerInvalid":
      return `'${msg.input}' does not match 'E', 'M' or 'H'!`;
    case "app/err/playerInvalid":
      return `'${msg.input}' does not match 'H' or 'C'!`;
    case "human/msg/promptMove":
      return `Pick a move, Player ${msg.mark}. [1-9]:`;
    case "human/err/nan":
      return `'${msg.input}' is not a valid number!`;
    case "human/err/occupied":
      return `Slot ${msg.choice} is occupied!`;
    case "human/err/outOfRange":
      return `Slot ${msg.choice} is out of range!`;
    default:
      assertNever(msg);
  }
}

export default class ConsoleConnection implements Connection {
  constructor(readonly format: (message: Message) => string = formatConsole) {}

  async prompt(message: Message): Promise<string> {
    const input = prompt(this.format(message));
    if (!input) throw new EOFError();
    return input;
  }

  async print(message: Message): Promise<void> {
    console.write(this.format(message), "\n");
  }
}
