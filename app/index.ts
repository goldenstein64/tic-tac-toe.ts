import type { Mark, Message } from "../lib";

import "./extensions";
import Application, { Board } from "../lib";
import ConsoleConnection from "./ConsoleConnection";

function assertNever(arg: never): never {
  throw new TypeError(`bad message id '${(arg as any).id}'!`);
}

export function displayBoard(data: (Mark | undefined)[]) {
  return data
    .values()
    .map((mark, i) => mark ?? (i + 1).toString())
    .chunk(3)
    .map((marks) => ` ${marks.join(" | ")}`)
    .intersperse("---|---|---")
    .toArray()
    .join("\n");
}

const connection = new ConsoleConnection((msg: Message): string => {
  switch (msg.id) {
    case "app/msg/promptPlayer":
      return `Is Player ${msg.mark} a player or computer? [H/C]:`;
    case "app/msg/promptComputer":
      return `What is Computer ${msg.mark}'s difficulty? [E/M/H]:`;
    case "app/msg/board":
      return `${displayBoard(msg.board.data)}\n`;
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
});

const app = new Application(connection);

const players = await app.choosePlayers();
const winner = await app.playGame(players);
await app.displayWinner(winner);
