import { randomInt } from "crypto";
import { Player } from "../Application";
import { BOARD_SIZE, Board } from "../data/Board";
import { Mark, marks } from "../data/Mark";
import { range } from "../util/utils";

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

const CONTROLS = new Map<Mark, number>().set("X", -1).set("O", 1);

const RECONCILERS = new Map<Mark, (a: number, b: number) => number>()
  .set("X", Math.max)
  .set("O", Math.min);

/**
 * @returns a number if it is a terminal, otherwise `undefined`
 */
function getTerminal(board: Board): number | undefined {
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

function getSymmetrySet(board: Board): Set<number> {
  let data = board.data;
  let result = EQUALITIES.reduce(
    (set, [a, b], i) => (data[a] == data[b] ? set.add(i) : set),
    new Set<number>()
  );

  return result;
}

function symmetricActions(board: Board): number[] | undefined {
  let symmetrySet = getSymmetrySet(board);
  for (let sym of SYMMETRIES) {
    if (symmetryMatches(sym.equalities, symmetrySet)) return sym.image;
  }

  return undefined;
}

function simpleActions(board: Board): number[] {
  return range(9).filter((i) => board.canMark(i));
}

function actions(board: Board): number[] {
  return symmetricActions(board) ?? simpleActions(board);
}

function resultOf(board: Board, mark: Mark, move: number): Board {
  let result = board.clone();
  result.setMark(move, mark);
  return result;
}

function judge(board: Board, mark: Mark): number {
  let terminal = getTerminal(board);
  if (terminal != undefined) {
    return terminal;
  }

  let result = CONTROLS.get(mark)!;
  let reconcile = RECONCILERS.get(mark)!;
  let otherMark = marks.other(mark);
  for (let action of actions(board)) {
    let newBoard = resultOf(board, mark, action);
    result = reconcile(result, judge(newBoard, otherMark));
  }

  return result;
}

export class HardComputer implements Player {
  getMoves(board: Board, mark: Mark): number[] {
    let actions = simpleActions(board);
    let otherMark = marks.other(mark);
    let scores = actions
      .map((action) => resultOf(board, mark, action))
      .map((newBoard) => judge(newBoard, otherMark));

    let bestScore = Math.max(...scores);
    let bestMoves = actions
      .map<[number, number]>((action, i) => [action, scores[i]])
      .filter(([_, score]) => score == bestScore)
      .map(([action]) => action);

    return bestMoves;
  }

  async getMove(board: Board, mark: Mark): Promise<number> {
    if (board.empty()) {
      return randomInt(BOARD_SIZE);
    } else {
      let moves = this.getMoves(board, mark);
      return moves[randomInt(moves.length)];
    }
  }
}
