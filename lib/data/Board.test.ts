import { describe, it, expect } from "bun:test";
import Board, { BOARD_SIZE } from "./Board";

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

    it("matches on Mark", () => {
      let board = Board.fromPattern("XO,XO,XO,");

      expect(board.isMarkedWith(0, "X")).toBe(true);
      expect(board.isMarkedWith(0, "O")).toBe(false);
      expect(board.isMarkedWith(0, undefined)).toBe(false);

      expect(board.isMarkedWith(1, "X")).toBe(false);
      expect(board.isMarkedWith(1, "O")).toBe(true);
      expect(board.isMarkedWith(1, undefined)).toBe(false);

      expect(board.isMarkedWith(2, "X")).toBe(false);
      expect(board.isMarkedWith(2, "O")).toBe(false);
      expect(board.isMarkedWith(2, undefined)).toBe(true);
    });
  });

  describe("canMark", () => {
    it("matches on undefined", () => {
      let board = Board.fromPattern("XO,XO,XO,");

      expect(board.canMark(0)).toBe(false);
      expect(board.canMark(1)).toBe(false);
      expect(board.canMark(2)).toBe(true);
      expect(board.canMark(3)).toBe(false);
      expect(board.canMark(4)).toBe(false);
      expect(board.canMark(5)).toBe(true);
      expect(board.canMark(6)).toBe(false);
      expect(board.canMark(7)).toBe(false);
      expect(board.canMark(8)).toBe(true);
    });
  });

  describe("setMark", () => {
    it("throws on occupied", () => {
      let board = Board.fromPattern(",,X,,,,,,");

      expect(() => board.setMark(2, "O")).toThrowError(TypeError);
    });

    it("throws on out of range", () => {
      let board = new Board();

      expect(() => board.setMark(10, "X")).toThrowError(TypeError);
    });

    it("changes the board's state", () => {
      for (let i = 0; i < BOARD_SIZE; i++) {
        let board = new Board();
        expect(board.canMark(i)).toBe(true);
        board.setMark(i, "X");
        expect(board.canMark(i)).toBe(false);
      }
    });
  });

  describe("ended", () => {
    it("returns X as winner when they win on a full board", () => {
      let board = Board.fromPattern("XXXXOOOOX");

      expect(board.ended("X")).toEqual({ winner: "X" });
      expect(board.ended("O")).toEqual({ winner: undefined });
    });

    it("returns O as winner when they win on a full board", () => {
      let board = Board.fromPattern("OXXOOXXXO");

      expect(board.ended("X")).toEqual({ winner: undefined });
      expect(board.ended("O")).toEqual({ winner: "O" });
    });

    it("returns nothing as winner when tying on a full board", () => {
      let board = Board.fromPattern("OXOXOXXOX");

      expect(board.ended("X")).toEqual({ winner: undefined });
      expect(board.ended("O")).toEqual({ winner: undefined });
    });

    it("returns nothing when the board is not full", () => {
      let board = Board.fromPattern("OXOXOXX,X");

      expect(board.ended("X")).toBeUndefined();
      expect(board.ended("O")).toBeUndefined();
    });

    it("returns X as winner when they win", () => {
      let board = Board.fromPattern("XXXX,OOOX");

      expect(board.ended("X")).toEqual({ winner: "X" });
      expect(board.ended("O")).toBeUndefined();
    });

    it("returns O as winner when they win", () => {
      let board = Board.fromPattern("OXXOOXX,O");

      expect(board.ended("X")).toBeUndefined();
      expect(board.ended("O")).toEqual({ winner: "O" });
    });
  });
});
