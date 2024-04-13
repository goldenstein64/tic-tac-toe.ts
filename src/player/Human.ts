import type { Player } from "../Application";
import { type Board } from "../data/Board";
import { type Mark } from "../data/Mark";
import { type Connection } from "../messages/Messages";

export class Human implements Player {
  #connection: Connection;

  constructor(connection: Connection) {
    this.#connection = connection;
  }

  async getMoveOnce(board: Board, mark: Mark): Promise<number | undefined> {
    let choiceString = await this.#connection.prompt(
      "human/msg/promptMove",
      mark
    );

    let choice: number | undefined = undefined;
    try {
      choice = Number.parseInt(choiceString);
    } catch (e) {
      this.#connection.print("human/err/nan", choiceString);
      return undefined;
    }

    if (choice < 1 || choice > 9) {
      this.#connection.print("human/err/outOfRange", choice);
      return undefined;
    }

    let pos = choice - 1;

    if (!board.canMark(pos)) {
      this.#connection.print("human/err/occupied", choice);
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
