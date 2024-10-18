import type { Message } from "./data/Messages";

import { describe, it, expect } from "bun:test";

import MockConnection from "../test/MockConnection";
import Application from "./Application";
import HardComputer from "./player/HardComputer";
import MediumComputer from "./player/MediumComputer";
import EasyComputer from "./player/EasyComputer";
import Human from "./player/Human";
import { Board } from "./data";

describe("Application", () => {
  describe("choosePlayerOnce", () => {
    it("returns computer on CH", async () => {
      let mockConn = new MockConnection(["C", "H"]);
      let app = new Application(mockConn);
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/promptPlayer", mark: "X" },
        { id: "app/msg/promptComputer", mark: "X" },
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(HardComputer);
    });

    it("returns computer on CM", async () => {
      let mockConn = new MockConnection(["C", "M"]);
      let app = new Application(mockConn);
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/promptPlayer", mark: "X" },
        { id: "app/msg/promptComputer", mark: "X" },
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(MediumComputer);
    });

    it("returns computer on CE", async () => {
      let mockConn = new MockConnection(["C", "E"]);
      let app = new Application(mockConn);
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/promptPlayer", mark: "X" },
        { id: "app/msg/promptComputer", mark: "X" },
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(EasyComputer);
    });

    it("returns human on H", async () => {
      let mockConn = new MockConnection(["H"]);
      let app = new Application(mockConn);
      let chosenPlayer = await app.choosePlayerOnce("X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/promptPlayer", mark: "X" },
      ] as Message[]);

      expect(chosenPlayer).toBeInstanceOf(Human);
    });
  });

  describe("displayWinner", () => {
    it("outputs a tie when given undefined", () => {
      let mockConn = new MockConnection();
      let app = new Application(mockConn);

      app.displayWinner(undefined);

      expect(mockConn.outputs).toStrictEqual([{ id: "app/msg/tied" }]);
    });

    it("outputs the winner when given 'X'", () => {
      let mockConn = new MockConnection();
      let app = new Application(mockConn);

      app.displayWinner("X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/playerWon", mark: "X" },
      ]);
    });

    it("outputs the winner when given 'O'", () => {
      let mockConn = new MockConnection();
      let app = new Application(mockConn);

      app.displayWinner("O");

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/playerWon", mark: "O" },
      ]);
    });
  });

  describe("playGame", () => {
    it("can run a game of tic-tac-toe between humans", async () => {
      let mockConn = new MockConnection(["1", "2", "7", "4", "9", "5", "8"]);
      let app = new Application(mockConn);

      let board = new Board();
      let winner = await app.playGame(board, [
        new Human(mockConn),
        new Human(mockConn),
      ]);

      expect(winner).toBe("X");
      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/board", board },
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board },
        { id: "human/msg/promptMove", mark: "O" },
        { id: "app/msg/board", board },
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board },
        { id: "human/msg/promptMove", mark: "O" },
        { id: "app/msg/board", board },
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board },
        { id: "human/msg/promptMove", mark: "O" },
        { id: "app/msg/board", board },
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board },
      ]);
    });
  });
});
