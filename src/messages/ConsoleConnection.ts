import readline from "node:readline/promises";
import process from "node:process";

import { Message, Connection } from "./Messages";
import { marks, type Mark } from "../data/Mark";
import { type Board } from "../data/Board";

const input = readline.createInterface(process.stdin, process.stdout);

type MessageFormatter = (...args: any[]) => string;

export const FORMAT_STRINGS: Map<Message, MessageFormatter> = new Map<
  Message,
  MessageFormatter
>()
  .set("app/msg/board", (board: Board) => `${board}`)
  .set(
    "app/msg/playerWon",
    (mark: Mark) => `Player ${marks.toString(mark)} won!`
  )
  .set("app/msg/tied", () => `There was a tie!`)
  .set(
    "app/msg/promptPlayer",
    (mark: Mark) =>
      `Is Player ${marks.toString(mark)} a human or computer? [H/C]: `
  )
  .set(
    "app/msg/promptComputer",
    (mark: Mark) =>
      `What is Computer ${marks.toString(mark)}'s difficulty? [E/M/H]: `
  )
  .set(
    "app/err/playerInvalid",
    (input: string) => `'${input}' does not match [H/C]!`
  )
  .set(
    "app/err/computerInvalid",
    (input: string) => `'${input}' does not match [E/M/H]!`
  )
  .set(
    "human/msg/promptMove",
    (mark: Mark) => `Pick a move, Player ${marks.toString(mark)} [1-9]: `
  )
  .set("human/err/nan", (input: string) => `'${input}' is not a number!`)
  .set(
    "human/err/outOfRange",
    (input: string) => `'${input}' is not in the range of 1-9!`
  )
  .set(
    "human/err/occupied",
    (input: string) => `The position ${input} is occupied!`
  );

export class ConsoleConnection implements Connection {
  #format(msg: Message, ...args: any[]): string {
    let formatString = FORMAT_STRINGS.get(msg);
    if (formatString === undefined) throw new TypeError("unknown message");

    return formatString(...args);
  }

  async print(msg: Message, ...args: any[]): Promise<void> {
    console.log(this.#format(msg, ...args));
  }

  async prompt(msg: Message, ...args: any[]): Promise<string> {
    return input.question(this.#format(msg, ...args));
  }
}
