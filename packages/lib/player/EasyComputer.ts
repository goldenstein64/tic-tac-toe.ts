import type Board from "../data/Board";
import type { Mark } from "../data/Mark";

import { range } from "../util";
import { BOARD_SIZE } from "../data/Board";
import Computer from "./Computer";

export default class EasyComputer extends Computer {
  async getMoves(board: Board, mark: Mark): Promise<number[]> {
    return range(BOARD_SIZE).filter((i) => board.canMark(i));
  }
}
