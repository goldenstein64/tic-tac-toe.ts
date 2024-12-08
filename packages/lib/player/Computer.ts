import type { Player } from ".";
import type { Board, Mark } from "../data";

import { randomInt } from "node:crypto";

export default abstract class Computer implements Player {
  abstract getMoves(board: Board, mark: Mark): Promise<number[]>;

  async getMove(board: Board, mark: Mark): Promise<number> {
    let choices = await this.getMoves(board, mark);
    return choices[randomInt(choices.length)];
  }
}
