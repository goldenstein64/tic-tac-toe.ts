import type { Player } from ".";
import type Board from "../data/Board";
import type { Mark } from "../data/Mark";
import type { Connection } from "../data/Messages";

function truncate(s: string, maxLength: number): string {
  return s.length > maxLength ? `${s.substring(0, 10)}...` : s;
}

export default class Human implements Player {
  #connection: Connection;

  constructor(connection: Connection) {
    this.#connection = connection;
  }

  async getMoveOnce(board: Board, mark: Mark): Promise<number | undefined> {
    let choiceString = await this.#connection.prompt({
      id: "human/msg/promptMove",
      mark,
    });

    let choice: number | undefined = undefined;
    try {
      choice = Number.parseInt(choiceString);
    } catch (e) {
      this.#connection.print({
        id: "human/err/nan",
        input: truncate(choiceString, 10),
      });
      return undefined;
    }

    if (Number.isNaN(choice) || !Number.isFinite(choice)) {
      await this.#connection.print({
        id: "human/err/nan",
        input: truncate(choiceString, 10),
      });
      return undefined;
    }

    if (choice < 1 || choice > 9) {
      await this.#connection.print({ id: "human/err/outOfRange", choice });
      return undefined;
    }

    let pos = choice - 1;

    if (!board.canMark(pos)) {
      await this.#connection.print({ id: "human/err/occupied", choice });
      return undefined;
    }

    return pos;
  }

  async getMove(board: Board, mark: Mark): Promise<number> {
    let move: number | undefined = undefined;
    do {
      move = await this.getMoveOnce(board, mark);
    } while (move === undefined);

    return move;
  }
}
