import { describe, it, expect } from "@jest/globals";
import { Board } from "./Board";

describe("Board", () => {
  describe("won", () => {
    it("detects all legal matches", () => {
      let winPatterns: string[] = [
        "XXX,,,,,,",
        ",,,XXX,,,",
        ",,,,,,XXX",
        "X,,X,,X,,",
        ",X,,X,,X,",
        ",,X,,X,,X",
        "X,,,X,,,X",
        ",,X,X,X,,",
      ];

      for (let pattern of winPatterns) {
        let oPattern = pattern.replaceAll("X", "O");
        let xBoard = Board.fromPattern(pattern);
        let oBoard = Board.fromPattern(oPattern);
        expect(xBoard.won("X")).toBe(true);
        expect(oBoard.won("O")).toBe(true);
        expect(xBoard.won("O")).toBe(false);
        expect(oBoard.won("X")).toBe(false);
      }
    });

    it("detects no match", () => {
      let tiePatterns: string[] = ["XXOOOXXXO", "XXOOOXXOX", "XXOOXXXOO"];

      for (let pattern of tiePatterns) {
        let board = Board.fromPattern(pattern);
        expect(board.won("X")).toBe(false);
        expect(board.won("O")).toBe(false);
      }
    });
  });

  describe("empty", () => {
    it("detects empty", () => {
      expect(new Board().empty()).toBe(true);
    });

    it("detects non-empty", () => {
      expect(Board.fromPattern("XO,XO,XO,").empty()).toBe(false);
      expect(Board.fromPattern("XXXXXXXX,").empty()).toBe(false);
      expect(Board.fromPattern(",XXXXXXXX").empty()).toBe(false);
      expect(Board.fromPattern("X,,,,,,,,").empty()).toBe(false);
      expect(Board.fromPattern(",,,,,,,,X").empty()).toBe(false);
    });
  });

  describe("full", () => {
    it("detects full", () => {
      expect(Board.fromPattern("XXOOOXXXO").full()).toBe(true);
      expect(Board.fromPattern("XXOOOXXOX").full()).toBe(true);
      expect(Board.fromPattern("XXOOXXXOO").full()).toBe(true);
    });

    it("detects not full", () => {
      expect(Board.fromPattern("XO,XO,XO,").full()).toBe(false);
      expect(Board.fromPattern("XXXXXXXX,").full()).toBe(false);
      expect(Board.fromPattern(",XXXXXXXX").full()).toBe(false);
      expect(Board.fromPattern("X,,,,,,,,").full()).toBe(false);
      expect(Board.fromPattern(",,,,,,,,X").full()).toBe(false);
    });
  });

  describe("isMarkedWith", () => {
    it("returns false on a bad position", () => {
      let empty = new Board();

      expect(empty.isMarkedWith(-1, undefined)).toBe(false);
      expect(empty.isMarkedWith(0, undefined)).toBe(true);
      expect(empty.isMarkedWith(1, undefined)).toBe(true);
      expect(empty.isMarkedWith(7, undefined)).toBe(true);
      expect(empty.isMarkedWith(8, undefined)).toBe(true);
      expect(empty.isMarkedWith(9, undefined)).toBe(false);
    });
  });
});
