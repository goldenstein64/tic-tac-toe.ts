import type { Player } from ".";
import type { Mark } from "../data/Mark";

import { describe, it, expect } from "bun:test";

import MediumComputer from "./MediumComputer";
import HardComputer from "./HardComputer";
import Board from "../data/Board";

const computerCases: readonly (readonly [string, Player])[] = [
  ["MediumComputer", new MediumComputer()],
  ["HardComputer", new HardComputer()],
];

const testCases: readonly (readonly [string, Mark, number])[] = [
  [",XX,OO,,,", "X", 0], // X winning move
  [",OO,XX,,X", "O", 0], // O winning move
  ["O,,O,X,X,", "X", 6], // X blocking move
  [",O,X,,XXO", "O", 0], // O blocking move
  [",X,O,X,O,", "X", 2], // X trapping move
  [",X,OXX,O,", "O", 6], // O trapping move
  [",XXXOOOX,", "O", 0], // O edge case
];

for (const [computerName, computer] of computerCases) {
  describe(computerName, () => {
    for (const [pattern, mark, expected] of testCases) {
      it(`can solve ${pattern} as ${mark}`, async () => {
        const board = Board.fromPattern(pattern);

        expect(await computer.getMove(board, mark)).toBe(expected);
      });
    }
  });
}
