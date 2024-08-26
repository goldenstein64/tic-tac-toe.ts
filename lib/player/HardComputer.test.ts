import { describe, it, expect } from "bun:test";
import { randomInt } from "crypto";

import { getTerminal, resultOf } from "./HardComputer";
import Board, { BOARD_SIZE } from "../data/Board";
import type { Mark } from "../data/Mark";
import { range } from "../util/utils";

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

describe("HardComputer", () => {
  describe("getTerminal", () => {
    const TEST_CASES: [string, number | undefined][] = [
      ["OXXXOOOXX", 0],
      ["X,,XOOX,,", 1],
      ["XXXXOOOXO", 1],
      ["O,,OXXO,X", -1],
      ["XXOXOXOOX", -1],
      [",,,,,,,,,", undefined],
    ];

    for (const [pattern, expected] of TEST_CASES) {
      it(`returns ${expected} for ${pattern}`, () => {
        const board = Board.fromPattern(pattern);

        expect<number | undefined>(getTerminal(board)).toEqual(expected);
      });
    }
  });

  describe("resultOf", () => {
    const MARK_CHOICES: (Mark | undefined)[] = ["X", "O", undefined];

    function* generateData(
      trials: number
    ): Generator<[Board, Mark, number, Board]> {
      let currentTrials = 0;
      while (currentTrials < trials) {
        const initialValues = range(BOARD_SIZE).map(
          () => MARK_CHOICES[randomInt(MARK_CHOICES.length)]
        );

        const emptyIndexes = filterIndex(initialValues, (m) => m === undefined);

        if (emptyIndexes.length === 0) continue;

        expect(emptyIndexes.length).toBeWithin(1, BOARD_SIZE);
        const chosenIndex = emptyIndexes[randomInt(emptyIndexes.length)];

        const expectedValues = [...initialValues];
        const chosenMark = randomInt(2) === 0 ? "X" : "O";
        expectedValues[chosenIndex] = chosenMark;

        const initial = new Board(initialValues);
        const expected = new Board(expectedValues);

        yield [initial, chosenMark, chosenIndex, expected];
        currentTrials++;
      }
    }

    it("passes fuzz", () => {
      for (const [initial, mark, move, expected] of generateData(50)) {
        const actual = resultOf(initial, mark, move);

        expect(actual.data).toEqual(expected.data);
      }
    });
  });
});
