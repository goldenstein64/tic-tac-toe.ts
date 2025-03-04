import type { Mark } from "../data/Mark";

import { range } from "../util";
import Board, { BOARD_SIZE } from "../data/Board";
import { marks } from "../data/Mark";
import Computer from "./Computer";

const EQUALITIES: [number, number][] = [
  [0, 2], // 0
  [3, 5], // 1
  [6, 8], // 2
  [0, 6], // 3
  [1, 7], // 4
  [2, 8], // 5
  [0, 8], // 6
  [2, 6], // 7
  [1, 3], // 8
  [3, 7], // 9
  [5, 7], // 10
  [1, 5], // 11
];

type Symmetry = { equalities: number[]; image: number[] };

const SYMMETRIES: Symmetry[] = [
  {
    // rotate 90
    equalities: [0, 2, 3, 8, 9, 10],
    image: [0, 1, 4],
  },
  {
    // rotate 180
    equalities: [1, 4, 6, 7],
    image: [0, 1, 2, 3, 4],
  },
  {
    // flip h
    equalities: [0, 1, 2],
    image: [0, 1, 3, 4, 6, 7],
  },
  {
    // flip v
    equalities: [3, 4, 5],
    image: [0, 1, 2, 3, 4, 5],
  },
  {
    // diagonal down
    equalities: [6, 9, 11],
    image: [0, 1, 2, 3, 4, 6],
  },
  {
    // diagonal up
    equalities: [7, 8, 10],
    image: [0, 1, 2, 4, 5, 8],
  },
];

/** returns an array of indexes where the predicate is true */
function filterIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => any
): number[] {
  const result: number[] = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      result.push(i);
    }
  }
  return result;
}

const CONTROLS = new Map<Mark, number>().set("X", -1).set("O", 1);

const RECONCILERS = new Map<Mark, (a: number, b: number) => number>()
  .set("X", function max(a, b) {
    return Math.max(a, b);
  })
  .set("O", function min(a, b) {
    return Math.min(a, b);
  });

/** @returns a number if it is a terminal, otherwise `undefined` */
export function getTerminal(board: Board): number | undefined {
  if (board.won("X")) {
    return 1;
  } else if (board.won("O")) {
    return -1;
  } else if (board.full()) {
    return 0;
  } else {
    return undefined;
  }
}

function symmetryMatches(
  equalities: number[],
  symmetrySet: Set<number>
): boolean {
  return equalities.every((i) => symmetrySet.has(i));
}

function getSymmetrySet({ data }: Board): Set<number> {
  return new Set(filterIndex(EQUALITIES, ([a, b]) => data[a] === data[b]));
}

function symmetricActions(board: Board): number[] | undefined {
  const symmetrySet = getSymmetrySet(board);
  for (const { equalities, image } of SYMMETRIES) {
    if (symmetryMatches(equalities, symmetrySet)) {
      return image.filter((i) => board.canMark(i));
    }
  }

  return undefined;
}

function simpleActions(board: Board): number[] {
  return range(BOARD_SIZE).filter((i) => board.canMark(i));
}

function actions(board: Board): number[] {
  return symmetricActions(board) ?? simpleActions(board);
}

export function resultOf(board: Board, mark: Mark, move: number): Board {
  const result = board.clone();
  result.setMark(move, mark);
  return result;
}

function judge(board: Board, mark: Mark): number {
  const terminal = getTerminal(board);
  if (terminal !== undefined) {
    return terminal;
  }

  let result = CONTROLS.get(mark)!;
  const reconcile = RECONCILERS.get(mark)!;
  const otherMark = marks.other(mark);
  for (const action of actions(board)) {
    result = reconcile(result, judge(resultOf(board, mark, action), otherMark));
  }

  return result;
}

export default class HardComputer extends Computer {
  async getMoves(board: Board, mark: Mark): Promise<number[]> {
    const actions = simpleActions(board);
    const otherMark = marks.other(mark);
    const scores = actions.map((action) =>
      judge(resultOf(board, mark, action), otherMark)
    );
    const bestScore = scores.reduce(
      RECONCILERS.get(mark)!,
      CONTROLS.get(mark)!
    );

    return actions.filter((_, i) => scores[i] === bestScore);
  }
}
