import type { Player } from "../Application";
import { type Board } from "../data/Board";
import { type Mark } from "../data/Mark";
import { Message, type Connection } from "../messages/Messages";

export default class Human implements Player {
  #connection: Connection;

  constructor(connection: Connection) {
    this.#connection = connection;
  }

  async getMoveOnce(board: Board, mark: Mark): Promise<number | undefined> {
    let choiceString = await this.#connection.prompt(
      Message.MSG_PROMPT_MOVE,
      mark
    );

    let choice: number | undefined = undefined;
    try {
      choice = Number.parseInt(choiceString);
    } catch (e) {
      this.#connection.print(Message.ERR_NAN, choiceString);
      return undefined;
    }

    if (choice < 1 || choice > 9) {
      this.#connection.print(Message.ERR_OUT_OF_RANGE, choice);
      return undefined;
    }

    let pos = choice - 1;

    if (!board.canMark(pos)) {
      this.#connection.print(Message.ERR_OCCUPIED, choice);
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
