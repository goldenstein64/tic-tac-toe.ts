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
  .set(Message.MSG_BOARD, (board: Board) => `${board}`)
  .set(
    Message.MSG_PLAYER_WON,
    (mark: Mark) => `Player ${marks.toString(mark)} won!`
  )
  .set(Message.MSG_TIED, () => `There was a tie!`)
  .set(
    Message.MSG_PROMPT_PLAYER,
    (mark: Mark) =>
      `Is Player ${marks.toString(mark)} a human or computer? [H/C]: `
  )
  .set(
    Message.MSG_PROMPT_COMPUTER,
    (mark: Mark) =>
      `What is Computer ${marks.toString(mark)}'s difficulty? [E/M/H]: `
  )
  .set(
    Message.ERR_PLAYER_INVALID,
    (input: string) => `'${input}' does not match [H/C]!`
  )
  .set(
    Message.ERR_COMPUTER_INVALID,
    (input: string) => `'${input}' does not match [E/M/H]!`
  )
  .set(
    Message.MSG_PROMPT_MOVE,
    (mark: Mark) => `Pick a move, Player ${marks.toString(mark)} [1-9]: `
  )
  .set(Message.ERR_NAN, (input: string) => `'${input}' is not a number!`)
  .set(
    Message.ERR_OUT_OF_RANGE,
    (input: string) => `'${input}' is not in the range of 1-9!`
  )
  .set(
    Message.ERR_OCCUPIED,
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
