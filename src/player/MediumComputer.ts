import { randomInt } from "crypto";
import { type Player } from "../Application";
import { BOARD_SIZE, WIN_PATTERNS, type Board } from "../data/Board";
import { type Mark, marks } from "../data/Mark";
import { range } from "../util/utils";

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

function filterCanMark(board: Board, moves: number[]): number[] {
  return moves.filter((i) => board.canMark(i));
}

function nonEmptyOrUndefined<T, A extends any[]>(
  target: (this: T, ...args: A) => number[] | undefined,
  context: ClassMethodDecoratorContext
): (this: T, ...args: A) => number[] | undefined {
  return function (this: T, ...args: A): number[] | undefined {
    let result = target.call(this, ...args);
    return result && result.length > 0 ? result : undefined;
  };
}

export class MediumComputer implements Player {
  @nonEmptyOrUndefined
  getWinningMoves(board: Board, mark: Mark): number[] | undefined {
    return range(9).filter((i) => {
      if (!board.canMark(i)) return false;

      return WIN_PATTERN_LOOKUP[i]
        .map((pi) => WIN_PATTERNS[pi].filter((j) => j != i))
        .some((pattern) => pattern.every((i) => board.isMarkedWith(i, mark)));
    });
  }

  getBlockingMoves(board: Board, mark: Mark): number[] | undefined {
    return this.getWinningMoves(board, marks.other(mark));
  }

  @nonEmptyOrUndefined
  getTrappingMoves(board: Board, mark: Mark): number[] | undefined {
    return range(9).filter((i) => {
      if (!board.canMark(i)) return false;

      let trappingPatterns = WIN_PATTERN_LOOKUP[i]
        .map((pi) => WIN_PATTERNS[pi].filter((j) => j != i))
        .filter(
          (pattern) =>
            pattern.some((i) => board.canMark(i)) &&
            pattern.some((i) => board.isMarkedWith(i, mark))
        );

      return trappingPatterns.length > 1;
    });
  }

  @nonEmptyOrUndefined
  getCenterMoves(board: Board, _: Mark): number[] | undefined {
    return CENTER_MOVES.filter((i) => board.canMark(i));
  }

  @nonEmptyOrUndefined
  getCornerMoves(board: Board, _: Mark): number[] | undefined {
    return CORNER_MOVES.filter((i) => board.canMark(i));
  }

  @nonEmptyOrUndefined
  getSideMoves(board: Board, _: Mark): number[] | undefined {
    return SIDE_MOVES.filter((i) => board.canMark(i));
  }

  getMoves(board: Board, mark: Mark): number[] {
    let moves =
      this.getWinningMoves(board, mark) ??
      this.getBlockingMoves(board, mark) ??
      this.getTrappingMoves(board, mark) ??
      this.getCenterMoves(board, mark) ??
      this.getCornerMoves(board, mark) ??
      this.getSideMoves(board, mark);

    if (moves === undefined) {
      throw new TypeError("board is full!");
    }

    return moves;
  }

  async getMove(board: Board, mark: Mark): Promise<number> {
    let moves = this.getMoves(board, mark);
    return moves[randomInt(moves.length)];
  }
}
