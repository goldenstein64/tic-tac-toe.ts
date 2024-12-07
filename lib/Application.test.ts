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

  describe("choosePlayers", () => {
    it("retries invalid inputs for players", async () => {
      let mockConn = new MockConnection(["@", "C", "H", "@", "@", "H"]);
      let app = new Application(mockConn);

      let players = await app.choosePlayers();

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/promptPlayer", mark: "X" },
        { id: "app/err/playerInvalid", input: "@" },
        { id: "app/msg/promptPlayer", mark: "X" },
        { id: "app/msg/promptComputer", mark: "X" },
        { id: "app/msg/promptPlayer", mark: "O" },
        { id: "app/err/playerInvalid", input: "@" },
        { id: "app/msg/promptPlayer", mark: "O" },
        { id: "app/err/playerInvalid", input: "@" },
        { id: "app/msg/promptPlayer", mark: "O" },
      ]);
      expect(players[0]).toBeInstanceOf(HardComputer);
      expect(players[1]).toBeInstanceOf(Human);
    });

    it("retries invalid second inputs for computers", async () => {
      let mockConn = new MockConnection([
        "C",
        "@",
        "C",
        "M",
        "@",
        "C",
        "@",
        "C",
        "E",
      ]);
      let app = new Application(mockConn);

      let players = await app.choosePlayers();

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/promptPlayer", mark: "X" },
        { id: "app/msg/promptComputer", mark: "X" },
        { id: "app/err/computerInvalid", input: "@" },
        { id: "app/msg/promptPlayer", mark: "X" },
        { id: "app/msg/promptComputer", mark: "X" },
        { id: "app/msg/promptPlayer", mark: "O" },
        { id: "app/err/playerInvalid", input: "@" },
        { id: "app/msg/promptPlayer", mark: "O" },
        { id: "app/msg/promptComputer", mark: "O" },
        { id: "app/err/computerInvalid", input: "@" },
        { id: "app/msg/promptPlayer", mark: "O" },
        { id: "app/msg/promptComputer", mark: "O" },
      ]);
      expect(players[0]).toBeInstanceOf(MediumComputer);
      expect(players[1]).toBeInstanceOf(EasyComputer);
    });
  });

  describe("displayWinner", () => {
    it("outputs a tie when given undefined", async () => {
      let mockConn = new MockConnection();
      let app = new Application(mockConn);

      await app.displayWinner(undefined);

      expect(mockConn.outputs).toStrictEqual([{ id: "app/msg/tied" }]);
    });

    it("outputs the winner when given 'X'", async () => {
      let mockConn = new MockConnection();
      let app = new Application(mockConn);

      await app.displayWinner("X");

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/playerWon", mark: "X" },
      ]);
    });

    it("outputs the winner when given 'O'", async () => {
      let mockConn = new MockConnection();
      let app = new Application(mockConn);

      await app.displayWinner("O");

      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/playerWon", mark: "O" },
      ]);
    });
  });

  describe("playTurn", () => {
    it("outputs board", async () => {
      let mockConn = new MockConnection(["1"]);
      let app = new Application(mockConn);

      let endResult = await app.playTurn(new Human(mockConn), "X");

      expect(endResult).toBeUndefined();
      expect(mockConn.outputs).toStrictEqual([
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board: app.board },
      ]);
    });
  });

  describe("playGame", () => {
    it("can run a game of tic-tac-toe between humans", async () => {
      let mockConn = new MockConnection(["1", "2", "7", "4", "9", "5", "8"]);
      let app = new Application(mockConn);

      let winner = await app.playGame([
        new Human(mockConn),
        new Human(mockConn),
      ]);

      expect(winner).toBe("X");
      expect(mockConn.outputs).toStrictEqual([
        { id: "app/msg/board", board: app.board },
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board: app.board },
        { id: "human/msg/promptMove", mark: "O" },
        { id: "app/msg/board", board: app.board },
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board: app.board },
        { id: "human/msg/promptMove", mark: "O" },
        { id: "app/msg/board", board: app.board },
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board: app.board },
        { id: "human/msg/promptMove", mark: "O" },
        { id: "app/msg/board", board: app.board },
        { id: "human/msg/promptMove", mark: "X" },
        { id: "app/msg/board", board: app.board },
      ]);
    });
  });
});
