import type { Player } from "../Application";
import type { Board } from "../data/Board";
import type { Mark } from "../data/Mark";

import { randomInt } from "crypto";

import { range } from "../util/utils";
import { WIN_PATTERNS } from "../data/Board";
import { marks } from "../data/Mark";

const WIN_PATTERN_LOOKUP: readonly number[][] = Object.freeze(
  range(9).map((i) =>
    WIN_PATTERNS.map<[readonly number[], number]>((p, j) => [p, j])
      .filter(([pattern, _]) => pattern.includes(i))
      .map(([_, j]) => j)
  )
);

const CENTER_MOVES = [4];
const CORNER_MOVES = [0, 2, 6, 8];
const SIDE_MOVES = [1, 3, 5, 7];

function nonEmptyOrUndefined<T>(result: T[]): T[] | undefined {
  return result.length > 0 ? result : undefined;
}

export class MediumComputer implements Player {
  getWinningMoves(board: Board, mark: Mark): number[] | undefined {
    return nonEmptyOrUndefined(
      range(9).filter((i) => {
        if (!board.canMark(i)) return false;
        return WIN_PATTERN_LOOKUP[i]
          .map((pi) => WIN_PATTERNS[pi].filter((j) => j != i))
          .some((pattern) => pattern.every((i) => board.isMarkedWith(i, mark)));
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
              pattern.some((i) => board.canMark(i)) &&
              pattern.some((i) => board.isMarkedWith(i, mark))
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

  getMoves(board: Board, mark: Mark): number[] {
    const moves =
      this.getWinningMoves(board, mark) ??
      this.getBlockingMoves(board, mark) ??
      this.getTrappingMoves(board, mark) ??
      this.getCenterMoves(board) ??
      this.getCornerMoves(board) ??
      this.getSideMoves(board);

    if (!moves) {
      throw new TypeError("board is full!");
    }

    return moves;
  }

  async getMove(board: Board, mark: Mark): Promise<number> {
    let moves = this.getMoves(board, mark);
    return moves[randomInt(moves.length)];
  }
}
