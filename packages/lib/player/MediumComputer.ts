import type Board from "../data/Board";
import type { Mark } from "../data/Mark";

import { range } from "../util";
import { WIN_PATTERNS } from "../data/Board";
import { marks } from "../data/Mark";
import Computer from "./Computer";

const WIN_PATTERN_LOOKUP: readonly number[][] = Object.freeze(
  range(9).map((i) =>
    WIN_PATTERNS.flatMap((pattern, j) => (pattern.includes(i) ? [j] : []))
  )
);

const CENTER_MOVES = [4];
const CORNER_MOVES = [0, 2, 6, 8];
const SIDE_MOVES = [1, 3, 5, 7];

function nonEmptyOrUndefined<T>(result: T[]): T[] | undefined {
  return result.length > 0 ? result : undefined;
}

export default class MediumComputer extends Computer {
  getWinningMoves(board: Board, mark: Mark): number[] | undefined {
    return nonEmptyOrUndefined(
      range(9).filter((i) => {
        if (!board.canMark(i)) return false;
        return WIN_PATTERN_LOOKUP[i]
          .values()
          .map((pi) => WIN_PATTERNS[pi].values().filter((j) => j != i))
          .some((pattern) => pattern.every((j) => board.isMarkedWith(j, mark)));
      })
    );
  }

  getBlockingMoves(board: Board, mark: Mark): number[] | undefined {
    return this.getWinningMoves(board, marks.other(mark));
  }

  getTrappingMoves(board: Board, mark: Mark): number[] | undefined {
    return nonEmptyOrUndefined(
      range(9).filter((i) => {
        if (!board.canMark(i)) return false;

        let trappingPatterns = WIN_PATTERN_LOOKUP[i]
          .map((pi) => WIN_PATTERNS[pi].filter((j) => j != i))
          .filter(
            (pattern) =>
              pattern.some((j) => board.canMark(j)) &&
              pattern.some((j) => board.isMarkedWith(j, mark))
          );

        return trappingPatterns.length > 1;
      })
    );
  }

  getCenterMoves(board: Board): number[] | undefined {
    return nonEmptyOrUndefined(CENTER_MOVES.filter((i) => board.canMark(i)));
  }

  getCornerMoves(board: Board): number[] | undefined {
    return nonEmptyOrUndefined(CORNER_MOVES.filter((i) => board.canMark(i)));
  }

  getSideMoves(board: Board): number[] | undefined {
    return nonEmptyOrUndefined(SIDE_MOVES.filter((i) => board.canMark(i)));
  }

  async getMoves(board: Board, mark: Mark): Promise<number[]> {
    const moves =
      this.getWinningMoves(board, mark) ??
      this.getBlockingMoves(board, mark) ??
      this.getTrappingMoves(board, mark) ??
      this.getCenterMoves(board) ??
      this.getCornerMoves(board) ??
      this.getSideMoves(board);

    if (!moves) throw new TypeError("board is full!");

    return moves;
  }
}
