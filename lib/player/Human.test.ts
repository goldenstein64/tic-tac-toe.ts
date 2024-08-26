import type { Message } from "../data/Messages";

import { describe, it, expect } from "bun:test";
import MockConnection from "../../test/MockConnection";
import Human from "./Human";
import Board from "../data/Board";

describe("Human", () => {
  describe("getMoveOnce", () => {
    it("asks for a move from its connection", async () => {
      const board = new Board();
      const mockConn = new MockConnection(["2"]);
      const human = new Human(mockConn);

      const move = await human.getMoveOnce(board, "X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "human/msg/promptMove", mark: "X" },
      ] as Message[]);

      expect(move).toBe(1);
    });

    it("states whether a position is occupied", async () => {
      const board = Board.fromPattern(",XO,,,,,,");
      const mockConn = new MockConnection(["3"]);
      const human = new Human(mockConn);

      const move = await human.getMoveOnce(board, "X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "human/msg/promptMove", mark: "X" },
        { id: "human/err/occupied", choice: 3 },
      ] as Message[]);
      expect(move).toBeUndefined();
    });

    it("states whether a position is out of range", async () => {
      const board = Board.fromPattern(",,,,,,,,,");
      const mockConn = new MockConnection(["0"]);
      const human = new Human(mockConn);

      const move = await human.getMoveOnce(board, "X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "human/msg/promptMove", mark: "X" },
        { id: "human/err/outOfRange", choice: 0 },
      ] as Message[]);
      expect(move).toBeUndefined();
    });

    it("states that a huge input isn't a number", async () => {
      const board = Board.fromPattern(",,,,,,,,,");
      const mockConn = new MockConnection(["9".repeat(500)]);
      const human = new Human(mockConn);

      const move = await human.getMoveOnce(board, "X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "human/msg/promptMove", mark: "X" },
        { id: "human/err/nan", input: `${"9".repeat(10)}...` },
      ] as Message[]);
      expect(move).toBeUndefined();
    });

    it("states that a non-number input isn't a number", async () => {
      const board = Board.fromPattern(",,,,,,,,,");
      const mockConn = new MockConnection(["icofsvdnmklsdcfas"]);
      const human = new Human(mockConn);

      const move = await human.getMoveOnce(board, "X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "human/msg/promptMove", mark: "X" },
        { id: "human/err/nan", input: "icofsvdnmk..." },
      ] as Message[]);
      expect(move).toBeUndefined();
    });
  });
});
